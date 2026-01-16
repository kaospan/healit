import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Contact Us Page
 */
export default function ContactPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'צור קשר' : 'Contact Us'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'נשמח לשמוע ממך'
              : 'We\'d love to hear from you'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {isHebrew ? 'פרטי יצירת קשר' : 'Contact Information'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {isHebrew ? 'כתובת' : 'Address'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isHebrew 
                      ? 'רחוב הבריאות 123, תל אביב 6789012'
                      : '123 Health Street, Tel Aviv 6789012'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {isHebrew ? 'טלפון' : 'Phone'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    <a href="tel:+97235551234" className="hover:text-blue-600">
                      03-555-1234
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {isHebrew ? 'אימייל' : 'Email'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    <a href="mailto:info@healit.co.il" className="hover:text-blue-600">
                      info@healit.co.il
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {isHebrew ? 'שעות פעילות' : 'Business Hours'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isHebrew 
                      ? 'ימים א-ה: 09:00-17:00'
                      : 'Sunday-Thursday: 9:00 AM - 5:00 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-500">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🚨 {isHebrew ? 'תמיכה דחופה' : 'Emergency Support'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {isHebrew
                  ? 'לבעיות קריטיות זמינים 24/7'
                  : 'For critical issues available 24/7'}
              </p>
              <a 
                href="tel:+97235559999" 
                className="text-red-600 dark:text-red-400 font-semibold text-lg hover:underline"
              >
                03-555-9999
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {isHebrew ? 'שלח לנו הודעה' : 'Send Us a Message'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isHebrew ? 'שם' : 'Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={isHebrew ? 'השם שלך' : 'Your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isHebrew ? 'אימייל' : 'Email'}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={isHebrew ? 'האימייל שלך' : 'Your email'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isHebrew ? 'נושא' : 'Subject'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={isHebrew ? 'נושא ההודעה' : 'Message subject'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isHebrew ? 'הודעה' : 'Message'}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={isHebrew ? 'כתוב את ההודעה שלך כאן...' : 'Write your message here...'}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {isHebrew ? 'שלח הודעה' : 'Send Message'}
              </button>
            </form>
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
