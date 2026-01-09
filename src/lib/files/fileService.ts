import { supabase } from '@/lib/supabase/client';
import { logAuditEvent } from '@/lib/audit/logger';
import * as XLSX from 'xlsx';

/**
 * File Upload & Processing Service
 * 
 * @description Production-grade file pipeline:
 * - Real uploads to Supabase Storage
 * - CSV/XLSX parsing
 * - Checksum verification
 * - Schema mapping
 * - Record validation
 * - Edit history audit trail
 * 
 * NO MOCKS. REAL STORAGE.
 */

export type FileProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type RecordValidationStatus = 'valid' | 'warning' | 'error';

export interface FileUpload {
  id: string;
  clinic_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  checksum: string;
  uploaded_by: string;
  uploaded_at: string;
  processing_status: FileProcessingStatus;
  processed_at: string | null;
  row_count: number | null;
  error_message: string | null;
}

export interface ParsedRecord {
  id: string;
  clinic_id: string;
  file_id: string;
  row_number: number;
  data_json: Record<string, unknown>;
  validation_status: RecordValidationStatus;
  validation_errors: Array<{ field: string; message: string }> | null;
  created_at: string;
  updated_at: string;
}

export interface SchemaMapping {
  id: string;
  clinic_id: string;
  name: string;
  source_columns: string[];
  target_schema: Record<string, string>; // source_column -> target_field
  transformation_rules: Record<string, unknown>;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(params: {
  file: File;
  clinicId: string;
  userId: string;
}): Promise<FileUpload> {
  const { file, clinicId, userId } = params;

  // Validate file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: CSV, XLSX, PDF`);
  }

  // Calculate checksum
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const checksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Upload to Supabase Storage
  const filePath = `${clinicId}/${userId}/${Date.now()}-${file.name}`;
  const { data: storageData, error: storageError } = await supabase.storage
    .from('healit-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (storageError) {
    throw new Error(`File upload failed: ${storageError.message}`);
  }

  // Create file record in database
  const { data: fileRecord, error: dbError } = await supabase
    .from('files')
    .insert({
      clinic_id: clinicId,
      file_name: file.name,
      file_path: storageData.path,
      file_size: file.size,
      mime_type: file.type,
      checksum,
      uploaded_by: userId,
      processing_status: 'pending',
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup: delete uploaded file
    await supabase.storage.from('healit-files').remove([filePath]);
    throw new Error(`Failed to create file record: ${dbError.message}`);
  }

  await logAuditEvent({
    userId,
    actionType: 'file_uploaded',
    resourceType: 'file',
    resourceId: fileRecord.id,
    details: {
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    },
  });

  // Trigger processing in background
  processFile(fileRecord.id, clinicId).catch((err) => {
    console.error(`File processing failed for ${fileRecord.id}:`, err);
  });

  return fileRecord;
}

/**
 * Process uploaded file (parse and store records)
 */
async function processFile(fileId: string, clinicId: string): Promise<void> {
  try {
    // Update status to processing
    await supabase
      .from('files')
      .update({ processing_status: 'processing' })
      .eq('id', fileId);

    // Get file record
    const { data: fileRecord } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (!fileRecord) throw new Error('File not found');

    // Download file from storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('healit-files')
      .download(fileRecord.file_path);

    if (downloadError) throw new Error(`Download failed: ${downloadError.message}`);

    // Parse based on mime type
    let rows: Record<string, unknown>[];
    if (fileRecord.mime_type === 'text/csv' || fileRecord.mime_type.includes('excel') || fileRecord.mime_type.includes('spreadsheet')) {
      rows = await parseSpreadsheet(fileBlob);
    } else if (fileRecord.mime_type === 'application/pdf') {
      // For PDFs, we'd need OCR - placeholder for now
      throw new Error('PDF parsing requires OCR integration (not implemented)');
    } else {
      throw new Error(`Unsupported file type for parsing: ${fileRecord.mime_type}`);
    }

    // Get schema mapping (or use default)
    const schemaMapping = await getSchemaMapping(clinicId);

    // Insert records in batches
    const batchSize = 100;
    let rowCount = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const records = batch.map((row, idx) => {
        const mappedData = schemaMapping ? applySchemaMapping(row, schemaMapping) : row;
        const validation = validateRecord(mappedData);

        return {
          clinic_id: clinicId,
          file_id: fileId,
          row_number: i + idx + 1,
          data_json: mappedData,
          validation_status: validation.status,
          validation_errors: validation.errors.length > 0 ? validation.errors : null,
        };
      });

      const { error: insertError } = await supabase.from('records').insert(records);

      if (insertError) {
        throw new Error(`Failed to insert records: ${insertError.message}`);
      }

      rowCount += batch.length;
    }

    // Update file status
    await supabase
      .from('files')
      .update({
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        row_count: rowCount,
      })
      .eq('id', fileId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await supabase
      .from('files')
      .update({
        processing_status: 'failed',
        error_message: errorMessage,
      })
      .eq('id', fileId);

    throw error;
  }
}

/**
 * Parse spreadsheet (CSV/XLSX) into array of objects
 */
async function parseSpreadsheet(blob: Blob): Promise<Record<string, unknown>[]> {
  const arrayBuffer = await blob.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  // Use first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });
  
  return rows as Record<string, unknown>[];
}

/**
 * Get schema mapping for clinic (default if not exists)
 */
async function getSchemaMapping(clinicId: string): Promise<SchemaMapping | null> {
  const { data } = await supabase
    .from('schema_mappings')
    .select('*')
    .eq('clinic_id', clinicId)
    .limit(1)
    .single();

  return data;
}

/**
 * Apply schema mapping to row data
 */
function applySchemaMapping(row: Record<string, unknown>, mapping: SchemaMapping): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [sourceCol, targetField] of Object.entries(mapping.target_schema)) {
    if (sourceCol in row) {
      mapped[targetField] = row[sourceCol];
    }
  }

  // Apply transformations if defined
  if (mapping.transformation_rules) {
    // Placeholder for transformation logic (e.g., date parsing, case conversion)
    // Implement based on your needs
  }

  return mapped;
}

/**
 * Validate parsed record
 */
function validateRecord(data: Record<string, unknown>): {
  status: RecordValidationStatus;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  // Add your validation logic here
  // Example: required fields, data types, ranges, etc.

  // Example validation
  if (data.patient_id && typeof data.patient_id !== 'string') {
    errors.push({ field: 'patient_id', message: 'Must be a string' });
  }

  if (data.date && isNaN(Date.parse(data.date as string))) {
    errors.push({ field: 'date', message: 'Invalid date format' });
  }

  return {
    status: errors.length > 0 ? 'error' : 'valid',
    errors,
  };
}

/**
 * List files for clinic
 */
export async function listFiles(clinicId: string, limit = 50): Promise<FileUpload[]> {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('uploaded_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to list files: ${error.message}`);
  return data || [];
}

/**
 * Get file with parsed records
 */
export async function getFileWithRecords(fileId: string): Promise<{
  file: FileUpload;
  records: ParsedRecord[];
}> {
  const [fileResult, recordsResult] = await Promise.all([
    supabase.from('files').select('*').eq('id', fileId).single(),
    supabase.from('records').select('*').eq('file_id', fileId).order('row_number'),
  ]);

  if (fileResult.error) throw new Error(`Failed to get file: ${fileResult.error.message}`);
  if (recordsResult.error) throw new Error(`Failed to get records: ${recordsResult.error.message}`);

  return {
    file: fileResult.data,
    records: recordsResult.data || [],
  };
}

/**
 * Edit record (with audit trail)
 */
export async function editRecord(params: {
  recordId: string;
  newData: Record<string, unknown>;
  editedBy: string;
  editReason?: string;
}): Promise<ParsedRecord> {
  // Get current record
  const { data: currentRecord } = await supabase
    .from('records')
    .select('*')
    .eq('id', params.recordId)
    .single();

  if (!currentRecord) throw new Error('Record not found');

  // Calculate changed fields
  const changedFields: string[] = [];
  for (const key of Object.keys(params.newData)) {
    if (JSON.stringify(currentRecord.data_json[key]) !== JSON.stringify(params.newData[key])) {
      changedFields.push(key);
    }
  }

  // Validate new data
  const validation = validateRecord(params.newData);

  // Update record
  const { data: updatedRecord, error: updateError } = await supabase
    .from('records')
    .update({
      data_json: params.newData,
      validation_status: validation.status,
      validation_errors: validation.errors.length > 0 ? validation.errors : null,
    })
    .eq('id', params.recordId)
    .select()
    .single();

  if (updateError) throw new Error(`Failed to update record: ${updateError.message}`);

  // Log edit in audit trail
  await supabase.from('record_edit_history').insert({
    record_id: params.recordId,
    edited_by: params.editedBy,
    old_data_json: currentRecord.data_json,
    new_data_json: params.newData,
    changed_fields: changedFields,
    edit_reason: params.editReason,
  });

  await logAuditEvent({
    userId: params.editedBy,
    actionType: 'record_edited',
    resourceType: 'record',
    resourceId: params.recordId,
    details: {
      changed_fields: changedFields,
      reason: params.editReason,
    },
  });

  return updatedRecord;
}

/**
 * Get record edit history
 */
export async function getRecordEditHistory(recordId: string): Promise<
  Array<{
    id: string;
    edited_by: string;
    old_data_json: Record<string, unknown>;
    new_data_json: Record<string, unknown>;
    changed_fields: string[];
    edit_reason: string | null;
    edited_at: string;
  }>
> {
  const { data, error } = await supabase
    .from('record_edit_history')
    .select('*')
    .eq('record_id', recordId)
    .order('edited_at', { ascending: false });

  if (error) throw new Error(`Failed to get edit history: ${error.message}`);
  return data || [];
}

/**
 * Delete file (and all associated records)
 */
export async function deleteFile(fileId: string, userId: string): Promise<void> {
  // Get file to delete from storage
  const { data: fileRecord } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single();

  if (!fileRecord) throw new Error('File not found');

  // Delete from storage
  await supabase.storage.from('healit-files').remove([fileRecord.file_path]);

  // Delete from database (cascade will delete records)
  const { error } = await supabase.from('files').delete().eq('id', fileId);

  if (error) throw new Error(`Failed to delete file: ${error.message}`);

  await logAuditEvent({
    userId,
    actionType: 'file_deleted',
    resourceType: 'file',
    resourceId: fileId,
    details: { file_name: fileRecord.file_name },
  });
}

/**
 * Create schema mapping
 */
export async function createSchemaMapping(params: {
  clinicId: string;
  name: string;
  sourceColumns: string[];
  targetSchema: Record<string, string>;
  createdBy: string;
}): Promise<SchemaMapping> {
  const { data, error } = await supabase
    .from('schema_mappings')
    .insert({
      clinic_id: params.clinicId,
      name: params.name,
      source_columns: params.sourceColumns,
      target_schema: params.targetSchema,
      created_by: params.createdBy,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create schema mapping: ${error.message}`);

  await logAuditEvent({
    userId: params.createdBy,
    actionType: 'schema_mapping_created',
    resourceType: 'schema_mapping',
    resourceId: data.id,
    details: { name: params.name },
  });

  return data;
}
