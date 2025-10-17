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
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
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
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;