import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Language, UrgencyLevel } from '@/types';
import { performTriage, TriageResult } from '@/lib/emergency/triage';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

/**
 * Emergency Page - Layer 1: Emergency & First-Aid Guidance
 * 
 * @description Public access, safety-locked emergency triage
 * CRITICAL RULES:
 * - Deterministic triage rules ALWAYS override AI
 * - Immediate escalation for emergencies
 * - No diagnosis, only safe actions
 * - Clear Israel emergency instructions (101)
 */
export default function EmergencyPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTriage() {
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const result = await performTriage({
        symptoms: symptoms.split(',').map(s => s.trim()),
        additionalInfo: additionalInfo || undefined,
        patientId: user?.id,
      });
      setTriageResult(result);
    } catch (error) {
      console.error('Triage error:', error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSymptoms('');
    setAdditionalInfo('');
    setTriageResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950/20 dark:to-gray-900">
      {/* Emergency Header - Always Visible */}
      <Alert variant="emergency" className="rounded-none border-0 border-b-4 border-red-600">
        <AlertTitle className="text-xl flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          {language === Language.HEBREW ? 'מוקד חירום 101' : 'Emergency 101'}
        </AlertTitle>
        <AlertDescription className="text-base mt-2">
          {language === Language.HEBREW 
            ? 'במקרה חירום - התקשר למוקד 101 מיד. השירות הזה מיועד להכוונה בלבד.'
            : 'In case of emergency - Call 101 immediately. This service is for guidance only.'}
        </AlertDescription>
      </Alert>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Main Content */}
        {!triageResult ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {language === Language.HEBREW 
                  ? 'תיאור מצב חירום או עזרה ראשונה'
                  : 'Describe Emergency or First-Aid Situation'}
              </CardTitle>
              <CardDescription>
                {language === Language.HEBREW
                  ? 'תאר את התסמינים או המצב. במקרה של חירום ממשי, התקשר ל-101 תחילה.'
                  : 'Describe symptoms or situation. For real emergency, call 101 first.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Critical Warning Signs */}
              <Alert variant="warning">
                <AlertTitle>
                  {language === Language.HEBREW ? '⚠️ סימני אזהרה קריטיים' : '⚠️ Critical Warning Signs'}
                </AlertTitle>
                <AlertDescription>
                  <p className="font-semibold mb-2">
                    {language === Language.HEBREW 
                      ? 'התקשר ל-101 מיד אם יש:'
                      : 'Call 101 immediately if:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>{language === Language.HEBREW ? 'כאב בחזה או לחץ' : 'Chest pain or pressure'}</li>
                    <li>{language === Language.HEBREW ? 'קושי בנשימה' : 'Difficulty breathing'}</li>
                    <li>{language === Language.HEBREW ? 'דימום חזק' : 'Severe bleeding'}</li>
                    <li>{language === Language.HEBREW ? 'איבוד הכרה' : 'Loss of consciousness'}</li>
                    <li>{language === Language.HEBREW ? 'סימני שבץ מוחי' : 'Stroke symptoms'}</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Symptoms Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === Language.HEBREW ? 'תסמינים (מופרדים בפסיקים)' : 'Symptoms (comma separated)'}
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800"
                  placeholder={language === Language.HEBREW 
                    ? 'לדוגמה: כאב בחזה, קוצר נשימה'
                    : 'Example: chest pain, shortness of breath'}
                  disabled={loading}
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === Language.HEBREW ? 'מידע נוסף (אופציונלי)' : 'Additional Information (optional)'}
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800"
                  placeholder={language === Language.HEBREW 
                    ? 'כל מידע רלוונטי נוסף'
                    : 'Any other relevant information'}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleTriage}
                disabled={loading || !symptoms.trim()}
                variant="emergency"
                size="lg"
                className="w-full"
              >
                {loading 
                  ? (language === Language.HEBREW ? 'מעבד...' : 'Processing...') 
                  : (language === Language.HEBREW ? 'קבל הכוונה' : 'Get Guidance')}
              </Button>

              {/* Disclaimer */}
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {language === Language.HEBREW
                  ? 'זהו כלי הכוונה בלבד. אין זה תחליף לייעוץ רפואי מקצועי.'
                  : 'This is a guidance tool only. Not a substitute for professional medical advice.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Triage Result Display */
          <div className="space-y-4">
            {/* Urgency Alert */}
            <Alert 
              variant={triageResult.escalationTriggered ? 'emergency' : 
                      triageResult.urgencyLevel === UrgencyLevel.URGENT ? 'warning' : 'default'}
            >
              <AlertTitle className="text-xl flex items-center gap-2">
                {triageResult.escalationTriggered && <span className="text-2xl">🚨</span>}
                {triageResult.immediateAction}
              </AlertTitle>
              {triageResult.escalationTriggered && (
                <AlertDescription className="mt-3">
                  <p className="text-base font-semibold">
                    {language === Language.HEBREW
                      ? 'זהו מצב חירום - התקשר ל-101 מיד'
                      : 'This is an emergency - Call 101 immediately'}
                  </p>
                </AlertDescription>
              )}
            </Alert>

            {/* First Aid Steps */}
            {triageResult.firstAidSteps && triageResult.firstAidSteps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === Language.HEBREW ? 'צעדי עזרה ראשונה' : 'First Aid Steps'}
                  </CardTitle>
                  <CardDescription>
                    {language === Language.HEBREW 
                      ? 'בצע את הפעולות הבאות בזמן המתנה לעזרה'
                      : 'Follow these steps while waiting for help'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {triageResult.firstAidSteps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Escalation Guidance */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === Language.HEBREW ? 'מתי להתקשר למוקד חירום' : 'When to Call Emergency'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{triageResult.whenToCallEmergency}</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={resetForm} variant="outline" size="lg" className="flex-1">
                {language === Language.HEBREW ? 'בדיקה נוספת' : 'New Check'}
              </Button>
              <Button 
                variant="emergency" 
                size="lg" 
                className="flex-1"
                onClick={() => window.location.href = 'tel:101'}
              >
                📞 {language === Language.HEBREW ? 'חייג 101' : 'Call 101'}
              </Button>
            </div>

            {/* Matched Rules (for transparency) */}
            {triageResult.matchedRules.length > 0 && (
              <p className="text-xs text-gray-500 text-center">
                {language === Language.HEBREW ? 'זוהה:' : 'Detected:'} {triageResult.matchedRules.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {language === Language.HEBREW ? '← חזרה למרכז הבקרה' : '← Back to Dashboard'}
          </a>
        </div>
      </div>
    </div>
  );
}
