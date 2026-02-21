import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import OfflineIndicator from './components/layout/OfflineIndicator';
import Landing from './pages/Landing';
import Register from './pages/Register';
import RecordAssessment from './pages/RecordAssessment';
import AthleteProfile from './pages/AthleteProfile';
import ScoutView from './pages/ScoutView';
import Challenges from './pages/Challenges';
import DemoMode from './pages/DemoMode';

export default function App() {
  return (
    <div className="app">
      <OfflineIndicator />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/assess" element={<RecordAssessment />} />
          <Route path="/assess/:athleteId" element={<RecordAssessment />} />
          <Route path="/profile/:id" element={<AthleteProfile />} />
          <Route path="/scout" element={<ScoutView />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/demo" element={<DemoMode />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
