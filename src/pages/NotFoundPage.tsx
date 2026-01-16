import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * 404 Not Found Page
 */
export default function NotFoundPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
          {isHebrew ? 'דף לא נמצא' : 'Page Not Found'}
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-12">
          {isHebrew 
            ? 'הדף שחיפשת לא קיים או הוסר'
            : 'The page you are looking for does not exist or has been removed'}
        </p>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {isHebrew ? 'קישורים שימושיים' : 'Useful Links'}
          </h2>
          
          {/* Main Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {isHebrew ? 'מוצר' : 'Product'}
              </h3>
              <div className="space-y-2 text-sm">
                <Link to="/features" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'תכונות' : 'Features'}
                </Link>
                <Link to="/pricing" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'תמחור' : 'Pricing'}
                </Link>
                <Link to="/about" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'אודות' : 'About'}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {isHebrew ? 'תמיכה' : 'Support'}
              </h3>
              <div className="space-y-2 text-sm">
                <Link to="/support" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'מרכז עזרה' : 'Help Center'}
                </Link>
                <Link to="/contact" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'צור קשר' : 'Contact Us'}
                </Link>
                <Link to="/faq" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'שאלות נפוצות' : 'FAQ'}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {isHebrew ? 'משפטי' : 'Legal'}
              </h3>
              <div className="space-y-2 text-sm">
                <Link to="/privacy" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'מדיניות פרטיות' : 'Privacy Policy'}
                </Link>
                <Link to="/terms" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'תנאי שירות' : 'Terms of Service'}
                </Link>
                <Link to="/hipaa" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'תאימות HIPAA' : 'HIPAA Compliance'}
                </Link>
                <Link to="/accessibility" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  {isHebrew ? 'נגישות' : 'Accessibility'}
                </Link>
              </div>
            </div>
          </div>

          {/* Emergency Link */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              to="/emergency"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              🚨 {isHebrew ? 'חירום ועזרה ראשונה' : 'Emergency & First Aid'}
            </Link>
          </div>
        </div>

        {/* Home Button */}
        <Link 
          to="/" 
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg"
        >
          {isHebrew ? 'חזרה לדף הבית' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}
