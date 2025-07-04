import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { PlannerBoard } from './pages/PlannerBoard';
import { CustomTripBuilder } from './pages/CustomTripBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner/:tripId" element={<PlannerBoard />} />
        <Route path="/custom-trip-builder" element={<CustomTripBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;