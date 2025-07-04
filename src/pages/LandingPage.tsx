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
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 border border-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-600 bg-opacity-20 backdrop-blur-sm border border-orange-500 border-opacity-30 rounded-full px-6 py-2 mb-6">
              <span className="text-orange-400">✨</span>
              <span className="text-orange-300 font-medium">Curated Experiences</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Popular Trip Templates
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover handcrafted itineraries designed by travel experts. Each template includes carefully selected activities, 
              accommodations, and experiences to create your perfect adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
              className="relative bg-gradient-to-br from-white from-opacity-10 to-white to-opacity-5 backdrop-blur-lg rounded-3xl p-8 hover:from-opacity-15 hover:to-opacity-10 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-white border-opacity-20 shadow-2xl hover:shadow-orange-500/20"
            >
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-shadow">
                    <span className="text-4xl">🏯</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors mb-1">
                      Tokyo Adventure
                    </h3>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        <span className="text-sm">5 days</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm">$1,200</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  Experience the perfect blend of traditional and modern Japan with ancient temples, 
                  world-class sushi, and dazzling city lights.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">🍣 Food Tours</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">🏛️ Temples</span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
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
              className="relative bg-gradient-to-br from-white from-opacity-10 to-white to-opacity-5 backdrop-blur-lg rounded-3xl p-8 hover:from-opacity-15 hover:to-opacity-10 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-white border-opacity-20 shadow-2xl hover:shadow-blue-500/20"
            >
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-purple-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                    <span className="text-4xl">🗼</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors mb-1">
                      Paris Romance
                    </h3>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        <span className="text-sm">4 days</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm">$980</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  A romantic getaway through the City of Light featuring world-renowned art, 
                  exquisite cuisine, and iconic landmarks.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">🎨 Museums</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">🥐 Cafés</span>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Romantic
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
              className="relative bg-gradient-to-br from-white from-opacity-10 to-white to-opacity-5 backdrop-blur-lg rounded-3xl p-8 hover:from-opacity-15 hover:to-opacity-10 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-white border-opacity-20 shadow-2xl hover:shadow-green-500/20"
            >
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-teal-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/30 transition-shadow">
                    <span className="text-4xl">🏝️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors mb-1">
                      Bali Escape
                    </h3>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        <span className="text-sm">7 days</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm">$800</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  Tropical paradise featuring pristine beaches, ancient temples, 
                  and vibrant culture in Indonesia's most beloved destination.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">🏖️ Beaches</span>
                    <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">⛩️ Temples</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Relaxing
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-gray-900 rounded-xl px-8 py-6">
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Your Adventure?</h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  Choose from our curated templates or create your own custom itinerary
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleStartPlanning}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-orange-500/30"
                  >
                    <span>Create Custom Trip</span>
                    <span className="text-xl">🎯</span>
                  </button>
                  <button
                    onClick={handleStartPlanning}
                    className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
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