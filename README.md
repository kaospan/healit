# 🏥 Healit - National Healthcare Safety Platform

**Clinical safety net · Follow-through enforcement · Learning system**

> *"AI that helps healthcare systems remember, verify, and improve — without forcing behavior."*

## 🎯 What This Is

Healit is **not** a chatbot doctor, diagnosis engine, or replacement for medical judgment.

Healit **is**:
- ✅ A clinical safety net
- ✅ A follow-through enforcement layer  
- ✅ A learning system guided by doctors themselves

## 🏗️ Architecture - Five Layers

### 1. 🚨 Emergency & First-Aid Guidance Layer
**Patient-Facing, Safety-Locked**
- Immediate triage and escalation
- Step-by-step first-aid instructions
- No diagnosis, only safe actions

### 2. 💬 Non-Urgent Health Guidance Layer
**Patient-Facing, Conservative**
- Everyday health questions
- Clear escalation conditions
- Never presents as final authority

### 3. 🔄 Care Follow-Through & Coordination Layer *(CORE)*
**Staff-Facing**
- Track referrals, exams, follow-ups
- Detect gaps and delays
- Prevent things from falling through cracks

### 4. 👨‍⚕️ Doctor Oversight & Silent Review Layer
**Doctor-Facing**
- Silent mode by default (no nudging)
- Full autonomy and control
- Review, approve, or reject AI suggestions

### 5. 🧠 Learning & Credibility Layer
**System-Facing**
- Learns from real doctor behavior
- Aggregated, anonymized signals
- Builds trustable AI, not blind AI

## 🛡️ Safety Guardrails

- ❌ No diagnosis
- ❌ No treatment decisions  
- ❌ No patient scoring
- ❌ No doctor scoring
- ✅ Full audit trail
- ✅ Doctor autonomy sacred
- ✅ Regulatory compliance ready

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Radix UI + Tailwind CSS (RTL Hebrew)
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Row Level Security
- **AI**: OpenAI/Anthropic (configurable)
- **Deployment**: Cloud-ready, git-backed

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure Supabase credentials
# Edit .env with your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Run development server
npm run dev
```

## 🧪 Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏛️ Adoption Strategy

### Why Kupot Holim Will Adopt
- Reduces missed follow-ups
- Creates documentation
- Improves outcomes without changing doctor behavior
- Works silently
- Scales across clinics

### Why Doctors Will Tolerate It
- No forced alerts
- No rankings
- No replacement
- Full control
- Silent oversight mode

### Why Admins Will Pay
- Fewer complaints
- Fewer "how did this fall through?"
- Better audits
- Measurable improvement

## 📂 Project Structure

```
healit/
├── src/
│   ├── components/        # UI components
│   │   ├── emergency/     # Emergency guidance UI
│   │   ├── guidance/      # Health guidance UI
│   │   ├── coordination/  # Follow-through tracking
│   │   ├── doctor/        # Doctor oversight UI
│   │   └── ui/            # Base UI components
│   ├── lib/               # Core utilities
│   │   ├── supabase/      # Database client
│   │   ├── ai/            # AI providers
│   │   ├── audit/         # Logging & audit
│   │   └── kupot/         # Kupat Holim abstraction
│   ├── hooks/             # React hooks
│   ├── contexts/          # React contexts
│   ├── types/             # TypeScript types
│   └── pages/             # Route pages
├── supabase/
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge functions
└── docs/                  # Documentation
```

## 🔐 Security & Privacy

- All interactions logged and timestamped
- Audit trail for every AI suggestion
- RBAC: Doctor / Staff / Admin / Patient roles
- PHI (Protected Health Information) never committed to git
- Compliant with Israeli healthcare regulations

## 📊 Metrics & Learning

The system tracks:
- Doctor approvals/rejections
- Correction patterns
- Time to action
- False positive rates
- Areas of uncertainty

**This creates trustable AI, not blind AI.**

## 📄 License

Proprietary - National Healthcare Use Only

---

**Built for Israeli healthcare system**  
*Designed to become the default standard for all medical establishments*
