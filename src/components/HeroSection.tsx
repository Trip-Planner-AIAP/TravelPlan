import React from 'react';
import { Search, MapPin, TrendingUp, Plane } from 'lucide-react';
import { useState } from 'react';

// Popular destinations with additional metadata
const popularDestinations = [
  { name: 'Tokyo, Japan', category: 'Asia', trending: true, icon: '🏯' },
  { name: 'Paris, France', category: 'Europe', trending: true, icon: '🗼' },
  { name: 'London, England', category: 'Europe', trending: false, icon: '🏰' },
  { name: 'New York, USA', category: 'North America', trending: true, icon: '🗽' },
  { name: 'Bali, Indonesia', category: 'Asia', trending: true, icon: '🏝️' },
  { name: 'Rome, Italy', category: 'Europe', trending: false, icon: '🏛️' },
  { name: 'Barcelona, Spain', category: 'Europe', trending: false, icon: '🏖️' },
  { name: 'Bangkok, Thailand', category: 'Asia', trending: true, icon: '🛕' },
  { name: 'Sydney, Australia', category: 'Oceania', trending: false, icon: '🏄‍♂️' },
  { name: 'Dubai, UAE', category: 'Middle East', trending: true, icon: '🏗️' },
  { name: 'Amsterdam, Netherlands', category: 'Europe', trending: false, icon: '🚲' },
  { name: 'Berlin, Germany', category: 'Europe', trending: false, icon: '🍺' },
  { name: 'Istanbul, Turkey', category: 'Europe/Asia', trending: false, icon: '🕌' },
  { name: 'Prague, Czech Republic', category: 'Europe', trending: false, icon: '🏰' },
  { name: 'Vienna, Austria', category: 'Europe', trending: false, icon: '🎼' },
  { name: 'Lisbon, Portugal', category: 'Europe', trending: false, icon: '🚋' },
  { name: 'Copenhagen, Denmark', category: 'Europe', trending: false, icon: '🧜‍♀️' },
  { name: 'Stockholm, Sweden', category: 'Europe', trending: false, icon: '🏔️' },
  { name: 'Reykjavik, Iceland', category: 'Europe', trending: true, icon: '🌋' },
  { name: 'Santorini, Greece', category: 'Europe', trending: true, icon: '🏺' }
];

interface HeroSectionProps {
  onStartPlanning: () => void;
  onExploreTemplates?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning, onExploreTemplates }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Filter destinations based on search input
  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Show trending destinations when no search input
  const displayDestinations = searchValue.trim() === '' 
    ? popularDestinations.filter(dest => dest.trending).slice(0, 6)
    : filteredDestinations.slice(0, 8);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleDestinationSelect = (destination: string) => {
    setSearchValue(destination);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || displayDestinations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < displayDestinations.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : displayDestinations.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleDestinationSelect(displayDestinations[focusedIndex].name);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

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
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Discover amazing destinations, create unforgettable memories, and explore the world with confidence
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto mb-8 relative">
          <div className="flex items-center space-x-4 relative">
            <MapPin className="text-gray-400 w-6 h-6 flex-shrink-0" />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="w-full text-gray-900 text-lg placeholder-gray-500 focus:outline-none bg-transparent"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchValue.trim() === '' && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span>Trending Destinations</span>
                      </div>
                    </div>
                  )}
                  
                  {displayDestinations.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <div className="mb-2">🌍</div>
                      <p className="text-sm">No destinations found</p>
                      <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    displayDestinations.map((destination, index) => (
                      <button
                        key={destination.name}
                        onClick={() => handleDestinationSelect(destination.name)}
                        className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                          index === focusedIndex ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{destination.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{destination.name}</div>
                              <div className="text-xs text-gray-500">{destination.category}</div>
                            </div>
                          </div>
                          {destination.trending && (
                            <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                              <TrendingUp className="w-3 h-3" />
                              <span>Trending</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                  
                  {searchValue.trim() !== '' && filteredDestinations.length > 8 && (
                    <div className="px-4 py-3 text-center border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        +{filteredDestinations.length - 8} more destinations
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button 
              onClick={onStartPlanning}
              className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition-colors flex-shrink-0"
            >
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

      {/* Sample Templates Section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Popular Trip Templates</h2>
            <p className="text-gray-300">Get inspired by these curated adventures</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tokyo Template */}
            <div 
              onClick={onStartPlanning}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all cursor-pointer group border border-white border-opacity-20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                    Tokyo Adventure
                  </h3>
                  <p className="text-sm text-gray-300">5 days • $1,200</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Experience the perfect blend of traditional and modern Japan with temples, sushi, and city lights.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>🍣 Food Tours</span>
                  <span>🏛️ Temples</span>
                </div>
                <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Popular
                </div>
              </div>
            </div>

            {/* Paris Template */}
            <div 
              onClick={onStartPlanning}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all cursor-pointer group border border-white border-opacity-20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🗼</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                    Paris Romance
                  </h3>
                  <p className="text-sm text-gray-300">4 days • $980</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                A romantic getaway through the City of Light with art, cuisine, and iconic landmarks.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>🎨 Museums</span>
                  <span>🥐 Cafés</span>
                </div>
                <div className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Romantic
                </div>
              </div>
            </div>
            {/* Bali Template */}
            <div 
              onClick={onStartPlanning}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all cursor-pointer group border border-white border-opacity-20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏝️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                    Bali Escape
                  </h3>
                  <p className="text-sm text-gray-300">7 days • $800</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Tropical paradise with pristine beaches, ancient temples, and vibrant culture.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>🏖️ Beaches</span>
                  <span>⛩️ Temples</span>
                </div>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Relaxing
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={onStartPlanning}
              className="text-orange-300 hover:text-orange-200 font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>View All Templates</span>
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};