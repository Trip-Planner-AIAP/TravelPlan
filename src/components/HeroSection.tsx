import React from 'react';
import { Search, MapPin, TrendingUp, Plane } from 'lucide-react';
import { useState } from 'react';
import { tripTemplates } from '../data/tripTemplates';
import type { TripTemplate } from '../types';

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
  onSelectTemplate?: (template: TripTemplate) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning, onExploreTemplates, onSelectTemplate }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Filter templates based on search input
  const getDestinationSpecificTemplates = (searchTerm: string) => {
    if (!searchTerm.trim()) return [];
    
    return tripTemplates.filter(template =>
      template.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter popular destinations based on search input
  const getFilteredDestinations = (searchTerm: string) => {
    return popularDestinations.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const destinationTemplates = getDestinationSpecificTemplates(searchValue);
  const filteredDestinations = getFilteredDestinations(searchValue);

  // Show trending destinations when no search input, otherwise show filtered results
  const displayDestinations = searchValue.trim() === '' 
    ? popularDestinations.filter(dest => dest.trending).slice(0, 6)
    : filteredDestinations.slice(0, 6);

  const hasSearchResults = searchValue.trim() !== '' && (destinationTemplates.length > 0 || filteredDestinations.length > 0);

  const handleTemplateSelect = (template: TripTemplate) => {
    setSearchValue(template.destination);
    setShowSuggestions(false);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

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
    // Navigate to dashboard with the selected destination
    if (onStartPlanning) {
      onStartPlanning();
    }
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
                  
                  {/* Destination-Specific Templates */}
                  {destinationTemplates.length > 0 && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <span className="text-orange-500">✨</span>
                          <span>Ready-made plans for "{searchValue}"</span>
                        </div>
                      </div>
                      {destinationTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full px-4 py-4 text-left hover:bg-orange-50 transition-colors border-b border-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={template.image_url} 
                                  alt={template.destination}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{template.title}</div>
                                <div className="text-sm text-gray-600">{template.destination}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {template.duration_days} days • ${template.estimated_budget}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                              <span>✨</span>
                              <span>Template</span>
                            </div>
                          </div>
                        </button>
                      ))}
                      
                      {/* Separator if we have both templates and destinations */}
                      {displayDestinations.length > 0 && (
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="text-xs font-medium text-gray-500">Other destinations</div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Trending/Popular Destinations Header */}
                  {searchValue.trim() === '' && destinationTemplates.length === 0 && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span>Trending Destinations</span>
                      </div>
                    </div>
                  )}
                  
                  {!hasSearchResults && searchValue.trim() !== '' ? (
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
                  
                  {searchValue.trim() !== '' && filteredDestinations.length > 6 && (
                    <div className="px-4 py-3 text-center border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        +{filteredDestinations.length - 6} more destinations
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

    </div>
  );
};