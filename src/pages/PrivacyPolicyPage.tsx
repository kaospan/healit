import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Privacy Policy Page
 */
export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'מדיניות פרטיות' : 'Privacy Policy'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isHebrew ? 'עדכון אחרון: ינואר 2026' : 'Last Updated: January 2026'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '1. מבוא' : '1. Introduction'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'Healit מחויבת להגן על הפרטיות והאבטחה של המידע הרפואי שלך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי והרפואי שלך.'
                : 'Healit is committed to protecting the privacy and security of your medical information. This Privacy Policy explains how we collect, use, and protect your personal and medical information.'}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '2. מידע שאנו אוספים' : '2. Information We Collect'}
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'מידע אישי:' : 'Personal Information:'}
                </h3>
                <ul className="list-disc list-inside space-y-1 mr-6">
                  <li>{isHebrew ? 'שם מלא' : 'Full name'}</li>
                  <li>{isHebrew ? 'כתובת דוא״ל' : 'Email address'}</li>
                  <li>{isHebrew ? 'מספר טלפון' : 'Phone number'}</li>
                  <li>{isHebrew ? 'מספר זהות (מוצפן)' : 'ID number (encrypted)'}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'מידע רפואי (PHI):' : 'Medical Information (PHI):'}
                </h3>
                <ul className="list-disc list-inside space-y-1 mr-6">
                  <li>{isHebrew ? 'תיעוד רפואי' : 'Medical records'}</li>
                  <li>{isHebrew ? 'הפניות ובדיקות' : 'Referrals and tests'}</li>
                  <li>{isHebrew ? 'היסטוריית טיפול' : 'Treatment history'}</li>
                  <li>{isHebrew ? 'תוצאות בדיקות' : 'Test results'}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '3. כיצד אנו משתמשים במידע' : '3. How We Use Information'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'מעקב אחר הפניות ובדיקות' : 'Tracking referrals and tests'}</li>
              <li>{isHebrew ? 'זיהוי פערים בטיפול' : 'Identifying gaps in care'}</li>
              <li>{isHebrew ? 'הפקת דוחות לרופאים' : 'Generating reports for doctors'}</li>
              <li>{isHebrew ? 'שיפור המערכת והלמידה' : 'System improvement and learning'}</li>
              <li>{isHebrew ? 'תאימות רגולטורית' : 'Regulatory compliance'}</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '4. אבטחת מידע' : '4. Data Security'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {isHebrew
                ? 'אנו משתמשים באמצעי אבטחה מתקדמים כולל:'
                : 'We use advanced security measures including:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'הצפנה מלאה של כל המידע' : 'Full encryption of all data'}</li>
              <li>{isHebrew ? 'גישה מבוקרת לפי תפקידים (RBAC)' : 'Role-based access control (RBAC)'}</li>
              <li>{isHebrew ? 'רישום מלא של כל הפעולות (Audit Trail)' : 'Complete audit trail of all actions'}</li>
              <li>{isHebrew ? 'גיבויים אוטומטיים' : 'Automatic backups'}</li>
              <li>{isHebrew ? 'תאימות ISO 27001' : 'ISO 27001 compliance'}</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '5. שיתוף מידע' : '5. Data Sharing'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'אנחנו לא משתפים את המידע האישי או הרפואי שלך עם גורמים חיצוניים ללא הסכמתך המפורשת, למעט כנדרש על פי חוק או לצורך מתן השירות (למשל, עם הרופא המטפל שלך או קופת החולים שלך).'
                : 'We do not share your personal or medical information with external parties without your explicit consent, except as required by law or necessary to provide the service (e.g., with your treating physician or health fund).'}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '6. הזכויות שלך' : '6. Your Rights'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'זכות גישה למידע האישי שלך' : 'Right to access your personal information'}</li>
              <li>{isHebrew ? 'זכות לתיקון מידע שגוי' : 'Right to correct inaccurate information'}</li>
              <li>{isHebrew ? 'זכות למחיקת מידע' : 'Right to delete information'}</li>
              <li>{isHebrew ? 'זכות להגביל שימוש במידע' : 'Right to restrict use of information'}</li>
              <li>{isHebrew ? 'זכות להעביר מידע' : 'Right to data portability'}</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? '7. צור קשר' : '7. Contact Us'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'לשאלות על מדיניות הפרטיות שלנו, צור קשר:'
                : 'For questions about our privacy policy, contact us:'}
            </p>
            <div className="mt-3">
              <p className="text-gray-600 dark:text-gray-400">
                Email: <a href="mailto:privacy@healit.co.il" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@healit.co.il</a>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {isHebrew ? 'טלפון: 03-555-1234' : 'Phone: 03-555-1234'}
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
