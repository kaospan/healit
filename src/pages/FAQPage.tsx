import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

/**
 * FAQ Page
 */
export default function FAQPage() {
  const { language } = useLanguage();
  const isHebrew = language === Language.HEBREW;

  const faqs = isHebrew ? [
    {
      question: 'מהו Healit?',
      answer: 'Healit היא פלטפורמת בטיחות רפואית לאומית שעוקבת אחר הפניות, בדיקות ומעקבים כדי למנוע מדברים ליפול בין הכיסאות. אנחנו לא מחליפים רופאים ולא מבצעים אבחנות.'
    },
    {
      question: 'האם המערכת מחליפה רופאים?',
      answer: 'לא! המערכת היא רשת בטיחות בלבד. אנחנו לא מבצעים אבחנות, לא מקבלים החלטות טיפול, ולא מחליפים שיפוט רפואי. הרופאים שומרים על שליטה מלאה.'
    },
    {
      question: 'האם המידע שלי מאובטח?',
      answer: 'כן. אנחנו עומדים בכל תקני האבטחה והפרטיות של ישראל, כולל תאימות HIPAA. כל המידע מוצפן ומאובטח.'
    },
    {
      question: 'האם המערכת עושה דירוג לרופאים?',
      answer: 'לא! אנחנו לא מדרגים רופאים ולא מפרסמים מדדי ביצועים אישיים. המערכת לומדת מההתנהגות של הרופאים כדי לשפר את ההמלצות, אבל לא מחליפה את השיפוט הרפואי.'
    },
    {
      question: 'איך המערכת עוזרת לקופות חולים?',
      answer: 'המערכת מפחיתה מעקבים שהוחמצו, יוצרת תיעוד אוטומטי, משפרת תוצאות ללא שינוי התנהגות רופא, ומספקת ביקורת טובה יותר.'
    },
    {
      question: 'מה קורה במצב חירום?',
      answer: 'במצב חירום, המערכת מפנה מיידית למוקד 101 ומספקת הוראות עזרה ראשונה. אנחנו לא מחליפים שירותי חירום אלא מסייעים עד שהם מגיעים.'
    },
    {
      question: 'האם צריך הכשרה מיוחדת להשתמש במערכת?',
      answer: 'לא. המערכת מעוצבת להיות אינטואיטיבית וקלה לשימוש. אנחנו מספקים הדרכה קצרה ותמיכה מלאה.'
    },
    {
      question: 'כמה עולה השירות?',
      answer: 'יש לנו תוכניות תמחור שונות בהתאם לגודל ולצרכים של הארגון. ראה את דף התמחור שלנו לפרטים נוספים.'
    },
  ] : [
    {
      question: 'What is Healit?',
      answer: 'Healit is a national healthcare safety platform that tracks referrals, exams, and follow-ups to prevent things from falling through the cracks. We don\'t replace doctors or make diagnoses.'
    },
    {
      question: 'Does the system replace doctors?',
      answer: 'No! The system is a safety net only. We don\'t make diagnoses, treatment decisions, or replace medical judgment. Doctors maintain full control.'
    },
    {
      question: 'Is my information secure?',
      answer: 'Yes. We comply with all Israeli security and privacy standards, including HIPAA compliance. All information is encrypted and secured.'
    },
    {
      question: 'Does the system score doctors?',
      answer: 'No! We don\'t score doctors or publish individual performance metrics. The system learns from doctor behavior to improve recommendations, but doesn\'t replace medical judgment.'
    },
    {
      question: 'How does the system help health funds?',
      answer: 'The system reduces missed follow-ups, creates automatic documentation, improves outcomes without changing doctor behavior, and provides better audits.'
    },
    {
      question: 'What happens in an emergency?',
      answer: 'In an emergency, the system immediately directs to 101 emergency services and provides first aid instructions. We don\'t replace emergency services but assist until they arrive.'
    },
    {
      question: 'Do I need special training to use the system?',
      answer: 'No. The system is designed to be intuitive and easy to use. We provide brief training and full support.'
    },
    {
      question: 'How much does the service cost?',
      answer: 'We have different pricing plans based on organization size and needs. See our pricing page for more details.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isHebrew 
              ? 'מצא תשובות לשאלות הנפוצות ביותר'
              : 'Find answers to the most common questions'}
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {isHebrew ? 'עדיין יש שאלות?' : 'Still Have Questions?'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isHebrew
              ? 'צוות התמיכה שלנו כאן כדי לעזור'
              : 'Our support team is here to help'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {isHebrew ? 'צור קשר' : 'Contact Us'}
            </Link>
            <Link 
              to="/support"
              className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              {isHebrew ? 'מרכז עזרה' : 'Help Center'}
            </Link>
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
