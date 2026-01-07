import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

// Pages (to be created in next phases)
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmergencyPage from './pages/EmergencyPage';
import GuidancePage from './pages/GuidancePage';
import CoordinationPage from './pages/CoordinationPage';
import DoctorOversightPage from './pages/DoctorOversightPage';
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
      <Route path="/emergency" element={<EmergencyPage />} />
      
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
