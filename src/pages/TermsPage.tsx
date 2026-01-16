import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Terms of Service Page
 */
export default function TermsPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'תנאי שירות' : 'Terms of Service'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isHebrew ? 'עדכון אחרון: ינואר 2026' : 'Last Updated: January 2026'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '1. קבלת התנאים' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'על ידי גישה ושימוש בשירות Healit, אתה מסכים לתנאי שירות אלה. אם אינך מסכים לתנאים אלה, אל תשתמש בשירות.'
                : 'By accessing and using the Healit service, you agree to these Terms of Service. If you do not agree to these terms, do not use the service.'}
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '2. תיאור השירות' : '2. Service Description'}
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p className="leading-relaxed">
                {isHebrew
                  ? 'Healit היא פלטפורמת בטיחות רפואית שמספקת:'
                  : 'Healit is a healthcare safety platform that provides:'}
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6">
                <li>{isHebrew ? 'מעקב אחר הפניות ובדיקות רפואיות' : 'Tracking of medical referrals and tests'}</li>
                <li>{isHebrew ? 'זיהוי פערים בטיפול' : 'Identification of care gaps'}</li>
                <li>{isHebrew ? 'הדרכה בריאותית לא דחופה' : 'Non-urgent health guidance'}</li>
                <li>{isHebrew ? 'הנחיות חירום ועזרה ראשונה' : 'Emergency and first aid guidance'}</li>
              </ul>
              <p className="leading-relaxed font-semibold">
                {isHebrew
                  ? 'המערכת אינה מבצעת אבחנות רפואיות או מחליפה שיפוט רפואי מקצועי.'
                  : 'The system does not make medical diagnoses or replace professional medical judgment.'}
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '3. אחריות המשתמש' : '3. User Responsibilities'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'לשמור על סודיות פרטי ההתחברות' : 'Maintain confidentiality of login credentials'}</li>
              <li>{isHebrew ? 'להשתמש בשירות רק למטרות חוקיות' : 'Use the service only for lawful purposes'}</li>
              <li>{isHebrew ? 'לספק מידע מדויק ומעודכן' : 'Provide accurate and updated information'}</li>
              <li>{isHebrew ? 'לא להעביר מידע רפואי לגורמים לא מורשים' : 'Not share medical information with unauthorized parties'}</li>
              <li>{isHebrew ? 'לפנות לרופא במצבי חירום אמיתיים' : 'Contact a doctor in real emergency situations'}</li>
            </ul>
          </section>

          {/* Medical Disclaimer */}
          <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-2 border-yellow-500">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ⚠️ {isHebrew ? '4. הגבלת אחריות רפואית' : '4. Medical Disclaimer'}
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="font-semibold">
                {isHebrew
                  ? 'Healit אינו תחליף לייעוץ, אבחון או טיפול רפואי מקצועי.'
                  : 'Healit is not a substitute for professional medical advice, diagnosis, or treatment.'}
              </p>
              <p>
                {isHebrew
                  ? 'תמיד פנה לרופא או לספק שירותי בריאות מוסמך לגבי כל שאלה הקשורה למצב רפואי. אל תתעלם מייעוץ רפואי מקצועי או תעכב בחיפוש אחריו בגלל משהו שקראת או שמעת ב-Healit.'
                  : 'Always consult a physician or qualified healthcare provider regarding any questions about a medical condition. Never disregard professional medical advice or delay seeking it because of something you read or heard on Healit.'}
              </p>
              <p className="font-semibold">
                {isHebrew
                  ? 'במקרה חירום - התקשר מיד למוקד 101!'
                  : 'In case of emergency - call 101 immediately!'}
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '5. הגבלת אחריות' : '5. Limitation of Liability'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'Healit לא תישא באחריות לכל נזק ישיר, עקיף, מקרי, מיוחד או תוצאתי הנובע משימוש או אי-יכולת להשתמש בשירות. השירות מסופק "כמות שהוא" ו"כפי שזמין".'
                : 'Healit shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from use or inability to use the service. The service is provided "as is" and "as available".'}
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '6. קניין רוחני' : '6. Intellectual Property'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'כל התוכן, הסימנים המסחריים, הלוגו והקניין הרוחני ב-Healit שייכים לחברה ומוגנים על פי חוקי הקניין הרוחני של ישראל והבינלאומיים.'
                : 'All content, trademarks, logos, and intellectual property in Healit belong to the company and are protected by Israeli and international intellectual property laws.'}
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '7. סיום שירות' : '7. Service Termination'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'אנו שומרים לעצמנו את הזכות להשעות או לסיים את הגישה שלך לשירות בכל עת, עם או בלי הודעה, בגין הפרת תנאי שירות אלה או מכל סיבה אחרת.'
                : 'We reserve the right to suspend or terminate your access to the service at any time, with or without notice, for violation of these Terms of Service or for any other reason.'}
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '8. שינויים בתנאים' : '8. Changes to Terms'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'אנו שומרים לעצמנו את הזכות לשנות את תנאי השירות בכל עת. שינויים יכנסו לתוקף מיד עם פרסומם באתר. המשך שימוש בשירות לאחר שינויים מהווה הסכמה לתנאים המעודכנים.'
                : 'We reserve the right to modify these Terms of Service at any time. Changes will take effect immediately upon posting on the site. Continued use of the service after changes constitutes acceptance of the updated terms.'}
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '9. דין חל' : '9. Governing Law'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'תנאי שירות אלה יהיו כפופים ויפורשו בהתאם לחוקי מדינת ישראל. כל סכסוך יוכרע בבתי המשפט המוסמכים בישראל.'
                : 'These Terms of Service shall be governed by and construed in accordance with the laws of the State of Israel. Any disputes shall be resolved in the competent courts of Israel.'}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '10. צור קשר' : '10. Contact Us'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'לשאלות על תנאי השירות, צור קשר:'
                : 'For questions about these Terms of Service, contact us:'}
            </p>
            <div className="mt-3">
              <p className="text-gray-600 dark:text-gray-400">
                Email: <a href="mailto:legal@healit.co.il" className="text-blue-600 dark:text-blue-400 hover:underline">legal@healit.co.il</a>
              </p>
            </div>
          </section>
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
