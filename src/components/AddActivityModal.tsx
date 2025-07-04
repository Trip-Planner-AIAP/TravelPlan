import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { activitySuggestions, type ActivitySuggestion } from '../data/activitySuggestions';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateActivity: (title: string, type: string, estimatedCost: number, durationMinutes: number, description: string) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ 
  isOpen, 
  onClose, 
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

  const filteredSuggestions = activitySuggestions[selectedCategory]?.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Activity</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedCategory === category.id
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Search and Custom Toggle */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                customMode
                  ? 'bg-orange-600 text-white'
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
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{suggestion.icon}</span>
                            <h4 className="font-medium text-gray-900 group-hover:text-orange-700">
                              {suggestion.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>💰 ${suggestion.estimatedCost}</span>
                            <span>⏱️ {suggestion.durationMinutes}min</span>
                          </div>
                        </div>
                        <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-5 h-5" />
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