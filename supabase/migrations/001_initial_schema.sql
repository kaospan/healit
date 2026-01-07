-- ============================================================================
-- HEALIT DATABASE SCHEMA
-- National Healthcare Safety Platform
-- Migration 001 - Core Tables and Security
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('patient', 'staff', 'doctor', 'admin', 'system');
CREATE TYPE kupat_holim AS ENUM ('clalit', 'maccabi', 'meuhedet', 'leumit');
CREATE TYPE language_code AS ENUM ('he', 'en', 'ar', 'ru');
CREATE TYPE urgency_level AS ENUM ('emergency', 'urgent', 'semi_urgent', 'routine', 'information');
CREATE TYPE follow_through_status AS ENUM ('pending', 'scheduled', 'completed', 'overdue', 'cancelled', 'no_show');
CREATE TYPE learning_signal AS ENUM ('approved', 'rejected', 'corrected', 'ignored', 'overridden');
CREATE TYPE doctor_mode AS ENUM ('silent', 'active');

-- ============================================================================
-- CORE USER MANAGEMENT
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  phone TEXT,
  language language_code NOT NULL DEFAULT 'he',
  kupat_holim kupat_holim,
  license_number TEXT, -- For doctors
  clinic_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_clinic ON users(clinic_id);

-- ============================================================================
-- CLINICS & ORGANIZATIONS
-- ============================================================================

CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  kupat_holim kupat_holim NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Jerusalem',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_settings (
  clinic_id UUID PRIMARY KEY REFERENCES clinics(id),
  default_language language_code NOT NULL DEFAULT 'he',
  follow_up_reminder_days INTEGER NOT NULL DEFAULT 6,
  gap_detection_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  doctor_mode_default doctor_mode NOT NULL DEFAULT 'silent',
  ai_provider TEXT NOT NULL DEFAULT 'openai',
  audit_retention_days INTEGER NOT NULL DEFAULT 365,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- LAYER 1: EMERGENCY & FIRST-AID
-- ============================================================================

CREATE TABLE emergency_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(id),
  symptoms TEXT[] NOT NULL,
  additional_info TEXT,
  location TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE emergency_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_id UUID NOT NULL REFERENCES emergency_queries(id),
  urgency_level urgency_level NOT NULL,
  immediate_action TEXT NOT NULL,
  first_aid_steps TEXT[],
  when_to_call_emergency TEXT NOT NULL,
  escalation_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ai_model_version TEXT NOT NULL
);

CREATE TABLE emergency_triage_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  condition TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  urgency_level urgency_level NOT NULL,
  automatic_escalation BOOLEAN NOT NULL DEFAULT FALSE,
  first_aid_protocol TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_emergency_triage_priority ON emergency_triage_rules(priority DESC) WHERE active = TRUE;

-- ============================================================================
-- LAYER 2: NON-URGENT HEALTH GUIDANCE
-- ============================================================================

CREATE TABLE health_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  context JSONB,
  language language_code NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE health_guidance_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_id UUID NOT NULL REFERENCES health_queries(id),
  explanation TEXT NOT NULL,
  possible_next_steps TEXT[] NOT NULL,
  safety_escalation_conditions TEXT[] NOT NULL,
  when_to_seek_care TEXT NOT NULL,
  disclaimer TEXT NOT NULL,
  confidence_level DECIMAL(3,2) NOT NULL CHECK (confidence_level BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ai_model_version TEXT NOT NULL
);

-- ============================================================================
-- LAYER 3: CARE FOLLOW-THROUGH & COORDINATION (CORE)
-- ============================================================================

CREATE TABLE follow_through_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id),
  clinic_id UUID NOT NULL REFERENCES clinics(id),
  type TEXT NOT NULL CHECK (type IN ('referral', 'exam', 'follow_up', 'appointment', 'medication_refill')),
  description TEXT NOT NULL,
  ordered_by_doctor_id UUID NOT NULL REFERENCES users(id),
  ordered_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status follow_through_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  notes TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  reminders_sent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_follow_through_patient ON follow_through_items(patient_id);
CREATE INDEX idx_follow_through_status ON follow_through_items(status);
CREATE INDEX idx_follow_through_due_date ON follow_through_items(due_date);
CREATE INDEX idx_follow_through_doctor ON follow_through_items(ordered_by_doctor_id);

CREATE TABLE gap_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follow_through_item_id UUID NOT NULL REFERENCES follow_through_items(id),
  gap_type TEXT NOT NULL CHECK (gap_type IN ('no_appointment_scheduled', 'repeated_delay', 'incomplete_handoff', 'overdue')),
  detected_date DATE NOT NULL,
  days_overdue INTEGER NOT NULL,
  staff_notified BOOLEAN NOT NULL DEFAULT FALSE,
  doctor_notified BOOLEAN NOT NULL DEFAULT FALSE,
  resolution_date DATE,
  resolution_notes TEXT
);

CREATE INDEX idx_gap_detections_item ON gap_detections(follow_through_item_id);
CREATE INDEX idx_gap_detections_unresolved ON gap_detections(detected_date) WHERE resolution_date IS NULL;

CREATE TABLE coordination_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follow_through_item_id UUID NOT NULL REFERENCES follow_through_items(id),
  recipient_role user_role NOT NULL,
  recipient_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  sent_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================================
-- LAYER 4: DOCTOR OVERSIGHT & SILENT REVIEW
-- ============================================================================

CREATE TABLE doctor_preferences (
  doctor_id UUID PRIMARY KEY REFERENCES users(id),
  mode doctor_mode NOT NULL DEFAULT 'silent',
  notification_preferences JSONB NOT NULL DEFAULT '{"gaps": true, "ai_suggestions": true, "staff_queries": true}'::jsonb,
  auto_approve_routine BOOLEAN NOT NULL DEFAULT FALSE,
  custom_workflows JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES users(id),
  patient_id UUID NOT NULL REFERENCES users(id),
  follow_through_item_id UUID REFERENCES follow_through_items(id),
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('gap_detected', 'missing_follow_up', 'coordination_needed', 'risk_identified')),
  suggestion_text TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  context JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'ignored')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT
);

CREATE INDEX idx_ai_suggestions_doctor ON ai_suggestions(doctor_id);
CREATE INDEX idx_ai_suggestions_status ON ai_suggestions(status);
CREATE INDEX idx_ai_suggestions_pending ON ai_suggestions(created_at) WHERE status = 'pending';

CREATE TABLE doctor_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES users(id),
  suggestion_id UUID REFERENCES ai_suggestions(id),
  action_type learning_signal NOT NULL,
  original_suggestion TEXT,
  corrected_suggestion TEXT,
  notes TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- LAYER 5: LEARNING & CREDIBILITY
-- ============================================================================

CREATE TABLE learning_signal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES users(id), -- Anonymized in aggregation
  suggestion_id UUID NOT NULL REFERENCES ai_suggestions(id),
  signal_type learning_signal NOT NULL,
  context JSONB NOT NULL,
  time_to_action_seconds INTEGER,
  correction_magnitude DECIMAL(3,2) CHECK (correction_magnitude BETWEEN 0 AND 1),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_learning_signals_type ON learning_signal_records(signal_type);
CREATE INDEX idx_learning_signals_timestamp ON learning_signal_records(timestamp);

CREATE TABLE model_accuracy_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_version TEXT NOT NULL,
  time_period_start DATE NOT NULL,
  time_period_end DATE NOT NULL,
  total_suggestions INTEGER NOT NULL,
  approved_count INTEGER NOT NULL,
  rejected_count INTEGER NOT NULL,
  corrected_count INTEGER NOT NULL,
  ignored_count INTEGER NOT NULL,
  accuracy_score DECIMAL(5,4) NOT NULL CHECK (accuracy_score BETWEEN 0 AND 1),
  false_positive_rate DECIMAL(5,4) NOT NULL,
  areas_of_uncertainty TEXT[],
  top_correction_patterns TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- AUDIT & LOGGING
-- ============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  user_role user_role,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details JSONB NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);

CREATE TABLE interaction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  layer TEXT NOT NULL CHECK (layer IN ('emergency', 'guidance', 'coordination', 'oversight', 'learning')),
  interaction_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  output_data JSONB NOT NULL,
  ai_model_used TEXT,
  processing_time_ms INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interaction_logs_session ON interaction_logs(session_id);
CREATE INDEX idx_interaction_logs_layer ON interaction_logs(layer);
CREATE INDEX idx_interaction_logs_timestamp ON interaction_logs(timestamp);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_through_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Doctors can view their follow-through items
CREATE POLICY "Doctors view their follow-through items" ON follow_through_items
  FOR SELECT USING (
    ordered_by_doctor_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('doctor', 'admin', 'staff')
    )
  );

-- Doctors can view their AI suggestions
CREATE POLICY "Doctors view their suggestions" ON ai_suggestions
  FOR SELECT USING (doctor_id = auth.uid());

-- Doctors can update their preferences
CREATE POLICY "Doctors manage preferences" ON doctor_preferences
  FOR ALL USING (doctor_id = auth.uid());

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_through_updated_at BEFORE UPDATE ON follow_through_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert default emergency triage rules
INSERT INTO emergency_triage_rules (condition, keywords, urgency_level, automatic_escalation, first_aid_protocol, priority) VALUES
('Chest Pain', ARRAY['כאב בחזה', 'chest pain', 'לחץ בחזה', 'pressure in chest'], 'emergency', TRUE, 'Call 101 immediately. Have patient sit down and remain calm. If unconscious, check breathing and pulse.', 100),
('Difficulty Breathing', ARRAY['קושי בנשימה', 'difficulty breathing', 'לא יכול לנשום', 'cannot breathe', 'חנק'], 'emergency', TRUE, 'Call 101 immediately. Help patient sit upright. Loosen tight clothing.', 100),
('Severe Bleeding', ARRAY['דימום חזק', 'severe bleeding', 'דם רב', 'heavy bleeding'], 'emergency', TRUE, 'Call 101. Apply direct pressure to wound. Keep patient lying down.', 100),
('Loss of Consciousness', ARRAY['איבוד הכרה', 'unconscious', 'לא מגיב', 'unresponsive'], 'emergency', TRUE, 'Call 101 immediately. Check breathing. Do not move patient unless necessary.', 100),
('Stroke Symptoms', ARRAY['שבץ מוחי', 'stroke', 'פנים עקומות', 'facial drooping', 'חולשה בגפיים'], 'emergency', TRUE, 'Call 101 immediately. Note time symptoms started. Keep patient calm and lying down.', 100);

COMMENT ON TABLE emergency_triage_rules IS 'Deterministic rules that ALWAYS override AI language output for safety';
COMMENT ON TABLE follow_through_items IS 'Core coordination layer - prevents things from falling through cracks';
COMMENT ON TABLE doctor_preferences IS 'Doctor autonomy is sacred - doctors control their oversight mode';
COMMENT ON TABLE learning_signal_records IS 'Builds trustable AI from real doctor behavior, not blind AI';
