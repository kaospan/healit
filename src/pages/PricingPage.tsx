import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Pricing Page
 */
export default function PricingPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'תמחור' : 'Pricing'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'מודלי תמחור עבור קופות חולים ומערכות בריאות'
              : 'Pricing models for health funds and healthcare systems'}
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Basic */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'בסיסי' : 'Basic'}
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {isHebrew ? '₪50K' : '$15K'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {isHebrew ? '/חודש' : '/month'}
              </span>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>✓ {isHebrew ? 'עד 10,000 חולים' : 'Up to 10,000 patients'}</li>
              <li>✓ {isHebrew ? 'הדרכת חירום' : 'Emergency guidance'}</li>
              <li>✓ {isHebrew ? 'תיאום טיפול בסיסי' : 'Basic care coordination'}</li>
              <li>✓ {isHebrew ? 'תמיכה באימייל' : 'Email support'}</li>
            </ul>
          </div>

          {/* Professional */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-blue-500">
            <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
              {isHebrew ? 'מומלץ' : 'RECOMMENDED'}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'מקצועי' : 'Professional'}
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {isHebrew ? '₪150K' : '$45K'}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {isHebrew ? '/חודש' : '/month'}
              </span>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>✓ {isHebrew ? 'עד 100,000 חולים' : 'Up to 100,000 patients'}</li>
              <li>✓ {isHebrew ? 'כל התכונות הבסיסיות' : 'All Basic features'}</li>
              <li>✓ {isHebrew ? 'תיאום טיפול מתקדם' : 'Advanced care coordination'}</li>
              <li>✓ {isHebrew ? 'פיקוח רופאים' : 'Doctor oversight'}</li>
              <li>✓ {isHebrew ? 'מערכת למידה' : 'Learning system'}</li>
              <li>✓ {isHebrew ? 'תמיכה 24/7' : '24/7 support'}</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'ארגוני' : 'Enterprise'}
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {isHebrew ? 'מותאם' : 'Custom'}
              </span>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>✓ {isHebrew ? 'ללא הגבלת חולים' : 'Unlimited patients'}</li>
              <li>✓ {isHebrew ? 'כל התכונות המקצועיות' : 'All Professional features'}</li>
              <li>✓ {isHebrew ? 'התאמה אישית' : 'Custom integration'}</li>
              <li>✓ {isHebrew ? 'SLA ייעודי' : 'Dedicated SLA'}</li>
              <li>✓ {isHebrew ? 'מנהל חשבון' : 'Account manager'}</li>
              <li>✓ {isHebrew ? 'הכשרה באתר' : 'On-site training'}</li>
            </ul>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'למה כדאי להשקיע?' : 'Why Invest?'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <li>✅ {isHebrew ? 'הפחתת מעקבים שהוחמצו' : 'Reduces missed follow-ups'}</li>
            <li>✅ {isHebrew ? 'יצירת תיעוד אוטומטי' : 'Creates automatic documentation'}</li>
            <li>✅ {isHebrew ? 'שיפור תוצאות ללא שינוי התנהגות רופא' : 'Improves outcomes without changing doctor behavior'}</li>
            <li>✅ {isHebrew ? 'עובד בשקט' : 'Works silently'}</li>
            <li>✅ {isHebrew ? 'מתרחב על פני מרפאות' : 'Scales across clinics'}</li>
            <li>✅ {isHebrew ? 'פחות תלונות' : 'Fewer complaints'}</li>
            <li>✅ {isHebrew ? 'ביקורת טובה יותר' : 'Better audits'}</li>
            <li>✅ {isHebrew ? 'שיפור ניתן למדידה' : 'Measurable improvement'}</li>
          </ul>
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
