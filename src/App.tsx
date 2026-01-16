import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

// Pages (to be created in next phases)
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import EmergencyPage from './pages/EmergencyPage';
import GuidancePage from './pages/GuidancePage';
import CoordinationPage from './pages/CoordinationPage';
import DoctorOversightPage from './pages/DoctorOversightPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import HIPAAPage from './pages/HIPAAPage';
import AccessibilityPage from './pages/AccessibilityPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main App Component
 * 
 * @description Root component with routing and auth protection
 */
function App() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      
      {/* Static Pages - Public Access */}
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      
      {/* Legal Pages - Public Access */}
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/hipaa" element={<HIPAAPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      
      {/* Protected Routes */}
      {user ? (
        <>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/guidance" element={<GuidancePage />} />
          <Route path="/coordination" element={<CoordinationPage />} />
          <Route path="/doctor" element={<DoctorOversightPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </>
      ) : (
        <Route path="/*" element={<Navigate to="/login" />} />
      )}

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
