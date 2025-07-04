import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onStartPlanning: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning }) => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
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
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Discover amazing destinations, create unforgettable memories, and explore the world with confidence
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto mb-8">
          <div className="flex items-center space-x-4">
            <MapPin className="text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="flex-1 text-gray-900 text-lg placeholder-gray-500 focus:outline-none"
            />
            <button className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

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