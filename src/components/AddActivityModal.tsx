import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { activitySuggestions, getRegionSpecificSuggestions, type ActivitySuggestion } from '../data/activitySuggestions';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
  onCreateActivity: (title: string, type: string, estimatedCost: number, durationMinutes: number, description: string) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ 
  isOpen, 
  onClose, 
  destination = '',
  onCreateActivity 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('attraction');
  const [searchTerm, setSearchTerm] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customActivity, setCustomActivity] = useState({
    title: '',
    description: '',
    estimatedCost: 0,
    durationMinutes: 60
  });

  const categories = [
    { id: 'attraction', name: 'Attractions', icon: '🏛️' },
    { id: 'meal', name: 'Food & Dining', icon: '🍽️' },
    { id: 'hotel', name: 'Accommodation', icon: '🏨' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'flight', name: 'Flights', icon: '✈️' }
  ];

  // Get region-specific suggestions based on destination
  const regionSuggestions = getRegionSpecificSuggestions(selectedCategory, destination);
  
  const filteredSuggestions = regionSuggestions.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuggestionClick = (suggestion: ActivitySuggestion) => {
    onCreateActivity(
      suggestion.title,
      suggestion.type,
      suggestion.estimatedCost,
      suggestion.durationMinutes,
      suggestion.description
    );
    handleClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActivity.title.trim()) return;
    
    onCreateActivity(
      customActivity.title,
      selectedCategory,
      customActivity.estimatedCost,
      customActivity.durationMinutes,
      customActivity.description
    );
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setCustomMode(false);
    setCustomActivity({ title: '', description: '', estimatedCost: 0, durationMinutes: 60 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Add New Activity</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-full p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all hover:scale-105 ${
                selectedCategory === category.id
                  ? 'border-orange-500 text-orange-600 bg-white shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Search and Custom Toggle */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-sm ${
                customMode
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {customMode ? 'Browse Suggestions' : 'Create Custom'}
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {customMode ? (
              /* Custom Activity Form */
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    value={customActivity.title}
                    onChange={(e) => setCustomActivity(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Visit Tokyo Tower"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={customActivity.description}
                    onChange={(e) => setCustomActivity(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={2}
                    placeholder="Brief description of the activity"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={customActivity.estimatedCost}
                      onChange={(e) => setCustomActivity(prev => ({ ...prev, estimatedCost: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={customActivity.durationMinutes}
                      onChange={(e) => setCustomActivity(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 60 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add Activity
                  </button>
                </div>
              </form>
            ) : (
              /* Activity Suggestions */
              <div className="space-y-3">
                {filteredSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No activities found. Try a different search term or create a custom activity.</p>
                  </div>
                ) : (
                  filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-5 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all group hover:shadow-md hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-sm">{suggestion.icon}</span>
                            </div>
                            <h4 className="font-medium text-gray-900 group-hover:text-orange-700">
                              {suggestion.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              <span>💰</span>
                              <span>${suggestion.estimatedCost}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              <span>⏱️</span>
                              <span>{suggestion.durationMinutes}min</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-lg">+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};