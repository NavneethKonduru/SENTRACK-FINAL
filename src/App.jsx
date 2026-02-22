import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import OfflineIndicator from './components/layout/OfflineIndicator';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider, useToast } from './components/shared/Toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { seedDemoData } from './utils/demoLoader';
import { syncOfflineQueue, pullCloudDataToLocal } from './services/firestoreService';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RecordAssessment from './pages/RecordAssessment';
import AthleteProfile from './pages/AthleteProfile';
import ScoutView from './pages/ScoutView';
import Challenges from './pages/Challenges';
import Settings from './pages/Settings';
import VerifySenPass from './pages/VerifySenPass';
import SenPassVault from './pages/SenPassVault';
import SenBot from './components/chatbot/SenBot';
import InstallPrompt from './components/shared/InstallPrompt';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role) && role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  // Seed demo data on first load
  useEffect(() => {
    const result = seedDemoData();
    if (result) {
      console.log(`[SENTRAK] Seeded ${result.athletes} athletes, ${result.assessments} assessments`);
    }
  }, []);

  // Sync offline queue when online
  useEffect(() => {
    const handleOnline = async () => {
      const queue = JSON.parse(localStorage.getItem('sentrak_fallback_syncQueue') || '[]');
      if (queue.length > 0 && toast) {
        toast.info('Syncing offline data to cloud...', { autoClose: 2000 });
      }
      
      const result = await syncOfflineQueue();
      if (result.synced > 0 && toast) {
        toast.success(`All synced ✓ (${result.synced} items)`);
      } else if (result.error && toast) {
        toast.error('Sync failed. Will retry later.');
      }

      // Also hydrate downstream
      await pullCloudDataToLocal();
    };

    window.addEventListener('online', handleOnline);
    if (navigator.onLine) handleOnline();
    return () => window.removeEventListener('online', handleOnline);
  }, [toast]);

  return (
    <div className="app">
      <OfflineIndicator />
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={
            <ErrorBoundary fallbackMessage="Could not load the landing page.">
              <Landing />
            </ErrorBoundary>
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />

          {/* Coach routes */}
          <Route path="/register" element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <ErrorBoundary fallbackMessage="Registration form encountered an error.">
                <Register />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/assess" element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <ErrorBoundary fallbackMessage="Assessment module encountered an error.">
                <RecordAssessment />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/assess/:athleteId" element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <ErrorBoundary fallbackMessage="Assessment module encountered an error.">
                <RecordAssessment />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Shared — Profile viewable by Athlete (self), Coach, Scout, Admin */}
          <Route path="/profile/:id" element={
            <ProtectedRoute allowedRoles={['athlete', 'coach', 'scout', 'admin']}>
              <ErrorBoundary fallbackMessage="Could not load athlete profile.">
                <AthleteProfile />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Scout routes */}
          <Route path="/scout" element={
            <ProtectedRoute allowedRoles={['scout', 'admin']}>
              <ErrorBoundary fallbackMessage="Scout dashboard encountered an error.">
                <ScoutView />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Open to specific authenticated roles */}
          <Route path="/challenges" element={
            <ProtectedRoute allowedRoles={['athlete', 'scout', 'admin']}>
              <ErrorBoundary fallbackMessage="Challenges page encountered an error.">
                <Challenges />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/vault" element={
            <ProtectedRoute allowedRoles={['coach', 'athlete', 'witness', 'admin']}>
              <ErrorBoundary fallbackMessage="Could not load the SenPass Vault.">
                <SenPassVault />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          <Route path="/verify/:certId" element={
            <VerifySenPass />
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SenBot />
      <BottomNav />
      <SpeedInsights />
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
