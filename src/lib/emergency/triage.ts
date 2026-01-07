import { supabase } from '@/lib/supabase/client';
import { UrgencyLevel, EmergencyTriageRule } from '@/types';
import { logAuditEvent } from '@/lib/audit/logger';

/**
 * Emergency Triage Service
 * 
 * @description Layer 1: Emergency & First-Aid Guidance
 * CRITICAL: Deterministic rules ALWAYS override AI output
 * 
 * Safety-first design:
 * - No diagnosis
 * - Immediate escalation for emergencies
 * - Clear local emergency instructions for Israel
 */

export interface TriageInput {
  symptoms: string[];
  additionalInfo?: string;
  location?: string;
  patientId?: string;
}

export interface TriageResult {
  urgencyLevel: UrgencyLevel;
  immediateAction: string;
  firstAidSteps?: string[];
  whenToCallEmergency: string;
  escalationTriggered: boolean;
  matchedRules: string[];
}

/**
 * Emergency keywords in Hebrew and English
 * These ALWAYS trigger immediate escalation
 */
const CRITICAL_KEYWORDS = {
  chestPain: ['כאב בחזה', 'לחץ בחזה', 'chest pain', 'pressure in chest'],
  breathing: ['קושי בנשימה', 'לא יכול לנשום', 'חנק', 'difficulty breathing', 'cannot breathe', 'choking'],
  bleeding: ['דימום חזק', 'דם רב', 'severe bleeding', 'heavy bleeding', 'hemorrhage'],
  consciousness: ['איבוד הכרה', 'לא מגיב', 'unconscious', 'unresponsive', 'passed out'],
  stroke: ['שבץ', 'פנים עקומות', 'חולשה בגפיים', 'stroke', 'facial drooping', 'arm weakness'],
  seizure: ['התקף', 'עוויתות', 'seizure', 'convulsions'],
  poisoning: ['הרעלה', 'רעל', 'בלע חומר', 'poisoning', 'swallowed', 'toxic'],
  burn: ['כוויה חמורה', 'כוויה גדולה', 'severe burn', 'large burn'],
  headTrauma: ['חבלת ראש', 'מכה בראש', 'head trauma', 'head injury', 'hit head'],
  suicide: ['אובדני', 'רוצה למות', 'suicidal', 'want to die', 'end my life'],
};

/**
 * Check for critical keywords that trigger automatic emergency escalation
 */
function detectCriticalKeywords(text: string): {
  detected: boolean;
  category: string | null;
} {
  const normalizedText = text.toLowerCase().trim();

  for (const [category, keywords] of Object.entries(CRITICAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        return { detected: true, category };
      }
    }
  }

  return { detected: false, category: null };
}

/**
 * Primary triage function - DETERMINISTIC RULES FIRST
 */
export async function performTriage(input: TriageInput): Promise<TriageResult> {
  const combinedText = [...input.symptoms, input.additionalInfo || ''].join(' ').toLowerCase();
  
  // STEP 1: Check for critical keywords (deterministic, always override AI)
  const criticalCheck = detectCriticalKeywords(combinedText);
  
  if (criticalCheck.detected) {
    const result: TriageResult = {
      urgencyLevel: UrgencyLevel.EMERGENCY,
      immediateAction: 'התקשר למוקד 101 מיד / Call 101 Immediately',
      firstAidSteps: await getFirstAidSteps(criticalCheck.category!),
      whenToCallEmergency: 'עכשיו - זה מצב חירום / NOW - This is an emergency',
      escalationTriggered: true,
      matchedRules: [criticalCheck.category!],
    };

    // Log the emergency query
    await logEmergencyQuery(input, result);
    
    return result;
  }

  // STEP 2: Load triage rules from database
  const rules = await loadTriageRules();
  
  // STEP 3: Match against triage rules (ordered by priority)
  for (const rule of rules) {
    if (matchesRule(combinedText, rule)) {
      const result: TriageResult = {
        urgencyLevel: rule.urgency_level,
        immediateAction: rule.automatic_escalation 
          ? 'התקשר למוקד 101 מיד / Call 101 Immediately'
          : getActionForUrgency(rule.urgency_level),
        firstAidSteps: rule.first_aid_protocol ? [rule.first_aid_protocol] : undefined,
        whenToCallEmergency: getEscalationGuidance(rule.urgency_level),
        escalationTriggered: rule.automatic_escalation,
        matchedRules: [rule.condition],
      };

      await logEmergencyQuery(input, result);
      return result;
    }
  }

  // STEP 4: Default conservative response (no diagnosis)
  const result: TriageResult = {
    urgencyLevel: UrgencyLevel.ROUTINE,
    immediateAction: 'אם זה דחוף, התקשר למוקד 101 / If urgent, call 101',
    whenToCallEmergency: 'אם המצב מחמיר, התקשר מיד / If condition worsens, call immediately',
    escalationTriggered: false,
    matchedRules: [],
  };

  await logEmergencyQuery(input, result);
  return result;
}

/**
 * Load active triage rules from database (cached)
 */
async function loadTriageRules(): Promise<EmergencyTriageRule[]> {
  const { data, error } = await supabase
    .from('emergency_triage_rules')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error loading triage rules:', error);
    return [];
  }

  return data || [];
}

/**
 * Check if text matches rule keywords
 */
function matchesRule(text: string, rule: EmergencyTriageRule): boolean {
  return rule.keywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
}

/**
 * Get first aid steps based on emergency category
 */
async function getFirstAidSteps(category: string): Promise<string[]> {
  const steps: Record<string, string[]> = {
    chestPain: [
      'גרום למטופל לשבת במנוחה / Have patient sit down and rest',
      'שחרר בגדים צמודים / Loosen tight clothing',
      'אל תיתן אוכל או משקה / Do not give food or drink',
      'הישאר עם המטופל עד הגעת העזרה / Stay with patient until help arrives',
    ],
    breathing: [
      'גרום למטופל לשבת זקוף / Help patient sit upright',
      'פתח חלונות לאוויר צח / Open windows for fresh air',
      'שחרר בגדים צמודים / Loosen tight clothing',
      'שמור על קור רוח / Keep calm and reassure',
    ],
    bleeding: [
      'הפעל לחץ ישיר על הפצע / Apply direct pressure to wound',
      'הרם את האיבר הפגוע מעל רמת הלב / Elevate injured area above heart',
      'אל תסיר חבישות ספוגות דם / Do not remove blood-soaked bandages',
      'המשך ללחוץ עד הגעת העזרה / Continue pressure until help arrives',
    ],
    consciousness: [
      'התקשר ל-101 מיד / Call 101 immediately',
      'בדוק נשימה ודופק / Check breathing and pulse',
      'אל תזיז את המטופל אלא אם יש סכנה / Do not move patient unless in danger',
      'הטה ראש לצד אם יש הקאה / Turn head to side if vomiting',
    ],
    stroke: [
      'התקשר ל-101 מיד / Call 101 immediately',
      'רשום מתי התחילו התסמינים / Note when symptoms started',
      'שמור על המטופל במנוחה / Keep patient calm and resting',
      'אל תיתן אוכל או משקה / Do not give food or drink',
    ],
  };

  return steps[category] || [
    'התקשר ל-101 מיד / Call 101 immediately',
    'שמור על המטופל במנוחה / Keep patient calm',
    'אל תזיז את המטופל / Do not move patient',
  ];
}

/**
 * Get recommended action based on urgency level
 */
function getActionForUrgency(urgency: UrgencyLevel): string {
  const actions: Record<UrgencyLevel, string> = {
    [UrgencyLevel.EMERGENCY]: 'התקשר למוקד 101 מיד / Call 101 Immediately',
    [UrgencyLevel.URGENT]: 'פנה לרופא תוך 24 שעות / See doctor within 24 hours',
    [UrgencyLevel.SEMI_URGENT]: 'תאם תור לרופא תוך 3-7 ימים / Schedule appointment within 3-7 days',
    [UrgencyLevel.ROUTINE]: 'תאם תור רגיל לרופא / Schedule regular appointment',
    [UrgencyLevel.INFORMATION]: 'מידע כללי בלבד / Information only',
  };

  return actions[urgency];
}

/**
 * Get escalation guidance based on urgency
 */
function getEscalationGuidance(urgency: UrgencyLevel): string {
  if (urgency === UrgencyLevel.EMERGENCY) {
    return 'זה מצב חירום - התקשר ל-101 עכשיו / This is an emergency - call 101 now';
  }

  return [
    'התקשר ל-101 אם:',
    '• מצב מחמיר במהירות',
    '• קושי בנשימה',
    '• כאב חזה',
    '• איבוד הכרה',
    '',
    'Call 101 if:',
    '• Condition rapidly worsens',
    '• Difficulty breathing',
    '• Chest pain',
    '• Loss of consciousness',
  ].join('\n');
}

/**
 * Log emergency query for audit trail
 */
async function logEmergencyQuery(
  input: TriageInput,
  result: TriageResult
): Promise<void> {
  try {
    // Insert query
    const { data: query } = await supabase
      .from('emergency_queries')
      .insert({
        patient_id: input.patientId,
        symptoms: input.symptoms,
        additional_info: input.additionalInfo,
        location: input.location,
      })
      .select()
      .single();

    if (query) {
      // Insert response
      await supabase
        .from('emergency_responses')
        .insert({
          query_id: query.id,
          urgency_level: result.urgencyLevel,
          immediate_action: result.immediateAction,
          first_aid_steps: result.firstAidSteps,
          when_to_call_emergency: result.whenToCallEmergency,
          escalation_triggered: result.escalationTriggered,
          ai_model_version: 'triage-rules-v1',
        });
    }

    // Audit log
    await logAuditEvent({
      userId: input.patientId,
      actionType: 'emergency_triage',
      resourceType: 'emergency_query',
      resourceId: query?.id || 'unknown',
      details: {
        urgency: result.urgencyLevel,
        escalated: result.escalationTriggered,
        matchedRules: result.matchedRules,
      },
    });
  } catch (error) {
    console.error('Error logging emergency query:', error);
  }
}

/**
 * Add custom triage rule (admin only)
 */
export async function addTriageRule(rule: Partial<EmergencyTriageRule>): Promise<void> {
  const { error } = await supabase
    .from('emergency_triage_rules')
    .insert(rule);

  if (error) {
    throw new Error(`Failed to add triage rule: ${error.message}`);
  }
}
