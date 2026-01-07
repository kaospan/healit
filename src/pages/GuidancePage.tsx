import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Health Guidance Page - Phase 5
 */
export default function GuidancePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('guidance.title')}</h1>
        <div className="medical-card p-6">
          <p className="text-muted-foreground">
            Non-urgent health guidance will be implemented in Phase 5
          </p>
        </div>
      </div>
    </div>
  );
}
