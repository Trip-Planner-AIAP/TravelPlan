import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { AuthModal } from '../components/AuthModal';
import { Footer } from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, isGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if ((user || isGuest) && !loading) {
      navigate('/dashboard');
    }
  }, [user, isGuest, loading, navigate]);

  const handleStartPlanning = () => {
    if (user || isGuest) {
      navigate('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection onStartPlanning={handleStartPlanning} />
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};