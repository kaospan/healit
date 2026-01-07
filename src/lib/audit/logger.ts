/**
 * Audit & Logging System for Healit
 * 
 * @description All interactions must be logged for compliance and learning
 * @fileoverview Comprehensive audit trail system
 */

import { supabase } from '@/lib/supabase/client';
import { AuditLog, InteractionLog, UserRole } from '@/types';

/**
 * Log user action to audit trail
 */
export async function logAuditEvent(params: {
  userId?: string;
  userRole?: UserRole;
  actionType: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, unknown>;
}): Promise<void> {
  try {
    const auditLog: Omit<AuditLog, 'id'> = {
      user_id: params.userId,
      user_role: params.userRole,
      action_type: params.actionType,
      resource_type: params.resourceType,
      resource_id: params.resourceId,
      details: params.details,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert(auditLog);

    if (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - logging failures shouldn't break app
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

/**
 * Log AI interaction for learning and compliance
 */
export async function logInteraction(params: {
  sessionId: string;
  layer: 'emergency' | 'guidance' | 'coordination' | 'oversight' | 'learning';
  interactionType: string;
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown>;
  aiModelUsed?: string;
  processingTimeMs: number;
}): Promise<void> {
  try {
    const interactionLog: Omit<InteractionLog, 'id'> = {
      session_id: params.sessionId,
      layer: params.layer,
      interaction_type: params.interactionType,
      input_data: params.inputData,
      output_data: params.outputData,
      ai_model_used: params.aiModelUsed,
      processing_time_ms: params.processingTimeMs,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('interaction_logs')
      .insert(interactionLog);

    if (error) {
      console.error('Failed to log interaction:', error);
    }
  } catch (error) {
    console.error('Interaction logging error:', error);
  }
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(params: {
  userId?: string;
  actionType?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (params.userId) {
    query = query.eq('user_id', params.userId);
  }
  if (params.actionType) {
    query = query.eq('action_type', params.actionType);
  }
  if (params.resourceType) {
    query = query.eq('resource_type', params.resourceType);
  }
  if (params.startDate) {
    query = query.gte('timestamp', params.startDate);
  }
  if (params.endDate) {
    query = query.lte('timestamp', params.endDate);
  }
  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to query audit logs: ${error.message}`);
  }

  return data as AuditLog[];
}

/**
 * Export audit logs for compliance reporting
 */
export async function exportAuditLogs(params: {
  startDate: string;
  endDate: string;
  format?: 'json' | 'csv';
}): Promise<string> {
  const logs = await queryAuditLogs({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  if (params.format === 'csv') {
    // Convert to CSV
    const headers = ['timestamp', 'user_id', 'action_type', 'resource_type', 'resource_id'];
    const csv = [
      headers.join(','),
      ...logs.map((log) =>
        headers.map((h) => JSON.stringify(log[h as keyof AuditLog] || '')).join(',')
      ),
    ].join('\n');
    return csv;
  }

  // Default: JSON
  return JSON.stringify(logs, null, 2);
}

/**
 * Performance metric logging
 */
export function createPerformanceLogger(operationName: string) {
  const startTime = performance.now();

  return {
    end: async (metadata?: Record<string, unknown>) => {
      const duration = performance.now() - startTime;
      
      // Log if operation takes > 1 second
      if (duration > 1000) {
        console.warn(`Slow operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }

      // Store performance metrics
      try {
        await supabase.from('performance_metrics').insert({
          operation_name: operationName,
          duration_ms: duration,
          metadata,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to log performance metric:', error);
      }

      return duration;
    },
  };
}
