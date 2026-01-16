import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * HIPAA Compliance Page
 */
export default function HIPAAPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'תאימות HIPAA' : 'HIPAA Compliance'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'ההתחייבות שלנו להגנה על מידע רפואי מוגן (PHI)'
              : 'Our Commitment to Protecting Health Information (PHI)'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'סקירה כללית' : 'Overview'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'Healit מחויבת לעמוד בדרישות HIPAA (חוק ניוד ואחריות ביטוח בריאות) ובתקני הגנת הפרטיות והאבטחה של ישראל. אנו מיישמים אמצעי אבטחה מקיפים כדי להגן על המידע הרפואי המוגן (PHI) של המשתמשים שלנו.'
                : 'Healit is committed to complying with HIPAA (Health Insurance Portability and Accountability Act) requirements and Israeli privacy and security standards. We implement comprehensive security measures to protect our users\' Protected Health Information (PHI).'}
            </p>
          </section>

          {/* Administrative Safeguards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'אמצעי הגנה מנהליים' : 'Administrative Safeguards'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'ניהול אבטחה:' : 'Security Management:'}
                </span> {isHebrew 
                  ? 'מדיניות ונהלים מקיפים להגנה על PHI'
                  : 'Comprehensive policies and procedures to protect PHI'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'הכשרת עובדים:' : 'Staff Training:'}
                </span> {isHebrew 
                  ? 'הכשרה רגילה על אבטחה ופרטיות'
                  : 'Regular training on security and privacy'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'ניהול סיכונים:' : 'Risk Management:'}
                </span> {isHebrew 
                  ? 'הערכות סיכונים קבועות ותכניות תיקון'
                  : 'Regular risk assessments and remediation plans'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'ניהול גישה:' : 'Access Management:'}
                </span> {isHebrew 
                  ? 'בקרת גישה מבוססת תפקידים (RBAC)'
                  : 'Role-based access control (RBAC)'}
              </li>
            </ul>
          </section>

          {/* Physical Safeguards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'אמצעי הגנה פיזיים' : 'Physical Safeguards'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'מרכזי נתונים מאובטחים:' : 'Secure Data Centers:'}
                </span> {isHebrew 
                  ? 'אחסון בענן מאובטח עם תקני SOC 2'
                  : 'SOC 2 compliant secure cloud storage'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'בקרת גישה פיזית:' : 'Physical Access Control:'}
                </span> {isHebrew 
                  ? 'הגבלת גישה למתקנים'
                  : 'Restricted access to facilities'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'גיבויים:' : 'Backups:'}
                </span> {isHebrew 
                  ? 'גיבוי אוטומטי ומאובטח של כל המידע'
                  : 'Automatic and secure backup of all data'}
              </li>
            </ul>
          </section>

          {/* Technical Safeguards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'אמצעי הגנה טכניים' : 'Technical Safeguards'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'הצפנה:' : 'Encryption:'}
                </span> {isHebrew 
                  ? 'הצפנת TLS/SSL לנתונים בתנועה ו-AES-256 לנתונים במנוחה'
                  : 'TLS/SSL encryption for data in transit and AES-256 for data at rest'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'אימות:' : 'Authentication:'}
                </span> {isHebrew 
                  ? 'אימות דו-שלבי (2FA) לכל המשתמשים'
                  : 'Two-factor authentication (2FA) for all users'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'רישום ביקורת:' : 'Audit Logging:'}
                </span> {isHebrew 
                  ? 'רישום מלא של כל הגישה ל-PHI'
                  : 'Complete logging of all PHI access'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'זיהוי ייחודי:' : 'Unique Identification:'}
                </span> {isHebrew 
                  ? 'כל משתמש עם זיהוי ייחודי לאחריות'
                  : 'Each user with unique ID for accountability'}
              </li>
            </ul>
          </section>

          {/* Data Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'זכויות על הנתונים' : 'Data Rights'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {isHebrew
                ? 'בהתאם ל-HIPAA, יש לך את הזכויות הבאות לגבי ה-PHI שלך:'
                : 'Under HIPAA, you have the following rights regarding your PHI:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'זכות גישה - לראות ולקבל עותק של ה-PHI שלך' : 'Right to access - view and receive a copy of your PHI'}</li>
              <li>{isHebrew ? 'זכות לתיקון - לבקש תיקון של מידע לא מדויק' : 'Right to amend - request correction of inaccurate information'}</li>
              <li>{isHebrew ? 'זכות להגבלה - להגביל שימושים וגילויים מסוימים' : 'Right to restriction - limit certain uses and disclosures'}</li>
              <li>{isHebrew ? 'זכות לחשבון - לקבל רשימת גילויים' : 'Right to accounting - receive list of disclosures'}</li>
              <li>{isHebrew ? 'זכות לתקשורת סודית - לבחור כיצד לקבל מידע' : 'Right to confidential communication - choose how to receive information'}</li>
            </ul>
          </section>

          {/* Breach Notification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'הודעת הפרה' : 'Breach Notification'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'במקרה של הפרת אבטחה המשפיעה על PHI, נודיע לך ולרשויות הרלוונטיות בהתאם לדרישות HIPAA ולחוקי הגנת הפרטיות של ישראל, בתוך 60 יום מגילוי ההפרה.'
                : 'In the event of a security breach affecting PHI, we will notify you and relevant authorities in accordance with HIPAA requirements and Israeli privacy laws, within 60 days of discovering the breach.'}
            </p>
          </section>

          {/* Business Associates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'שותפים עסקיים' : 'Business Associates'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'כל השותפים העסקיים שלנו החשופים ל-PHI חתומים על הסכם שותף עסקי (BAA) ועומדים בדרישות HIPAA.'
                : 'All our business associates who are exposed to PHI have signed a Business Associate Agreement (BAA) and comply with HIPAA requirements.'}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'צור קשר' : 'Contact Us'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'לשאלות על תאימות HIPAA או לדיווח על חשש אבטחה:'
                : 'For questions about HIPAA compliance or to report a security concern:'}
            </p>
            <div className="mt-3">
              <p className="text-gray-600 dark:text-gray-400">
                Email: <a href="mailto:compliance@healit.co.il" className="text-blue-600 dark:text-blue-400 hover:underline">compliance@healit.co.il</a>
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
