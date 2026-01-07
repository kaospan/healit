import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * 404 Not Found Page
 */
export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          דף לא נמצא / Page Not Found
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          חזרה לדף הבית / Back to Home
        </Link>
      </div>
    </div>
  );
}
