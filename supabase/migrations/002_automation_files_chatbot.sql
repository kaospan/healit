-- ============================================================================
-- HEALIT AUTOMATION + FILE + CHATBOT SCHEMA
-- Migration 002 - Production-Grade Automation Engine & Chatbot
-- ============================================================================

-- ============================================================================
-- AUTOMATION ENGINE (Real, Reliable, Observable)
-- ============================================================================

CREATE TYPE automation_trigger_type AS ENUM ('manual', 'on_upload', 'schedule');
CREATE TYPE automation_run_status AS ENUM ('queued', 'running', 'success', 'failed', 'canceled');
CREATE TYPE automation_step_status AS ENUM ('pending', 'running', 'success', 'failed', 'skipped');

-- Automation definitions
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type automation_trigger_type NOT NULL,
  config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automations_clinic ON automations(clinic_id);
CREATE INDEX idx_automations_enabled ON automations(is_enabled) WHERE is_enabled = TRUE;
CREATE INDEX idx_automations_trigger ON automations(trigger_type);

-- Automation runs (every execution tracked)
CREATE TABLE automation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  automation_id UUID NOT NULL REFERENCES automations(id),
  idempotency_key TEXT UNIQUE, -- Prevent double-processing
  status automation_run_status NOT NULL DEFAULT 'queued',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  metrics_json JSONB DEFAULT '{}'::jsonb, -- rows_processed, rows_failed, etc.
  error_json JSONB, -- Error details on failure
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automation_runs_clinic ON automation_runs(clinic_id);
CREATE INDEX idx_automation_runs_automation ON automation_runs(automation_id);
CREATE INDEX idx_automation_runs_status ON automation_runs(status);
CREATE INDEX idx_automation_runs_idempotency ON automation_runs(idempotency_key);
CREATE INDEX idx_automation_runs_created ON automation_runs(created_at DESC);

-- Automation run logs (append-only, no updates/deletes)
CREATE TABLE automation_run_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES automation_runs(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  context_json JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_automation_run_logs_run ON automation_run_logs(run_id, ts);
CREATE INDEX idx_automation_run_logs_level ON automation_run_logs(level);

-- Automation run steps (for detailed progress tracking)
CREATE TABLE automation_run_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES automation_runs(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status automation_step_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  metrics_json JSONB DEFAULT '{}'::jsonb,
  error_json JSONB
);

CREATE INDEX idx_automation_run_steps_run ON automation_run_steps(run_id, step_order);
CREATE INDEX idx_automation_run_steps_status ON automation_run_steps(status);

-- ============================================================================
-- FILE UPLOAD & DOCUMENT PROCESSING PIPELINE
-- ============================================================================

CREATE TYPE file_processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE record_validation_status AS ENUM ('valid', 'warning', 'error');

-- Files table (uploaded CSV/XLSX/PDF)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Storage path (Supabase Storage or S3)
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  checksum TEXT NOT NULL, -- SHA-256 hash for integrity
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processing_status file_processing_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  row_count INTEGER, -- Number of rows parsed
  error_message TEXT
);

CREATE INDEX idx_files_clinic ON files(clinic_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_status ON files(processing_status);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at DESC);

-- Parsed records (normalized data from files)
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  data_json JSONB NOT NULL, -- Actual parsed data
  validation_status record_validation_status NOT NULL DEFAULT 'valid',
  validation_errors JSONB, -- Array of error messages
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_records_clinic ON records(clinic_id);
CREATE INDEX idx_records_file ON records(file_id);
CREATE INDEX idx_records_validation ON records(validation_status);
CREATE INDEX idx_records_data ON records USING GIN (data_json); -- For fast JSONB queries

-- Schema mappings (per clinic, how to map columns)
CREATE TABLE schema_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  name TEXT NOT NULL,
  source_columns JSONB NOT NULL, -- Array of source column names
  target_schema JSONB NOT NULL, -- Mapping to internal schema
  transformation_rules JSONB, -- Optional transformation logic
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(clinic_id, name)
);

CREATE INDEX idx_schema_mappings_clinic ON schema_mappings(clinic_id);

-- Record edit history (audit trail for inline edits)
CREATE TABLE record_edit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  edited_by UUID NOT NULL REFERENCES users(id),
  old_data_json JSONB NOT NULL,
  new_data_json JSONB NOT NULL,
  changed_fields TEXT[] NOT NULL,
  edit_reason TEXT,
  edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_record_edit_history_record ON record_edit_history(record_id, edited_at);
CREATE INDEX idx_record_edit_history_editor ON record_edit_history(edited_by);

-- ============================================================================
-- MEDICAL DOCUMENTS (Referrals, Lab Results, etc.)
-- ============================================================================

CREATE TABLE medical_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  patient_id UUID REFERENCES users(id),
  file_id UUID REFERENCES files(id), -- Link to uploaded file
  document_type TEXT NOT NULL CHECK (document_type IN ('lab_result', 'imaging', 'prescription', 'referral', 'discharge_summary', 'other')),
  document_date DATE,
  extracted_text TEXT, -- OCR output
  extracted_data JSONB, -- Structured extraction
  processing_status file_processing_status NOT NULL DEFAULT 'pending',
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_medical_documents_clinic ON medical_documents(clinic_id);
CREATE INDEX idx_medical_documents_patient ON medical_documents(patient_id);
CREATE INDEX idx_medical_documents_type ON medical_documents(document_type);
CREATE INDEX idx_medical_documents_status ON medical_documents(processing_status);

-- ============================================================================
-- CHATBOT (DB-Integrated, Safe, Auditable)
-- ============================================================================

CREATE TYPE chat_thread_status AS ENUM ('active', 'closed', 'archived');

-- Chat threads (conversations scoped to org)
CREATE TABLE chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT,
  status chat_thread_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_chat_threads_clinic ON chat_threads(clinic_id);
CREATE INDEX idx_chat_threads_user ON chat_threads(user_id);
CREATE INDEX idx_chat_threads_status ON chat_threads(status);
CREATE INDEX idx_chat_threads_last_message ON chat_threads(last_message_at DESC);

-- Chat messages (user + assistant)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  referenced_records JSONB, -- IDs of records/files/runs mentioned
  tool_calls_json JSONB, -- Log of what tools were called (for audit)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_thread ON chat_messages(thread_id, created_at);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);
CREATE INDEX idx_chat_messages_references ON chat_messages USING GIN (referenced_records);

-- Chatbot tools audit (every tool call logged)
CREATE TABLE chatbot_tool_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  user_id UUID NOT NULL REFERENCES users(id),
  tool_name TEXT NOT NULL,
  arguments_json JSONB NOT NULL,
  result_json JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  permission_denied BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chatbot_tool_calls_thread ON chatbot_tool_calls(thread_id);
CREATE INDEX idx_chatbot_tool_calls_clinic ON chatbot_tool_calls(clinic_id);
CREATE INDEX idx_chatbot_tool_calls_user ON chatbot_tool_calls(user_id);
CREATE INDEX idx_chatbot_tool_calls_tool ON chatbot_tool_calls(tool_name);
CREATE INDEX idx_chatbot_tool_calls_permission_denied ON chatbot_tool_calls(permission_denied) WHERE permission_denied = TRUE;

-- ============================================================================
-- STAFF TASKS / REMINDERS (Created by Chatbot or Users)
-- ============================================================================

CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'canceled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE staff_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id), -- NULL if created by chatbot
  created_by_chatbot BOOLEAN DEFAULT FALSE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  related_patient_id UUID REFERENCES users(id),
  related_follow_through_id UUID REFERENCES follow_through_items(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_staff_tasks_clinic ON staff_tasks(clinic_id);
CREATE INDEX idx_staff_tasks_assigned ON staff_tasks(assigned_to);
CREATE INDEX idx_staff_tasks_status ON staff_tasks(status);
CREATE INDEX idx_staff_tasks_priority ON staff_tasks(priority);
CREATE INDEX idx_staff_tasks_due_date ON staff_tasks(due_date);
CREATE INDEX idx_staff_tasks_chatbot ON staff_tasks(created_by_chatbot) WHERE created_by_chatbot = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Org Isolation
-- ============================================================================

-- Automations: Only accessible within clinic
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic automations isolation" ON automations
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Automation runs: Only accessible within clinic
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic automation runs isolation" ON automation_runs
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Files: Only accessible within clinic
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic files isolation" ON files
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Records: Only accessible within clinic
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic records isolation" ON records
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Medical documents: Only accessible within clinic
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic medical documents isolation" ON medical_documents
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Chat threads: Only accessible within clinic
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic chat threads isolation" ON chat_threads
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Staff tasks: Only accessible within clinic
ALTER TABLE staff_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic staff tasks isolation" ON staff_tasks
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_runs_updated_at BEFORE UPDATE ON automation_runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_records_updated_at BEFORE UPDATE ON records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_tasks_updated_at BEFORE UPDATE ON staff_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update last_message_at on chat threads
CREATE OR REPLACE FUNCTION update_chat_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_threads
  SET last_message_at = NEW.created_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_last_message AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_thread_last_message();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Calculate automation run duration on finish
CREATE OR REPLACE FUNCTION calculate_automation_run_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.finished_at IS NOT NULL AND OLD.finished_at IS NULL THEN
    NEW.duration_ms := EXTRACT(EPOCH FROM (NEW.finished_at - NEW.started_at)) * 1000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_automation_run_duration BEFORE UPDATE ON automation_runs
  FOR EACH ROW EXECUTE FUNCTION calculate_automation_run_duration();

-- Calculate automation step duration on finish
CREATE OR REPLACE FUNCTION calculate_step_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.finished_at IS NOT NULL AND OLD.finished_at IS NULL THEN
    NEW.duration_ms := EXTRACT(EPOCH FROM (NEW.finished_at - NEW.started_at)) * 1000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_step_duration BEFORE UPDATE ON automation_run_steps
  FOR EACH ROW EXECUTE FUNCTION calculate_step_duration();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE automations IS 'Automation definitions - no mocks, all DB-backed';
COMMENT ON TABLE automation_runs IS 'Every execution tracked with idempotency';
COMMENT ON TABLE automation_run_logs IS 'Append-only logs for debugging';
COMMENT ON TABLE automation_run_steps IS 'Granular progress tracking';
COMMENT ON TABLE files IS 'Real file uploads with checksums';
COMMENT ON TABLE records IS 'Normalized records from parsed files';
COMMENT ON TABLE medical_documents IS 'Medical documents with OCR extraction';
COMMENT ON TABLE chat_threads IS 'Chatbot conversations - org scoped';
COMMENT ON TABLE chat_messages IS 'All messages - user and assistant';
COMMENT ON TABLE chatbot_tool_calls IS 'Audit trail of every tool call';
COMMENT ON TABLE staff_tasks IS 'Tasks created by chatbot or users';
