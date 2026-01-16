import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Features Page
 */
export default function FeaturesPage() {
  const { language } = useLanguage();

  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'תכונות המערכת' : 'Features'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'פלטפורמת בטיחות רפואית לאומית - יכולות ותכונות עיקריות'
              : 'National Healthcare Safety Platform - Key Features and Capabilities'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          {/* Emergency & First Aid */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🚨</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isHebrew ? 'חירום ועזרה ראשונה' : 'Emergency & First Aid'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {isHebrew
                ? 'גישה ציבורית להנחיות חירום, טריאז' מיידי והפנייה מהירה לשירותי חירום. המערכת מספקת הוראות עזרה ראשונה צעד אחר צעד בלי לבצע אבחון רפואי.'
                : 'Public access to emergency guidance, immediate triage, and rapid escalation to emergency services. Provides step-by-step first aid instructions without making medical diagnoses.'}
            </p>
          </div>

          {/* Health Guidance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💬</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isHebrew ? 'הדרכה בריאותית' : 'Health Guidance'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {isHebrew
                ? 'מענה לשאלות בריאות לא דחופות עם תנאי הפניה ברורים. המערכת אף פעם לא מציגה את עצמה כסמכות סופית ומפנה לרופא בעת הצורך.'
                : 'Answers to non-urgent health questions with clear escalation conditions. Never presents itself as final authority and escalates to doctors when needed.'}
            </p>
          </div>

          {/* Care Coordination - Core Feature */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔄</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isHebrew ? 'מעקב ותיאום טיפולים - ליבת המערכת' : 'Care Coordination - Core Feature'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {isHebrew
                ? 'המערכת עוקבת אחר הפניות, בדיקות ומעקבים רפואיים כדי למנוע דברים מליפול בין הכיסאות:'
                : 'Tracks referrals, exams, and medical follow-ups to prevent things from falling through the cracks:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'זיהוי פערים ועיכובים בטיפול' : 'Detects gaps and delays in treatment'}</li>
              <li>{isHebrew ? 'מעקב אחר תוצאות בדיקות שלא נקראו' : 'Tracks unread test results'}</li>
              <li>{isHebrew ? 'הפניות שלא בוצעו' : 'Unexecuted referrals'}</li>
              <li>{isHebrew ? 'מעקבים שלא נעשו' : 'Missed follow-ups'}</li>
            </ul>
          </div>

          {/* Doctor Oversight */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">👨‍⚕️</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isHebrew ? 'פיקוח רפואי שקט' : 'Silent Doctor Oversight'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {isHebrew
                ? 'מצב שקט כברירת מחדל - ללא התראות מטרידות. הרופאים שומרים על אוטונומיה מלאה ובקרה, יכולים לסקור, לאשר או לדחות המלצות AI. המערכת לומדת מההתנהגות האמיתית של הרופא.'
                : 'Silent mode by default - no intrusive alerts. Doctors maintain full autonomy and control, can review, approve, or reject AI suggestions. The system learns from actual doctor behavior.'}
            </p>
          </div>

          {/* Learning System */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🧠</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isHebrew ? 'מערכת למידה' : 'Learning System'}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {isHebrew
                ? 'לומדת מהתנהגות רופאים אמיתיים - מצטברת, אנונימית. בונה AI מהימן ולא עיוור. עוקבת אחר אישורים/דחיות, דפוסי תיקון, זמן לפעולה ושיעורי חיוביות שגויה.'
                : 'Learns from real doctor behavior - aggregated and anonymized. Builds trustable AI, not blind AI. Tracks approvals/rejections, correction patterns, time to action, and false positive rates.'}
            </p>
          </div>
        </div>

        {/* Safety Guardrails */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'מגבלות ומסגרת בטיחות' : 'Safety Guardrails'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">
                ❌ {isHebrew ? 'המערכת לא עושה:' : 'System does NOT:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>{isHebrew ? 'אין אבחון' : 'No diagnosis'}</li>
                <li>{isHebrew ? 'אין החלטות טיפול' : 'No treatment decisions'}</li>
                <li>{isHebrew ? 'אין דירוג חולים' : 'No patient scoring'}</li>
                <li>{isHebrew ? 'אין דירוג רופאים' : 'No doctor scoring'}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">
                ✅ {isHebrew ? 'המערכת כן מספקת:' : 'System provides:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>{isHebrew ? 'רשימת ביקורת מלאה' : 'Full audit trail'}</li>
                <li>{isHebrew ? 'אוטונומיה של הרופא קדושה' : 'Doctor autonomy sacred'}</li>
                <li>{isHebrew ? 'מוכן לתאימות רגולטורית' : 'Regulatory compliance ready'}</li>
                <li>{isHebrew ? 'אבטחת מידע PHI' : 'PHI data security'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {isHebrew ? 'חזרה לדף הבית' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
