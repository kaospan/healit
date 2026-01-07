# Healit Phase 2 - Setup & Deployment Guide

## 🎯 What's Been Implemented

### ✅ Phase 2 Complete
1. **Environment Configuration** - Production-ready .env setup
2. **Database Schema** - Complete Supabase migrations for all 5 layers
3. **Emergency Triage System** - Deterministic rules + AI guidance
4. **Authentication Pages** - Login, Dashboard, Doctor Oversight
5. **UI Components Library** - Medical-grade, professional design
6. **Audit Logging** - Complete compliance trail system

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database
Go to your Supabase project → SQL Editor and run:
```bash
supabase/migrations/001_initial_schema.sql
```

This creates:
- All tables for 5 layers
- Row Level Security (RLS) policies
- Initial emergency triage rules
- Audit logging tables

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📊 Database Schema Overview

### Core Tables (Layer Independent)
- `users` - User accounts with RBAC
- `clinics` - Medical facilities
- `organization_settings` - System configuration
- `audit_logs` - Complete audit trail
- `interaction_logs` - AI interaction logging

### Layer 1: Emergency & First-Aid
- `emergency_queries` - Patient emergency inputs
- `emergency_responses` - Triage results
- `emergency_triage_rules` - **Deterministic rules (override AI)**

### Layer 2: Health Guidance
- `health_queries` - Non-urgent questions
- `health_guidance_responses` - Conservative guidance

### Layer 3: Care Coordination (CORE)
- `follow_through_items` - Referrals, exams, appointments
- `gap_detections` - Missed follow-ups
- `coordination_reminders` - Staff notifications

### Layer 4: Doctor Oversight
- `doctor_preferences` - Silent/Active mode
- `ai_suggestions` - AI recommendations for review
- `doctor_actions` - Doctor approvals/rejections

### Layer 5: Learning & Credibility
- `learning_signal_records` - Doctor behavior signals
- `model_accuracy_metrics` - AI performance tracking

## 🔐 Security Implementation

### Row Level Security (RLS)
- **Users can only see their own data**
- **Doctors can view their patients' follow-through items**
- **Admins have full access**
- **Audit logs are append-only**

### Authentication Flow
1. User signs in via Supabase Auth
2. User profile loaded from `users` table
3. Role-based permissions enforced
4. All actions logged to `audit_logs`

## 🚨 Emergency Layer - How It Works

### Safety-First Design
```typescript
// Deterministic rules ALWAYS checked first
const criticalKeywords = detectCriticalKeywords(symptoms);
if (criticalKeywords.detected) {
  // IMMEDIATE ESCALATION - No AI involved
  return {
    urgencyLevel: EMERGENCY,
    immediateAction: 'Call 101 Immediately',
    escalationTriggered: true
  };
}
```

### Triage Flow
1. **Keyword Detection** - Check for critical symptoms
2. **Rule Matching** - Apply deterministic triage rules
3. **AI Guidance** (future) - Only for non-critical cases
4. **Audit Logging** - Every query logged

### Default Triage Rules (Preloaded)
- Chest pain → EMERGENCY
- Difficulty breathing → EMERGENCY
- Severe bleeding → EMERGENCY
- Loss of consciousness → EMERGENCY
- Stroke symptoms → EMERGENCY

## 🎨 UI Components

### Medical-Grade Design Principles
- ✅ **No playful language**
- ✅ **No gamification**
- ✅ **Professional appearance**
- ✅ **Hebrew RTL default**
- ✅ **Clear hierarchy**

### Available Components
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Emergency variant
<Button variant="emergency">Call 101</Button>

// Alert variants
<Alert variant="emergency">Critical situation</Alert>
<Alert variant="warning">Caution required</Alert>
```

## 🔄 Next Steps (Phase 3)

### Immediate Priorities
1. **AI Integration** - Connect OpenAI/Anthropic for guidance layer
2. **Follow-Through Automation** - Gap detection cron jobs
3. **Doctor Dashboard** - AI suggestion review interface
4. **Learning Pipeline** - Collect doctor correction signals
5. **Kupat Holim Integration** - API connectors (when available)

### Future Enhancements
6. **Document Processing** - Extract follow-through from referrals
7. **Notification System** - Staff reminders (respecting doctor mode)
8. **Analytics Dashboard** - Model accuracy metrics
9. **Mobile App** - React Native version
10. **Credibility Reports** - Public trust metrics

## 📱 User Roles & Permissions

### Patient
- ✅ Access emergency guidance (public)
- ✅ Ask health questions
- ✅ View own appointments
- ❌ No coordination access

### Staff
- ✅ Emergency & guidance access
- ✅ **Full coordination layer** (core value)
- ✅ Create follow-through items
- ✅ Receive gap alerts
- ❌ No doctor oversight access

### Doctor
- ✅ All patient features
- ✅ All staff features
- ✅ **Silent oversight mode** (default)
- ✅ Review AI suggestions
- ✅ Approve/reject/correct
- ✅ **Full autonomy - no scoring**

### Admin
- ✅ All features
- ✅ Manage triage rules
- ✅ View all audit logs
- ✅ Configure organization settings

## 🎯 Core Philosophy (Unchanged)

### What This System IS
- ✅ Clinical safety net
- ✅ Follow-through enforcement
- ✅ Learning system

### What This System IS NOT
- ❌ Diagnosis engine
- ❌ Treatment decision maker
- ❌ Doctor replacement
- ❌ Doctor scoring system

## 🛡️ Legal & Safety Guardrails

### Implemented Safeguards
1. **No Diagnosis** - Only triage and guidance
2. **Immediate Escalation** - Critical symptoms → 101
3. **Conservative Defaults** - When in doubt, escalate
4. **Full Audit Trail** - Every interaction logged
5. **Doctor Autonomy** - Silent mode by default
6. **Explicit Disclaimers** - "Not medical advice"

### Compliance Features
- Complete audit logging
- Timestamped interactions
- Anonymized learning signals
- Export capabilities for regulatory review

## 📖 API Documentation

### Triage Service
```typescript
import { performTriage } from '@/lib/emergency/triage';

const result = await performTriage({
  symptoms: ['chest pain', 'shortness of breath'],
  additionalInfo: 'Started 10 minutes ago',
  patientId: user?.id,
});

// Returns: TriageResult with urgency level, actions, first aid steps
```

### Audit Logger
```typescript
import { logAuditEvent } from '@/lib/audit/logger';

await logAuditEvent({
  userId: user.id,
  actionType: 'emergency_triage',
  resourceType: 'emergency_query',
  resourceId: query.id,
  details: { urgency: 'emergency', escalated: true },
});
```

## 🐛 Troubleshooting

### Common Issues

**TypeScript errors about React**
```bash
npm install
```

**Database connection failed**
- Check `.env` has correct Supabase URL and key
- Verify Supabase project is active

**Triage rules not working**
- Run migration script in Supabase SQL Editor
- Check `emergency_triage_rules` table has data

**RLS blocking queries**
- Ensure user is authenticated
- Check RLS policies in Supabase dashboard

## 📊 Testing Checklist

### Emergency Layer
- [ ] Critical keywords trigger immediate escalation
- [ ] Hebrew keywords work correctly
- [ ] First-aid steps displayed
- [ ] Call 101 button works
- [ ] All queries logged to database

### Authentication
- [ ] Login with email/password
- [ ] Logout clears session
- [ ] Role-based dashboard navigation
- [ ] Unauthorized access blocked

### Audit Logging
- [ ] All actions logged
- [ ] Timestamps accurate
- [ ] User ID captured
- [ ] Export functionality works

## 🤝 Contributing

### Code Standards
- TypeScript strict mode
- No any types
- Comprehensive JSDoc comments
- Medical-grade naming (no playful terms)

### Git Workflow
```bash
git checkout -b feature/layer-name
# Make changes
npm run type-check
npm run lint
git commit -m "feat: add X to Layer Y"
git push origin feature/layer-name
```

## 📝 License

Proprietary - National Healthcare Use Only

---

**Built for Israeli Healthcare System**  
*Designed to become the default standard for all medical establishments*

🏥 Healit - Clinical safety net · Follow-through enforcement · Learning system
