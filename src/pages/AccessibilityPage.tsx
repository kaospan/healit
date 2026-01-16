import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * Israeli Accessibility Page
 */
export default function AccessibilityPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'הצהרת נגישות' : 'Accessibility Statement'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'ההתחייבות שלנו לנגישות דיגיטלית לכל'
              : 'Our Commitment to Digital Accessibility for All'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
          {/* Commitment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'ההתחייבות שלנו' : 'Our Commitment'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHebrew
                ? 'Healit מחויבת להבטיח נגישות דיגיטלית לאנשים עם מוגבלויות. אנו משפרים ללא הרף את חווית המשתמש עבור כולם ומיישמים את תקני הנגישות הרלוונטיים.'
                : 'Healit is committed to ensuring digital accessibility for people with disabilities. We continuously improve the user experience for everyone and apply the relevant accessibility standards.'}
            </p>
          </section>

          {/* Standards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'תקנים ותאימות' : 'Standards and Compliance'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {isHebrew
                ? 'האתר שלנו עומד בדרישות הנגישות הבאות:'
                : 'Our website complies with the following accessibility requirements:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'תקן ישראלי 5568:' : 'Israeli Standard 5568:'}
                </span> {isHebrew 
                  ? 'התקן הישראלי לנגישות תכנים באינטרנט'
                  : 'Israeli standard for web content accessibility'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  WCAG 2.1:
                </span> {isHebrew 
                  ? 'הנחיות נגישות לתכנים באינטרנט ברמה AA'
                  : 'Web Content Accessibility Guidelines Level AA'}
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'תקנות שוויון זכויות 2014:' : 'Equal Rights Regulations 2014:'}
                </span> {isHebrew 
                  ? 'תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות)'
                  : 'Equal Rights for Persons with Disabilities Regulations (Accessibility Adjustments to Service)'}
              </li>
            </ul>
          </section>

          {/* Accessibility Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'תכונות נגישות' : 'Accessibility Features'}
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'ניווט במקלדת' : 'Keyboard Navigation'}
                </h3>
                <p>{isHebrew 
                  ? 'ניתן לנווט באתר באמצעות מקלדת בלבד, ללא צורך בעכבר.'
                  : 'The site can be navigated using keyboard only, without requiring a mouse.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'תמיכה בקוראי מסך' : 'Screen Reader Support'}
                </h3>
                <p>{isHebrew 
                  ? 'האתר תומך בקוראי מסך נפוצים כמו JAWS, NVDA ו-VoiceOver.'
                  : 'The site supports common screen readers such as JAWS, NVDA, and VoiceOver.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'ניגודיות וצבעים' : 'Contrast and Colors'}
                </h3>
                <p>{isHebrew 
                  ? 'האתר עומד ביחסי ניגודיות מינימליים של WCAG AA והמידע אינו מועבר בצבע בלבד.'
                  : 'The site meets WCAG AA minimum contrast ratios and information is not conveyed by color alone.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'גדלי גופנים גמישים' : 'Flexible Font Sizes'}
                </h3>
                <p>{isHebrew 
                  ? 'ניתן להגדיל את הטקסט עד 200% ללא אובדן פונקציונליות.'
                  : 'Text can be enlarged up to 200% without loss of functionality.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'תמיכה ב-RTL' : 'RTL Support'}
                </h3>
                <p>{isHebrew 
                  ? 'תמיכה מלאה בשפות מימין לשמאל (עברית וערבית).'
                  : 'Full support for right-to-left languages (Hebrew and Arabic).'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {isHebrew ? 'תוויות והנחיות ברורות' : 'Clear Labels and Instructions'}
                </h3>
                <p>{isHebrew 
                  ? 'כל הטפסים והפקדים מתוייגים בצורה ברורה עם הנחיות מפורשות.'
                  : 'All forms and controls are clearly labeled with explicit instructions.'}</p>
              </div>
            </div>
          </section>

          {/* Known Limitations */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'מגבלות ידועות' : 'Known Limitations'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {isHebrew
                ? 'למרות המאמצים שלנו, יתכן שחלק מהאזורים באתר עדיין לא נגישים לחלוטין. אנחנו עובדים באופן מתמיד לשיפור:'
                : 'Despite our efforts, some areas of the site may not be fully accessible. We are continuously working to improve:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'תכונות AI ומודלים אינטראקטיביים מורכבים' : 'AI features and complex interactive models'}</li>
              <li>{isHebrew ? 'תוכן שסופק על ידי צדדים שלישיים' : 'Content provided by third parties'}</li>
              <li>{isHebrew ? 'מסמכי PDF מדור קודם' : 'Legacy PDF documents'}</li>
            </ul>
          </section>

          {/* Assistive Technology */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'טכנולוגיות מסייעות' : 'Assistive Technologies'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {isHebrew
                ? 'האתר שלנו מתוכנן לעבוד עם הטכנולוגיות המסייעות הבאות:'
                : 'Our site is designed to work with the following assistive technologies:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mr-6">
              <li>{isHebrew ? 'קוראי מסך (JAWS, NVDA, VoiceOver)' : 'Screen readers (JAWS, NVDA, VoiceOver)'}</li>
              <li>{isHebrew ? 'תוכנות הגדלה' : 'Screen magnification software'}</li>
              <li>{isHebrew ? 'תוכנות זיהוי קולי' : 'Voice recognition software'}</li>
              <li>{isHebrew ? 'טכנולוגיות ניווט חלופיות' : 'Alternative navigation technologies'}</li>
            </ul>
          </section>

          {/* Feedback */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {isHebrew ? 'משוב ותמיכה' : 'Feedback and Support'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              {isHebrew
                ? 'אנו מעוניינים לשמוע ממך על כל בעיות נגישות שנתקלת בהן או על הצעות לשיפור:'
                : 'We want to hear from you about any accessibility issues you encounter or suggestions for improvement:'}
            </p>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isHebrew ? 'רכז נגישות:' : 'Accessibility Coordinator:'}
                </span> {isHebrew ? 'שרה כהן' : 'Sarah Cohen'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Email: <a href="mailto:accessibility@healit.co.il" className="text-blue-600 dark:text-blue-400 hover:underline">accessibility@healit.co.il</a>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {isHebrew ? 'טלפון: 03-555-1234' : 'Phone: 03-555-1234'}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              {isHebrew
                ? 'אנו שואפים להגיב לפניות נגישות תוך 5 ימי עסקים.'
                : 'We aim to respond to accessibility inquiries within 5 business days.'}
            </p>
          </section>

          {/* Last Updated */}
          <section>
            <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
              {isHebrew 
                ? 'הצהרת נגישות זו עודכנה לאחרונה בינואר 2026'
                : 'This accessibility statement was last updated in January 2026'}
            </p>
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
