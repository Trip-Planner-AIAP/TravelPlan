import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    navigate('/dashboard');
  };

  const handleExploreTemplates = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      <HeroSection 
        onStartPlanning={handleStartPlanning} 
        onExploreTemplates={handleExploreTemplates}
      />
      <Footer />
    </div>
  );
};