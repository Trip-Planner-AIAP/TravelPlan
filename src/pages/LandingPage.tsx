import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';
import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import type { TripTemplate } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTripFromTemplate } = useTrips();

  const handleStartPlanning = () => {
    // Check if we have a search value from the hero section
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
      <section className="bg-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-32 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-60 right-1/3 w-36 h-36 bg-gradient-to-br from-pink-400 to-red-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 backdrop-blur-md border border-orange-200 rounded-full px-8 py-3 mb-8 shadow-lg">
              <span className="text-2xl">✨</span>
              <span className="text-orange-700 font-semibold text-lg">Curated Experiences</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
              Popular Trip Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover handcrafted itineraries designed by travel experts. Each template includes carefully selected activities, 
              accommodations, and experiences to create your perfect adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {/* Tokyo Template */}
            <div 
              onClick={() => handleSelectTemplate({
                id: 'tokyo_adventure',
                title: 'Tokyo Adventure',
                destination: 'Tokyo, Japan',
                duration_days: 5,
                estimated_budget: 1200,
                image_url: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
                description: 'Experience the perfect blend of traditional and modern Japan',
                days: []
              })}
              className="relative overflow-hidden rounded-3xl cursor-pointer group shadow-2xl hover:shadow-orange-500/40 transition-all duration-700 hover:scale-105 hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Tokyo Adventure"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-800/70 to-orange-600/60 group-hover:from-purple-900/70 group-hover:via-pink-800/60 group-hover:to-orange-600/50 transition-all duration-700"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[400px]">
                {/* Top Content */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-orange-200 transition-colors">
                    Tokyo Adventure
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6 group-hover:text-white transition-colors">
                    Experience the perfect blend of traditional and modern Japan with ancient temples, 
                    world-class sushi, and dazzling city lights.
                  </p>
                </div>
                
                {/* Bottom Content */}
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      5 days
                    </span>
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      $1,200
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">🍣 Food Tours</span>
                      <span className="bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">🏛️ Temples</span>
                    </div>
                    
                    <div className="bg-white text-purple-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      See activities
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Paris Template */}
            <div 
              onClick={() => handleSelectTemplate({
                id: 'paris_romance',
                title: 'Paris Romance',
                destination: 'Paris, France',
                duration_days: 4,
                estimated_budget: 980,
                image_url: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
                description: 'A romantic getaway through the City of Light',
                days: []
              })}
              className="relative overflow-hidden rounded-3xl cursor-pointer group shadow-2xl hover:shadow-blue-500/40 transition-all duration-700 hover:scale-105 hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Paris Romance"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-800/70 to-pink-600/60 group-hover:from-blue-900/70 group-hover:via-purple-800/60 group-hover:to-pink-600/50 transition-all duration-700"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[400px]">
                {/* Top Content */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-pink-200 transition-colors">
                    Paris Romance
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6 group-hover:text-white transition-colors">
                    A romantic getaway through the City of Light featuring world-renowned art, 
                    exquisite cuisine, and iconic landmarks.
                  </p>
                </div>
                
                {/* Bottom Content */}
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      4 days
                    </span>
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      $980
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">🎨 Museums</span>
                      <span className="bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">🥐 Cafés</span>
                    </div>
                    
                    <div className="bg-white text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      See activities
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bali Template */}
            <div 
              onClick={() => handleSelectTemplate({
                id: 'bali_escape',
                title: 'Bali Escape',
                destination: 'Bali, Indonesia',
                duration_days: 7,
                estimated_budget: 800,
                image_url: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
                description: 'Tropical paradise with beaches, temples, and culture',
                days: []
              })}
              className="relative overflow-hidden rounded-3xl cursor-pointer group shadow-2xl hover:shadow-green-500/40 transition-all duration-700 hover:scale-105 hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Bali Escape"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-teal-800/70 to-blue-600/60 group-hover:from-green-900/70 group-hover:via-teal-800/60 group-hover:to-blue-600/50 transition-all duration-700"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[400px]">
                {/* Top Content */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-teal-200 transition-colors">
                    Bali Escape
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6 group-hover:text-white transition-colors">
                    Tropical paradise featuring pristine beaches, ancient temples, 
                    and vibrant culture in Indonesia's most beloved destination.
                  </p>
                </div>
                
                {/* Bottom Content */}
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      7 days
                    </span>
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                      $800
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">🏖️ Beaches</span>
                      <span className="bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">⛩️ Temples</span>
                    </div>
                    
                    <div className="bg-white text-green-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      See activities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-1 rounded-3xl shadow-2xl backdrop-blur-xl">
              <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl px-12 py-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Adventure?</h3>
                <p className="text-gray-700 mb-8 max-w-lg mx-auto text-lg">
                  Choose from our curated templates or create your own custom itinerary
                </p>
                
                {/* Planning Flow Icons */}
                <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 mb-2">
                      <span className="text-2xl md:text-3xl">🗺️</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Plan</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full mx-1"></div>
                    <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 mb-2">
                      <span className="text-2xl md:text-3xl">✈️</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Book</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full mx-1"></div>
                    <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 mb-2">
                      <span className="text-2xl md:text-3xl">🎯</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Pack</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full mx-1"></div>
                    <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white border-opacity-30 mb-2">
                      <span className="text-2xl md:text-3xl">🌟</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Enjoy</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <button
                    onClick={handleStartPlanning}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-3 shadow-xl hover:shadow-orange-500/40"
                  >
                    <span>Create Custom Trip</span>
                    <span className="text-xl">🎯</span>
                  </button>
                  <button
                    onClick={handleStartPlanning}
                    className="bg-gray-100 bg-opacity-80 backdrop-blur-md border border-gray-300 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-3 shadow-lg"
                  >
                    <span>Browse All Templates</span>
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TripPlanner?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan the perfect trip, all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Planning</h3>
              <p className="text-gray-600">
                AI-powered suggestions and expert-curated templates to create your perfect itinerary
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Budget Tracking</h3>
              <p className="text-gray-600">
                Keep track of your expenses and stay within budget with real-time cost calculations
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600">
                Discover amazing destinations worldwide with local insights and recommendations
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Travel Inspiration
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest travel tips, destination guides, and exclusive templates
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30"
            />
            <button
              className="w-full sm:w-auto bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
          
          <p className="text-orange-200 text-sm mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};