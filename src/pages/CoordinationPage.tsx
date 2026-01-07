import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Care Coordination Page - CORE VALUE - Phase 6
 */
export default function CoordinationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('coordination.title')}</h1>
        <div className="medical-card p-6">
          <p className="text-muted-foreground">
            Care follow-through and coordination tracking will be implemented in Phase 6
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            This is the CORE VALUE layer - preventing things from falling through cracks
          </p>
        </div>
      </div>
    </div>
  );
}
