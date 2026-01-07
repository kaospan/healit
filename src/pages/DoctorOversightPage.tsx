import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language, DoctorMode } from '@/types';

/**
 * Doctor Oversight Page
 * 
 * @description Silent review interface for doctors to approve/reject AI suggestions
 * @layer Doctor Oversight & Silent Review Layer (Layer 4)
 */
export default function DoctorOversightPage() {
  const { user, isDoctor, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<DoctorMode>(DoctorMode.SILENT);

  // Redirect non-doctors
  if (!isDoctor && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">
            {language === Language.HEBREW
              ? 'גישה מורשית לרופאים בלבד'
              : 'Access restricted to doctors only'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('doctor.title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === Language.HEBREW
                  ? 'פיקוח שקט על המלצות AI'
                  : 'Silent oversight of AI suggestions'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === Language.HEBREW ? 'רופא' : 'Doctor'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Toggle */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === Language.HEBREW ? 'מצב עבודה' : 'Working Mode'}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setMode(DoctorMode.SILENT)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                mode === DoctorMode.SILENT
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <div className="text-2xl mb-2">🔕</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {language === Language.HEBREW ? 'מצב שקט' : 'Silent Mode'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === Language.HEBREW
                  ? 'ללא התראות, סקירה בלבד'
                  : 'No notifications, review only'}
              </p>
            </button>
            <button
              onClick={() => setMode(DoctorMode.ACTIVE)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                mode === DoctorMode.ACTIVE
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-2">🔔</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {language === Language.HEBREW ? 'מצב פעיל' : 'Active Mode'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === Language.HEBREW
                  ? 'תזכורות לצוות מופעלות'
                  : 'Staff reminders enabled'}
              </p>
            </button>
          </div>
        </div>

        {/* Sacred Principles */}
        <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === Language.HEBREW ? '✅ עקרונות מקודשים' : '✅ Sacred Principles'}
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>
                {language === Language.HEBREW
                  ? 'אוטונומיה מלאה של הרופא - אתה שולט'
                  : 'Full doctor autonomy - you are in control'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>
                {language === Language.HEBREW
                  ? 'אין דירוג רופאים - רק למידה מצטברת'
                  : 'No doctor scoring - only aggregated learning'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>
                {language === Language.HEBREW
                  ? 'ניתן לדחות או לתקן כל המלצה'
                  : 'Any suggestion can be rejected or corrected'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>
                {language === Language.HEBREW
                  ? 'מסלול ביקורת מלא לכל פעולה'
                  : 'Full audit trail for all actions'}
              </span>
            </li>
          </ul>
        </div>

        {/* AI Suggestions - Pending Review */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === Language.HEBREW
                ? 'המלצות AI ממתינות לסקירה'
                : 'AI Suggestions Pending Review'}
            </h2>
          </div>
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === Language.HEBREW
                ? 'ממשק סקירת המלצות AI יושלם בשלב הבא'
                : 'AI suggestion review interface will be implemented in the next phase'}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              {language === Language.HEBREW ? 'שלב 7 - ממשק פיקוח רופאים' : 'Phase 7 - Doctor Oversight Interface'}
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === Language.HEBREW ? 'המלצות השבוע' : 'This Week'}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === Language.HEBREW ? 'אושרו' : 'Approved'}
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-3xl mb-2">❌</div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {language === Language.HEBREW ? 'נדחו' : 'Rejected'}
            </h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">0</p>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {language === Language.HEBREW ? 'חזרה למרכז הבקרה' : 'Back to Dashboard'}
          </a>
        </div>
      </main>
    </div>
  );
}
