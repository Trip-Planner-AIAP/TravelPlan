import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import type { TripTemplate } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTripFromTemplate } = useTrips();

  const handleStartPlanning = () => {
    navigate('/dashboard');
  };

  const handleExploreTemplates = () => {
    navigate('/dashboard');
  };

  const handleSelectTemplate = async (template: TripTemplate) => {
    const result = await createTripFromTemplate(template);
    if (result.error) {
      console.error('Error creating trip:', result.error);
      // Fallback to dashboard
      navigate('/dashboard');
    } else if (result.data) {
      // Navigate to the newly created trip
      navigate(`/planner/${result.data.id}`);
    }
  };
  return (
    <div className="min-h-screen">
      <HeroSection 
        onStartPlanning={handleStartPlanning} 
        onExploreTemplates={handleExploreTemplates}
        onSelectTemplate={handleSelectTemplate}
      />
      
      {/* Sample Templates Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Trip Templates</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get inspired by these curated adventures and start planning your perfect getaway
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tokyo Template */}
            <div 
              onClick={handleStartPlanning}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 hover:scale-105 transition-all duration-300 cursor-pointer group border border-white border-opacity-20"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🏯</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    Tokyo Adventure
                  </h3>
                  <p className="text-gray-300">5 days • $1,200</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Experience the perfect blend of traditional and modern Japan with ancient temples, 
                world-class sushi, and dazzling city lights.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">🍣 Food Tours</span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">🏛️ Temples</span>
                </div>
                <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Popular
                </div>
              </div>
            </div>

            {/* Paris Template */}
            <div 
              onClick={handleStartPlanning}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 hover:scale-105 transition-all duration-300 cursor-pointer group border border-white border-opacity-20"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🗼</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    Paris Romance
                  </h3>
                  <p className="text-gray-300">4 days • $980</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                A romantic getaway through the City of Light featuring world-renowned art, 
                exquisite cuisine, and iconic landmarks.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">🎨 Museums</span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">🥐 Cafés</span>
                </div>
                <div className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Romantic
                </div>
              </div>
            </div>

            {/* Bali Template */}
            <div 
              onClick={handleStartPlanning}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 hover:scale-105 transition-all duration-300 cursor-pointer group border border-white border-opacity-20"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🏝️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    Bali Escape
                  </h3>
                  <p className="text-gray-300">7 days • $800</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Tropical paradise featuring pristine beaches, ancient temples, 
                and vibrant culture in Indonesia's most beloved destination.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">🏖️ Beaches</span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">⛩️ Temples</span>
                </div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Relaxing
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={handleStartPlanning}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>View All Templates</span>
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};