/**
 * Core Type Definitions for Healit Healthcare Platform
 * 
 * @fileoverview Comprehensive type system for all five layers
 * @author Healit Platform
 */

/**
 * User Roles - RBAC System
 */
export enum UserRole {
  PATIENT = 'patient',
  STAFF = 'staff',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

/**
 * Kupat Holim (Health Fund) Types
 */
export enum KupatHolim {
  CLALIT = 'clalit',
  MACCABI = 'maccabi',
  MEUHEDET = 'meuhedet',
  LEUMIT = 'leumit',
}

/**
 * Language Support
 */
export enum Language {
  HEBREW = 'he',
  ENGLISH = 'en',
  ARABIC = 'ar',
  RUSSIAN = 'ru',
}

/**
 * Urgency Levels for Triage
 */
export enum UrgencyLevel {
  EMERGENCY = 'emergency',      // Call 101 immediately
  URGENT = 'urgent',             // See doctor within 24h
  SEMI_URGENT = 'semi_urgent',   // See doctor within 3-7 days
  ROUTINE = 'routine',           // Schedule regular appointment
  INFORMATION = 'information',   // Educational only
}

/**
 * Follow-Through Status
 */
export enum FollowThroughStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

/**
 * AI Learning Signals
 */
export enum LearningSignal {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CORRECTED = 'corrected',
  IGNORED = 'ignored',
  OVERRIDDEN = 'overridden',
}

/**
 * Doctor Mode for Oversight Layer
 */
export enum DoctorMode {
  SILENT = 'silent',    // No notifications, only review
  ACTIVE = 'active',    // Staff reminders enabled
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  language: Language;
  kupat_holim?: KupatHolim;
  license_number?: string; // For doctors
  clinic_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ============================================================================
// EMERGENCY & FIRST-AID LAYER
// ============================================================================

export interface EmergencyQuery {
  id: string;
  patient_id?: string;
  symptoms: string[];
  additional_info?: string;
  location?: string;
  timestamp: string;
}

export interface EmergencyResponse {
  id: string;
  query_id: string;
  urgency_level: UrgencyLevel;
  immediate_action: string;
  first_aid_steps?: string[];
  when_to_call_emergency: string;
  escalation_triggered: boolean;
  created_at: string;
  ai_model_version: string;
}

export interface EmergencyTriageRule {
  id: string;
  condition: string;
  keywords: string[];
  urgency_level: UrgencyLevel;
  automatic_escalation: boolean;
  first_aid_protocol: string;
  priority: number; // Higher priority rules checked first
}

// ============================================================================
// NON-URGENT HEALTH GUIDANCE LAYER
// ============================================================================

export interface HealthQuery {
  id: string;
  patient_id?: string;
  question: string;
  context?: Record<string, unknown>;
  language: Language;
  timestamp: string;
}

export interface HealthGuidanceResponse {
  id: string;
  query_id: string;
  explanation: string;
  possible_next_steps: string[];
  safety_escalation_conditions: string[];
  when_to_seek_care: string;
  disclaimer: string;
  confidence_level: number; // 0-1
  created_at: string;
  ai_model_version: string;
}

// ============================================================================
// CARE FOLLOW-THROUGH & COORDINATION LAYER (CORE)
// ============================================================================

export interface FollowThroughItem {
  id: string;
  patient_id: string;
  clinic_id: string;
  type: 'referral' | 'exam' | 'follow_up' | 'appointment' | 'medication_refill';
  description: string;
  ordered_by_doctor_id: string;
  ordered_date: string;
  due_date: string;
  status: FollowThroughStatus;
  scheduled_date?: string;
  completed_date?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  reminders_sent: number;
  created_at: string;
  updated_at: string;
}

export interface GapDetection {
  id: string;
  follow_through_item_id: string;
  gap_type: 'no_appointment_scheduled' | 'repeated_delay' | 'incomplete_handoff' | 'overdue';
  detected_date: string;
  days_overdue: number;
  staff_notified: boolean;
  doctor_notified: boolean;
  resolution_date?: string;
  resolution_notes?: string;
}

export interface CoordinationReminder {
  id: string;
  follow_through_item_id: string;
  recipient_role: UserRole;
  recipient_id: string;
  message: string;
  sent_date: string;
  read: boolean;
  acknowledged: boolean;
}

// ============================================================================
// DOCTOR OVERSIGHT & SILENT REVIEW LAYER
// ============================================================================

export interface DoctorPreferences {
  doctor_id: string;
  mode: DoctorMode;
  notification_preferences: {
    gaps: boolean;
    ai_suggestions: boolean;
    staff_queries: boolean;
  };
  auto_approve_routine: boolean;
  custom_workflows: Record<string, unknown>;
  updated_at: string;
}

export interface AISuggestion {
  id: string;
  doctor_id: string;
  patient_id: string;
  follow_through_item_id?: string;
  suggestion_type: 'gap_detected' | 'missing_follow_up' | 'coordination_needed' | 'risk_identified';
  suggestion_text: string;
  confidence: number; // 0-1
  context: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'ignored';
  created_at: string;
  reviewed_at?: string;
  review_notes?: string;
}

export interface DoctorAction {
  id: string;
  doctor_id: string;
  suggestion_id?: string;
  action_type: LearningSignal;
  original_suggestion?: string;
  corrected_suggestion?: string;
  notes?: string;
  timestamp: string;
}

// ============================================================================
// LEARNING & CREDIBILITY LAYER
// ============================================================================

export interface LearningSignalRecord {
  id: string;
  doctor_id: string; // Anonymized in aggregation
  suggestion_id: string;
  signal_type: LearningSignal;
  context: {
    document_type?: string;
    recommendation_type?: string;
    urgency_level?: UrgencyLevel;
    patient_demographics?: Record<string, unknown>;
  };
  time_to_action_seconds?: number;
  correction_magnitude?: number; // 0-1, how different was correction
  timestamp: string;
}

export interface ModelAccuracyMetrics {
  id: string;
  model_version: string;
  time_period_start: string;
  time_period_end: string;
  total_suggestions: number;
  approved_count: number;
  rejected_count: number;
  corrected_count: number;
  ignored_count: number;
  accuracy_score: number; // 0-1
  false_positive_rate: number;
  areas_of_uncertainty: string[];
  top_correction_patterns: string[];
  created_at: string;
}

export interface CredibilityReport {
  overall_trust_score: number; // 0-100
  suggestion_accuracy_by_type: Record<string, number>;
  doctor_correction_frequency: Record<string, number>;
  improvement_trends: Array<{
    metric: string;
    trend: 'improving' | 'stable' | 'declining';
    percentage_change: number;
  }>;
  areas_needing_attention: string[];
  generated_at: string;
}

// ============================================================================
// AUDIT & LOGGING
// ============================================================================

export interface AuditLog {
  id: string;
  user_id?: string;
  user_role?: UserRole;
  action_type: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface InteractionLog {
  id: string;
  session_id: string;
  layer: 'emergency' | 'guidance' | 'coordination' | 'oversight' | 'learning';
  interaction_type: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  ai_model_used?: string;
  processing_time_ms: number;
  timestamp: string;
}

// ============================================================================
// KUPAT HOLIM INTEGRATION (Abstract Layer)
// ============================================================================

export interface KupatHolimPatient {
  external_id: string;
  kupat_holim: KupatHolim;
  first_name: string;
  last_name: string;
  id_number: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  address?: string;
  primary_clinic?: string;
  primary_doctor?: string;
}

export interface KupatHolimAppointment {
  external_id: string;
  patient_external_id: string;
  clinic_id: string;
  doctor_id: string;
  appointment_type: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

export interface KupatHolimReferral {
  external_id: string;
  patient_external_id: string;
  referring_doctor_id: string;
  specialty: string;
  reason: string;
  priority: 'routine' | 'urgent';
  issued_date: string;
  expiry_date?: string;
  status: 'active' | 'used' | 'expired';
}

// ============================================================================
// DOCUMENT PROCESSING
// ============================================================================

export interface MedicalDocument {
  id: string;
  patient_id: string;
  uploaded_by: string;
  document_type: 'lab_result' | 'imaging' | 'prescription' | 'referral' | 'discharge_summary' | 'other';
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  extracted_data?: Record<string, unknown>;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  uploaded_at: string;
  processed_at?: string;
}

export interface DocumentExtraction {
  document_id: string;
  extracted_text: string;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  follow_through_items_generated: string[];
  ai_model_version: string;
  extraction_timestamp: string;
}

// ============================================================================
// CLINIC & ORGANIZATION
// ============================================================================

export interface Clinic {
  id: string;
  name: string;
  kupat_holim: KupatHolim;
  address: string;
  phone: string;
  email?: string;
  timezone: string;
  active: boolean;
  created_at: string;
}

export interface OrganizationSettings {
  clinic_id: string;
  default_language: Language;
  follow_up_reminder_days: number; // Default: 6
  gap_detection_enabled: boolean;
  doctor_mode_default: DoctorMode;
  ai_provider: 'openai' | 'anthropic' | 'local';
  audit_retention_days: number;
  updated_at: string;
}
