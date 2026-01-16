import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';
import ChatInterface from '@/components/ChatInterface';

/**
 * Dashboard Page
 * 
 * @description Main dashboard with ChatGPT-style assistant and role-based navigation
 */
export default function DashboardPage() {
  const { user, signOut, isDoctor, isStaff, isAdmin, isPatient } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('app.name')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('app.tagline')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex gap-1">
                {[Language.HEBREW, Language.ENGLISH].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      language === lang
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* User Info */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role}
                </p>
              </div>
              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {t('auth.signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {language === Language.HEBREW 
              ? `שלום, ${user?.full_name}` 
              : `Welcome, ${user?.full_name}`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === Language.HEBREW
              ? 'דבר עם העוזר הדיגיטלי או בחר פעולה מהרשימה למטה'
              : 'Chat with the digital assistant or select an action from the list below'}
          </p>
        </div>

        {/* Chat Interface - Main Feature */}
        <div className="mb-8">
          <ChatInterface userName={user?.full_name} />
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === Language.HEBREW ? 'גישה מהירה' : 'Quick Access'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Emergency - Public Access */}
          <Link
            to="/emergency"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-red-500"
          >
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('emergency.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === Language.HEBREW
                ? 'חירום ועזרה ראשונה - גישה ציבורית'
                : 'Emergency & First Aid - Public Access'}
            </p>
          </Link>

          {/* Health Guidance - Patient Facing */}
          {(isPatient || isStaff || isDoctor || isAdmin) && (
            <Link
              to="/guidance"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-blue-500"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('guidance.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === Language.HEBREW
                  ? 'שאלות בריאות שאינן דחופות'
                  : 'Non-urgent health questions'}
              </p>
            </Link>
          )}

          {/* Care Coordination - Staff Facing */}
          {(isStaff || isDoctor || isAdmin) && (
            <Link
              to="/coordination"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-green-500"
            >
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('coordination.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === Language.HEBREW
                  ? 'מעקב אחר הפניות ובדיקות - ליבת המערכת'
                  : 'Track referrals and follow-ups - Core Value'}
              </p>
            </Link>
          )}

          {/* Doctor Oversight - Doctor Only */}
          {(isDoctor || isAdmin) && (
            <Link
              to="/doctor"
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-purple-500"
            >
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('doctor.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === Language.HEBREW
                  ? 'פיקוח שקט - סקירה ואישור המלצות AI'
                  : 'Silent oversight - Review and approve AI suggestions'}
              </p>
            </Link>
          )}
        </div>
        </div>

        {/* System Info */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === Language.HEBREW ? 'אודות המערכת' : 'About the System'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-medium mb-2">
                {language === Language.HEBREW ? '✅ מה המערכת עושה:' : '✅ What this system does:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>{language === Language.HEBREW ? 'רשת בטיחות קלינית' : 'Clinical safety net'}</li>
                <li>{language === Language.HEBREW ? 'אכיפת מעקב' : 'Follow-through enforcement'}</li>
                <li>{language === Language.HEBREW ? 'מערכת למידה' : 'Learning system'}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">
                {language === Language.HEBREW ? '❌ מה המערכת לא עושה:' : '❌ What this system does NOT do:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>{language === Language.HEBREW ? 'אין אבחון' : 'No diagnosis'}</li>
                <li>{language === Language.HEBREW ? 'אין החלטות טיפול' : 'No treatment decisions'}</li>
                <li>{language === Language.HEBREW ? 'אין דירוג רופאים' : 'No doctor scoring'}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
