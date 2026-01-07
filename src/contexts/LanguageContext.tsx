import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Translations (Hebrew-first, English toggle)
 */
const translations: Record<Language, Record<string, string>> = {
  [Language.HEBREW]: {
    'app.name': 'Healit',
    'app.tagline': 'רשת בטיחות רפואית',
    'auth.signIn': 'התחברות',
    'auth.signOut': 'התנתקות',
    'auth.email': 'דוא״ל',
    'auth.password': 'סיסמה',
    'auth.fullName': 'שם מלא',
    'emergency.title': 'חירום ועזרה ראשונה',
    'emergency.call': 'התקשר למוקד 101 מיד',
    'guidance.title': 'הדרכה בריאותית',
    'coordination.title': 'מעקב ותיאום טיפולים',
    'doctor.title': 'פיקוח רפואי',
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
    'common.cancel': 'ביטול',
    'common.save': 'שמירה',
  },
  [Language.ENGLISH]: {
    'app.name': 'Healit',
    'app.tagline': 'National Healthcare Safety Net',
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'emergency.title': 'Emergency & First Aid',
    'emergency.call': 'Call 101 Emergency Immediately',
    'guidance.title': 'Health Guidance',
    'coordination.title': 'Care Coordination',
    'doctor.title': 'Doctor Oversight',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
  },
  [Language.ARABIC]: {
    'app.name': 'Healit',
    'app.tagline': 'شبكة السلامة الصحية الوطنية',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signOut': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
    'emergency.title': 'الطوارئ والإسعافات الأولية',
    'emergency.call': 'اتصل بالطوارئ 101 فورًا',
    'guidance.title': 'إرشادات صحية',
    'coordination.title': 'تنسيق الرعاية',
    'doctor.title': 'إشراف الطبيب',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
  },
  [Language.RUSSIAN]: {
    'app.name': 'Healit',
    'app.tagline': 'Национальная сеть медицинской безопасности',
    'auth.signIn': 'Войти',
    'auth.signOut': 'Выйти',
    'auth.email': 'Электронная почта',
    'auth.password': 'Пароль',
    'auth.fullName': 'Полное имя',
    'emergency.title': 'Экстренная помощь и первая помощь',
    'emergency.call': 'Немедленно позвоните 101',
    'guidance.title': 'Медицинские рекомендации',
    'coordination.title': 'Координация лечения',
    'doctor.title': 'Врачебный надзор',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
  },
};

/**
 * Language Provider - Hebrew RTL by default
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(Language.HEBREW);

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('healit-language') as Language;
    if (saved && Object.values(Language).includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    // Update document direction and lang
    const dir = language === Language.HEBREW || language === Language.ARABIC ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem('healit-language', lang);
  }

  function t(key: string): string {
    return translations[language][key] || key;
  }

  const dir = language === Language.HEBREW || language === Language.ARABIC ? 'rtl' : 'ltr';

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t,
    dir,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook to access language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
