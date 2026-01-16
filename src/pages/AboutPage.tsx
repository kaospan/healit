import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * About Page
 */
export default function AboutPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'אודות Healit' : 'About Healit'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'פלטפורמת בטיחות רפואית לאומית'
              : 'National Healthcare Safety Platform'}
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'המשימה שלנו' : 'Our Mission'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {isHebrew
              ? 'Healit נבנתה כדי למנוע מדברים ליפול בין הכיסאות במערכת הבריאות. אנחנו לא מחליפים רופאים, לא מבצעים אבחנות, ולא מקבלים החלטות טיפול. אנחנו רשת בטיחות - עוקבים אחר הפניות, בדיקות ומעקבים כדי להבטיח שהכל נעשה כמו שצריך.'
              : 'Healit was built to prevent things from falling through the cracks in the healthcare system. We don\'t replace doctors, make diagnoses, or treatment decisions. We are a safety net - tracking referrals, exams, and follow-ups to ensure everything gets done properly.'}
          </p>
        </div>

        {/* What We Are */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'מה אנחנו' : 'What We Are'}
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ✅ {isHebrew ? 'רשת בטיחות קלינית' : 'A Clinical Safety Net'}
              </h3>
              <p>{isHebrew 
                ? 'אנחנו תופסים דברים שעלולים ליפול - תוצאות בדיקות שלא נקראו, הפניות שלא בוצעו, מעקבים שהוחמצו.'
                : 'We catch things that might fall - unread test results, unexecuted referrals, missed follow-ups.'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ✅ {isHebrew ? 'שכבת אכיפת מעקב' : 'A Follow-Through Enforcement Layer'}
              </h3>
              <p>{isHebrew
                ? 'אנחנו מוודאים שדברים באמת קורים - לא רק מתוכננים.'
                : 'We ensure things actually happen - not just get planned.'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ✅ {isHebrew ? 'מערכת למידה מונחית רופאים' : 'A Learning System Guided by Doctors'}
              </h3>
              <p>{isHebrew
                ? 'אנחנו לומדים מהרופאים עצמם - לא מכתיבים להם.'
                : 'We learn from doctors themselves - not dictate to them.'}</p>
            </div>
          </div>
        </div>

        {/* What We Are NOT */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'מה אנחנו לא' : 'What We Are NOT'}
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>❌ {isHebrew ? 'לא צ\'אטבוט רופא' : 'Not a chatbot doctor'}</p>
            <p>❌ {isHebrew ? 'לא מנוע אבחון' : 'Not a diagnosis engine'}</p>
            <p>❌ {isHebrew ? 'לא תחליף לשיפוט רפואי' : 'Not a replacement for medical judgment'}</p>
            <p>❌ {isHebrew ? 'לא מערכת דירוג רופאים' : 'Not a doctor scoring system'}</p>
            <p>❌ {isHebrew ? 'לא מערכת דירוג חולים' : 'Not a patient scoring system'}</p>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'הטכנולוגיה' : 'The Technology'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Frontend</p>
              <p>React 18 + TypeScript</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">UI</p>
              <p>Radix UI + Tailwind</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Backend</p>
              <p>Supabase (PostgreSQL)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Auth</p>
              <p>Supabase Auth + RLS</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">AI</p>
              <p>OpenAI/Anthropic</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Deployment</p>
              <p>Cloud-ready</p>
            </div>
          </div>
        </div>

        {/* Target Users */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'למי זה מיועד?' : 'Who Is This For?'}
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {isHebrew ? '🏥 קופות חולים' : '🏥 Health Funds (Kupot Holim)'}
              </h3>
              <p>{isHebrew 
                ? 'המערכת מפחיתה מעקבים שהוחמצו, יוצרת תיעוד אוטומטי ומשפרת תוצאות.'
                : 'Reduces missed follow-ups, creates automatic documentation, improves outcomes.'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {isHebrew ? '👨‍⚕️ רופאים' : '👨‍⚕️ Doctors'}
              </h3>
              <p>{isHebrew
                ? 'ללא התראות כפויות, ללא דירוגים, ללא החלפה. שליטה מלאה.'
                : 'No forced alerts, no rankings, no replacement. Full control.'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {isHebrew ? '💼 מנהלים' : '💼 Administrators'}
              </h3>
              <p>{isHebrew
                ? 'פחות תלונות, ביקורת טובה יותר, שיפור ניתן למדידה.'
                : 'Fewer complaints, better audits, measurable improvement.'}</p>
            </div>
          </div>
        </div>

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
