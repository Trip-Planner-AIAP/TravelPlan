import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Lightbulb, X, ChevronDown, ChevronUp, Brain, Zap } from 'lucide-react';
import { useItineraryAnalyzer } from '../hooks/useItineraryAnalyzer';
import type { Trip, Day, Activity } from '../types';

interface ItineraryAnalyzerProps {
  trip: Trip | null;
  days: Day[];
  activities: Activity[];
}

export const ItineraryAnalyzer: React.FC<ItineraryAnalyzerProps> = ({ trip, days, activities }) => {
  const { suggestions, isAnalyzing, dismissSuggestion, getSuggestionsByPriority } = useItineraryAnalyzer(trip, days, activities);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'high' | 'medium' | 'low'>('high');

  const suggestionsByPriority = getSuggestionsByPriority();
  const totalSuggestions = suggestions.length;

  if (!trip || totalSuggestions === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Perfect Itinerary! ✨</h3>
            <p className="text-green-700">Your travel plan looks logical and well-organized. No issues detected!</p>
          </div>
        </div>
      </div>
    );
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'suggestion': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTabColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <span>AI Travel Assistant</span>
                {isAnalyzing && <Zap className="w-5 h-5 text-purple-500 animate-pulse" />}
              </h3>
              <p className="text-gray-600">
                {isAnalyzing ? 'Analyzing your itinerary...' : `Found ${totalSuggestions} suggestion${totalSuggestions !== 1 ? 's' : ''} to improve your trip`}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>

        {/* Priority Tabs */}
        {isExpanded && totalSuggestions > 0 && (
          <div className="flex space-x-2 mt-4">
            {(['high', 'medium', 'low'] as const).map((priority) => {
              const count = suggestionsByPriority[priority].length;
              if (count === 0) return null;
              
              return (
                <button
                  key={priority}
                  onClick={() => setActiveTab(priority)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    activeTab === priority 
                      ? getTabColor(priority)
                      : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your travel plan for logical issues...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestionsByPriority[activeTab].map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`rounded-xl border p-5 ${getColorForType(suggestion.type)} transition-all hover:shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getIconForType(suggestion.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                        <p className="text-gray-700 mb-3 leading-relaxed">{suggestion.description}</p>
                        
                        {suggestion.suggestedFix && (
                          <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-white border-opacity-50">
                            <p className="text-sm font-medium text-gray-800 mb-1">💡 Suggested Fix:</p>
                            <p className="text-sm text-gray-700">{suggestion.suggestedFix}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                      title="Dismiss suggestion"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {suggestionsByPriority[activeTab].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p className="font-medium">No {activeTab} priority issues found!</p>
                  <p className="text-sm">This section of your itinerary looks good.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};