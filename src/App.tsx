import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import LandingPage from './components/LandingPage';
import QuickTranslator from './components/QuickTranslator';
import PersonalityQuiz from './components/PersonalityQuiz';
import WIMTSPage from './components/WIMTSPage';
import TranslatorPage from './components/TranslatorPage';
import ProfilePage from './components/ProfilePage';
import RelationshipWeb from './components/RelationshipWeb';
import AuthCallback from './features/auth/components/AuthCallback';
import { AuthGateProvider } from './features/auth/context/AuthGateContext';
import RegistrationGate from './features/auth/components/RegistrationGate';
import ProfileIcon from './components/ProfileIcon';

// Admin Panel
import { ProtectedRoute } from './features/admin/components/ProtectedRoute';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import ConfigEditor from './features/admin/pages/ConfigEditor';
import QuizManager from './features/admin/pages/QuizManager';

function App() {
  return (
    <Router>
      <AuthGateProvider>
        <div className="App">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/translator" element={<QuickTranslator />} />
              <Route path="/quiz" element={<PersonalityQuiz />} />
              <Route path="/wimts" element={<WIMTSPage />} />
              <Route path="/translate" element={<TranslatorPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/relationships" element={<RelationshipWeb />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Admin Panel Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/config"
                element={
                  <ProtectedRoute>
                    <ConfigEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quiz"
                element={
                  <ProtectedRoute>
                    <QuizManager />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
          <ProfileIcon />
          <RegistrationGate />
        </div>
      </AuthGateProvider>
    </Router>
  );
}

export default App;