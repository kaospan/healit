import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Support/Help Center Page
 */
export default function SupportPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'תמיכה ומרכז עזרה' : 'Support & Help Center'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'נשמח לעזור לך עם כל שאלה או בעיה'
              : 'We\'re here to help with any questions or issues'}
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link 
            to="/faq"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">❓</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {isHebrew ? 'שאלות נפוצות' : 'FAQ'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isHebrew
                ? 'מצא תשובות לשאלות הנפוצות ביותר'
                : 'Find answers to commonly asked questions'}
            </p>
          </Link>

          <Link 
            to="/contact"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">📧</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {isHebrew ? 'צור קשר' : 'Contact Us'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isHebrew
                ? 'פנה לצוות התמיכה שלנו'
                : 'Get in touch with our support team'}
            </p>
          </Link>
        </div>

        {/* Support Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {isHebrew ? 'אפשרויות תמיכה' : 'Support Options'}
          </h2>
          
          <div className="space-y-6">
            {/* Email Support */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'תמיכה באימייל' : 'Email Support'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {isHebrew
                    ? 'שלח לנו אימייל ונחזור אליך בתוך 24 שעות'
                    : 'Send us an email and we\'ll get back to you within 24 hours'}
                </p>
                <a 
                  href="mailto:support@healit.co.il" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@healit.co.il
                </a>
              </div>
            </div>

            {/* Phone Support */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">📞</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'תמיכה טלפונית' : 'Phone Support'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {isHebrew
                    ? 'זמינים בימים א-ה, 09:00-17:00'
                    : 'Available Sunday-Thursday, 9:00 AM - 5:00 PM'}
                </p>
                <a 
                  href="tel:+97235551234" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  03-555-1234
                </a>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚨</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'תמיכה דחופה' : 'Emergency Support'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {isHebrew
                    ? 'לבעיות קריטיות - זמין 24/7 ללקוחות Enterprise'
                    : 'For critical issues - available 24/7 for Enterprise customers'}
                </p>
                <a 
                  href="tel:+97235559999" 
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold"
                >
                  03-555-9999
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'מסמכי עזרה' : 'Help Documentation'}
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                {isHebrew ? 'מדריך למשתמש' : 'User Guide'}
              </a>
              <p className="text-sm">{isHebrew ? 'מדריך מקיף לכל התכונות' : 'Comprehensive guide to all features'}</p>
            </div>
            <div>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                {isHebrew ? 'מדריך התחלה מהירה' : 'Quick Start Guide'}
              </a>
              <p className="text-sm">{isHebrew ? 'התחל בתוך דקות' : 'Get started in minutes'}</p>
            </div>
            <div>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                {isHebrew ? 'מדריכי וידאו' : 'Video Tutorials'}
              </a>
              <p className="text-sm">{isHebrew ? 'סרטוני הדרכה צעד אחר צעד' : 'Step-by-step video instructions'}</p>
            </div>
            <div>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                {isHebrew ? 'תיעוד API' : 'API Documentation'}
              </a>
              <p className="text-sm">{isHebrew ? 'למפתחים ואינטגרציות' : 'For developers and integrations'}</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isHebrew ? 'כל המערכות פעילות' : 'All Systems Operational'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isHebrew ? 'עדכון אחרון: היום בשעה 14:30' : 'Last updated: Today at 2:30 PM'}
              </p>
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
