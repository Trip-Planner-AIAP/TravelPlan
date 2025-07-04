import React from 'react';
import { Header } from '../components/Header';
import { TripGrid } from '../components/TripGrid';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Dashboard: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isGuest ? 'Welcome, Guest!' : 'Welcome back!'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isGuest 
                ? 'Explore our trip planning features in demo mode'
                : 'Ready to plan your next adventure?'
              }
            </p>
          </div>
          <TripGrid />
        </div>
      </main>
    </div>
  );
};