import React from 'react';
import { Plane } from 'lucide-react';
import type { TripTemplate } from '../types';

interface HeroSectionProps {
  onStartPlanning: () => void;
  onExploreTemplates?: () => void;
  onSelectTemplate?: (template: TripTemplate) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning, onExploreTemplates }) => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TripPlanner</h1>
                <p className="text-xs text-gray-300">Your Adventure Starts Here</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={onExploreTemplates}
                className="text-white hover:text-orange-300 transition-colors font-medium"
              >
                Explore Templates
              </button>
              <button 
                onClick={onStartPlanning}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Start Planning
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Beautiful travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Plan Your
          <span className="text-orange-400"> Perfect Trip</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto">
          Discover amazing destinations, create unforgettable memories, and explore the world with confidence
        </p>

        {/* CTA Button */}
        <button
          onClick={onStartPlanning}
          className="bg-orange-600 text-white px-12 py-4 rounded-2xl text-xl font-semibold hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
        >
          Start Planning Your Adventure
        </button>
      </div>
    </div>
  );
};