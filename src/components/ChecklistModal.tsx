import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Circle, AlertTriangle, Sparkles, Clock, Target, Check, BookmarkPlus } from 'lucide-react';
import { useAIFeatures } from '../hooks/useAIFeatures';
import type { Trip } from '../types';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

interface ChecklistItem {
  id: string;
  trip_id: string;
  category: 'documents' | 'clothing' | 'electronics' | 'health' | 'misc';
  item_name: string;
  is_completed: boolean;
  priority: 1 | 2 | 3;
  created_at: string;
}

const categoryIcons = {
  documents: '📄',
  clothing: '👕',
  electronics: '🔌',
  health: '🏥',
  misc: '📦'
};

const categoryNames = {
  documents: 'Documents',
  clothing: 'Clothing',
  electronics: 'Electronics',
  health: 'Health & Safety',
  misc: 'Miscellaneous'
};

const priorityColors = {
  1: 'text-red-600 bg-red-50 border-red-200',
  2: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  3: 'text-green-600 bg-green-50 border-green-200'
};

const priorityLabels = {
  1: 'High',
  2: 'Medium',
  3: 'Low'
};

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, trip }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{ remaining: number; canMakeCall: boolean }>({ remaining: 6000, canMakeCall: true });
  
  const { 
    loading, 
    error, 
    generateChecklist, 
    updateChecklistItem, 
    getChecklist,
    checkTokenUsage 
  } = useAIFeatures(trip.id);

  useEffect(() => {
    if (isOpen) {
      loadChecklist();
      loadTokenInfo();
    }
  }, [isOpen]);

  const loadChecklist = async () => {
    const items = await getChecklist();
    setChecklist(items);
    setHasGenerated(items.length > 0);
  };

  const loadTokenInfo = async () => {
    const info = await checkTokenUsage();
    setTokenInfo(info);
  };

  const handleGenerateChecklist = async () => {
    setIsGenerating(true);
    
    // Determine season based on start date
    const startDate = new Date(trip.start_date);
    const month = startDate.getMonth();
    let season = 'spring';
    if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'fall';
    else if (month >= 11 || month <= 2) season = 'winter';

    const result = await generateChecklist(
      trip.destination,
      trip.duration_days,
      season,
      ['sightseeing', 'dining', 'shopping'] // Default activities
    );

    if (result.success && result.data) {
      setChecklist(result.data);
      setHasGenerated(true);
      await loadTokenInfo(); // Refresh token info
    }
    
    setIsGenerating(false);
  };

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    const result = await updateChecklistItem(itemId, !currentStatus);
    if (result.success) {
      setChecklist(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, is_completed: !currentStatus }
            : item
        )
      );
    }
  };

  const handleConfirmChecklist = () => {
    setIsConfirmed(true);
    // You could add additional logic here like saving confirmation to database
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSaveForLater = () => {
    // Checklist is already saved in the database, just close the modal
    onClose();
  };

  const getCompletionStats = () => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.is_completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const groupedChecklist = checklist.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, ChecklistItem[]>);

  const stats = getCompletionStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Smart Travel Checklist</h3>
              <p className="text-sm text-gray-600">{trip.destination} • {trip.duration_days} days</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Token Usage Warning */}
        {!tokenInfo.canMakeCall && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                Token limit reached ({tokenInfo.remaining} remaining). Checklist generation unavailable.
              </p>
            </div>
          </div>
        )}

        <div className="p-6">
          {!hasGenerated ? (
            /* Generate Checklist View */
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-orange-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Generate Your Perfect Checklist</h4>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get a personalized packing checklist tailored to your destination, duration, and travel style.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="text-sm font-medium text-gray-700">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">👕</div>
                  <div className="text-sm font-medium text-gray-700">Clothing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔌</div>
                  <div className="text-sm font-medium text-gray-700">Electronics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="text-sm font-medium text-gray-700">Health</div>
                </div>
              </div>

              <button
                onClick={handleGenerateChecklist}
                disabled={isGenerating || !tokenInfo.canMakeCall}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Smart Checklist...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Smart Checklist</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 text-xs text-gray-500">
                <p>Tokens remaining: {tokenInfo.remaining} / 6000</p>
              </div>
            </div>
          ) : (
            /* Checklist View */
            <div className="h-full flex flex-col">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Perfect! Your personalized checklist is ready 🎯
                  </h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{stats.percentage}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  You've packed {stats.completed} of {stats.total} items!
                  {stats.percentage === 100 && " 🎉 You're all set for your adventure!"}
                </p>
              </div>

              {/* Checklist Items */}
              <div className="flex-1 overflow-y-auto min-h-0 pr-2">
                <div className="space-y-6">
                {Object.entries(groupedChecklist).map(([category, items]) => (
                  <div key={category} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                        <h5 className="font-semibold text-gray-900">
                          {categoryNames[category as keyof typeof categoryNames]}
                        </h5>
                        <span className="text-sm text-gray-500">
                          ({items.filter(item => item.is_completed).length}/{items.length})
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {items
                        .sort((a, b) => a.priority - b.priority)
                        .map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                            item.is_completed 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleItem(item.id, item.is_completed)}
                            className="flex-shrink-0"
                          >
                            {item.is_completed ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400 hover:text-orange-500 transition-colors" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <span className={`font-medium ${
                              item.is_completed 
                                ? 'text-green-700 line-through' 
                                : 'text-gray-900'
                            }`}>
                              {item.item_name}
                            </span>
                          </div>
                          
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            priorityColors[item.priority]
                          }`}>
                            {priorityLabels[item.priority]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                </div>
              </div>

              {/* Action Buttons - only show when checklist is generated and not confirmed */}
              {!isConfirmed && (
                <div className="flex-shrink-0 mt-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Your checklist is ready! 🎉
                    </h4>
                    <p className="text-gray-600">
                      What would you like to do next?
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleConfirmChecklist}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/30"
                    >
                      <Check className="w-5 h-5" />
                      <span>Perfect! I'm Ready to Pack</span>
                    </button>
                    
                    <button
                      onClick={handleSaveForLater}
                      className="flex-1 sm:flex-none bg-white border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-sm"
                    >
                      <BookmarkPlus className="w-5 h-5" />
                      <span>Save for Later</span>
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Your checklist is automatically saved and you can access it anytime
                    </p>
                  </div>
                </div>
              )}

              {/* Confirmation Message */}
              {isConfirmed && (
                <div className="flex-shrink-0 mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">
                    Checklist Confirmed! ✅
                  </h4>
                  <p className="text-green-700">
                    You're all set for your {trip.destination} adventure. Have an amazing trip!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};