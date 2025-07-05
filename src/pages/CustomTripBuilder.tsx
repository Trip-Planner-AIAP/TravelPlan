import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Calendar, MapPin, DollarSign, Clock, ArrowRight, ArrowDown, X, ChevronRight } from 'lucide-react';
import { activitySuggestions, type ActivitySuggestion } from '../data/activitySuggestions';
import { useTrips } from '../hooks/useTrips';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Activity } from '../types';

interface CustomActivity extends Omit<Activity, 'id' | 'day_id' | 'created_at'> {
  tempId: string;
}

interface ActivityCardProps {
  activity: CustomActivity;
  onRemove: (tempId: string) => void;
  onMoveToDay?: (tempId: string, dayNumber: number) => void;
  onMoveToSelection?: (tempId: string) => void;
  showMoveButtons?: boolean;
  tripDuration?: number;
  currentDay?: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onRemove, 
  onMoveToDay, 
  onMoveToSelection,
  showMoveButtons = false,
  tripDuration = 5,
  currentDay
}) => {
  const [showDaySelector, setShowDaySelector] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'meal': return '🍽️';
      case 'transport': return '🚗';
      default: return '📍';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getActivityIcon(activity.activity_type)}</span>
            <h4 className="font-medium text-gray-900">{activity.title}</h4>
          </div>
          {activity.description && (
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{activity.duration_minutes}min</span>
            <span className="font-medium text-orange-600">${activity.estimated_cost}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1 ml-2">
          <button
            onClick={() => onRemove(activity.tempId)}
            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
            title="Remove activity"
          >
            <X className="w-4 h-4" />
          </button>
          
          {showMoveButtons && (
            <div className="relative">
              {onMoveToDay && (
                <button
                  onClick={() => setShowDaySelector(!showDaySelector)}
                  className="opacity-0 group-hover:opacity-100 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium hover:bg-orange-200 transition-all flex items-center space-x-1"
                  title="Move to day"
                >
                  <span>Move to Day</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
              
              {onMoveToSelection && (
                <button
                  onClick={() => onMoveToSelection(activity.tempId)}
                  className="opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-all flex items-center space-x-1"
                  title="Move back to selection"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
              )}
              
              {showDaySelector && onMoveToDay && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-32">
                  <div className="text-xs font-medium text-gray-700 mb-2">Select Day:</div>
                  <div className="grid grid-cols-2 gap-1">
                    {Array.from({ length: tripDuration }, (_, i) => i + 1).map((dayNum) => (
                      <button
                        key={dayNum}
                        onClick={() => {
                          onMoveToDay(activity.tempId, dayNum);
                          setShowDaySelector(false);
                        }}
                        disabled={currentDay === dayNum}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          currentDay === dayNum
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        Day {dayNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DayColumnProps {
  dayNumber: number;
  activities: CustomActivity[];
  onMoveToSelection: (tempId: string) => void;
  onMoveToDay: (tempId: string, dayNumber: number) => void;
  onRemoveActivity: (tempId: string) => void;
  tripDuration: number;
}

const DayColumn: React.FC<DayColumnProps> = ({ 
  dayNumber, 
  activities, 
  onMoveToSelection, 
  onMoveToDay, 
  onRemoveActivity,
  tripDuration 
}) => {
  const totalCost = activities.reduce((sum, activity) => sum + activity.estimated_cost, 0);
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration_minutes, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 min-h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center justify-center mr-2">
            {dayNumber}
          </span>
          Day {dayNumber}
        </h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {activities.length}
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="mb-2">📅</div>
            <p className="text-sm font-medium">No activities planned</p>
            <p className="text-xs text-gray-400 mt-1">Add activities from the center</p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.tempId}
              activity={activity}
              onRemove={onRemoveActivity}
              onMoveToSelection={onMoveToSelection}
              onMoveToDay={onMoveToDay}
              showMoveButtons={true}
              tripDuration={tripDuration}
              currentDay={dayNumber}
            />
          ))
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>${totalCost}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CustomTripBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get trip details from navigation state
  const tripDetails = location.state as { 
    title: string; 
    destination: string; 
    durationDays?: number;
    numberOfTravelers?: number; 
    budgetPerPerson?: number; 
  } | null;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('attraction');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<CustomActivity[]>([]);
  const [dayActivities, setDayActivities] = useState<{ [key: number]: CustomActivity[] }>({
    1: [], 2: [], 3: [], 4: [], 5: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [tripDuration, setTripDuration] = useState(tripDetails?.durationDays || 3);
  const [numberOfTravelers, setNumberOfTravelers] = useState(tripDetails?.numberOfTravelers || 1);
  const [budgetPerPerson, setBudgetPerPerson] = useState(tripDetails?.budgetPerPerson || 500);

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

  const addActivityToSelection = (suggestion: ActivitySuggestion) => {
    const newActivity: CustomActivity = {
      tempId: crypto.randomUUID(),
      title: suggestion.title,
      description: suggestion.description,
      activity_type: suggestion.type,
      estimated_cost: suggestion.estimatedCost,
      duration_minutes: suggestion.durationMinutes,
      order_index: selectedActivities.length
    };
    setSelectedActivities(prev => [...prev, newActivity]);
  };

  const removeActivityFromSelection = (tempId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.tempId !== tempId));
  };

  const moveActivityToDay = (tempId: string, dayNumber: number) => {
    // Find the activity
    const activity = selectedActivities.find(a => a.tempId === tempId) ||
                    Object.values(dayActivities).flat().find(a => a.tempId === tempId);
    
    if (!activity) return;

    // Remove from current location
    setSelectedActivities(prev => prev.filter(a => a.tempId !== tempId));
    setDayActivities(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[parseInt(day)] = updated[parseInt(day)].filter(a => a.tempId !== tempId);
      });
      return updated;
    });

    // Add to target day
    setDayActivities(prev => ({
      ...prev,
      [dayNumber]: [...(prev[dayNumber] || []), activity]
    }));
  };

  const moveActivityToSelection = (tempId: string) => {
    // Find the activity in day activities
    const activity = Object.values(dayActivities).flat().find(a => a.tempId === tempId);
    
    if (!activity) return;

    // Remove from day activities
    setDayActivities(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[parseInt(day)] = updated[parseInt(day)].filter(a => a.tempId !== tempId);
      });
      return updated;
    });

    // Add to selected activities
    setSelectedActivities(prev => [...prev, activity]);
  };

  const removeActivityCompletely = (tempId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.tempId !== tempId));
    setDayActivities(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[parseInt(day)] = updated[parseInt(day)].filter(a => a.tempId !== tempId);
      });
      return updated;
    });
  };

  const calculateTotalBudget = () => {
    const allActivities = [
      ...selectedActivities,
      ...Object.values(dayActivities).flat()
    ];
    return allActivities.reduce((sum, activity) => sum + activity.estimated_cost, 0);
  };

  const saveTripAndNavigate = async () => {
    if (!user || !tripDetails) return;

    setIsSaving(true);
    try {
      // Calculate dates
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + tripDuration - 1);

      // Create trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title: tripDetails.title,
          destination: tripDetails.destination,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          duration_days: tripDuration,
          estimated_budget: budgetPerPerson * numberOfTravelers,
          number_of_travelers: numberOfTravelers,
          budget_per_person: budgetPerPerson,
          image_url: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800'
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // Create days and activities
      for (let dayNum = 1; dayNum <= tripDuration; dayNum++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + dayNum - 1);

        const { data: dayData, error: dayError } = await supabase
          .from('days')
          .insert({
            trip_id: tripData.id,
            day_number: dayNum,
            date: dayDate.toISOString().split('T')[0],
            title: `Day ${dayNum}`
          })
          .select()
          .single();

        if (dayError) throw dayError;

        // Add activities for this day
        const dayActivitiesList = dayActivities[dayNum] || [];
        if (dayActivitiesList.length > 0) {
          const activities = dayActivitiesList.map((activity, index) => ({
            day_id: dayData.id,
            title: activity.title,
            description: activity.description,
            activity_type: activity.activity_type,
            estimated_cost: activity.estimated_cost,
            duration_minutes: activity.duration_minutes,
            order_index: index
          }));

          const { error: activitiesError } = await supabase
            .from('activities')
            .insert(activities);

          if (activitiesError) throw activitiesError;
        }
      }

      // Navigate to the planner board
      navigate(`/planner/${tripData.id}`);
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Error saving trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Redirect if no trip details
  if (!tripDetails) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tripDetails.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{tripDetails.destination}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{tripDuration} days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${(budgetPerPerson * numberOfTravelers).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Travelers Control */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Travelers:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setNumberOfTravelers(Math.max(1, numberOfTravelers - 1))}
                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{numberOfTravelers}</span>
                  <button
                    onClick={() => setNumberOfTravelers(Math.min(10, numberOfTravelers + 1))}
                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Budget Control */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Budget/person:</label>
                <input
                  type="number"
                  value={budgetPerPerson}
                  onChange={(e) => setBudgetPerPerson(parseInt(e.target.value) || 500)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="50"
                  step="50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Duration:</label>
                <select
                  value={tripDuration}
                  onChange={(e) => setTripDuration(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(days => (
                    <option key={days} value={days}>{days} day{days !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={saveTripAndNavigate}
                disabled={isSaving}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save & Continue'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Activity Library - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Library</h3>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4"
              />

              {/* Activity Suggestions */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => addActivityToSelection(suggestion)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{suggestion.icon}</span>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-700">
                        {suggestion.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>💰 ${suggestion.estimatedCost}</span>
                      <span>⏱️ {suggestion.durationMinutes}min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Activities - Center Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Activities
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({selectedActivities.length})
                </span>
              </h3>
              
              {selectedActivities.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      📋
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">No activities selected</p>
                  <p className="text-xs text-gray-500 mt-1">← Choose from the library</p>
                  <p className="text-xs text-gray-400 mt-1">Then move to days →</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedActivities.map((activity) => (
                      <ActivityCard
                        key={activity.tempId}
                        activity={activity}
                        onRemove={removeActivityFromSelection}
                        onMoveToDay={moveActivityToDay}
                        showMoveButtons={true}
                        tripDuration={tripDuration}
                      />
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-700 flex items-center">
                      <span className="mr-2">💡</span>
                      Use "Move to Day\" buttons to organize your itinerary
                    </p>
                    <div className="mt-2 text-xs text-orange-600">
                      Total: ${selectedActivities.reduce((sum, a) => sum + a.estimated_cost, 0)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Kanban Board - Right Columns */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your Itinerary 🗓️
              </h2>
              <p className="text-gray-600">
                Organize your perfect {tripDetails.destination} adventure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {Array.from({ length: Math.min(tripDuration, 5) }, (_, i) => i + 1).map((dayNum) => (
                <DayColumn
                  key={dayNum}
                  dayNumber={dayNum}
                  activities={dayActivities[dayNum] || []}
                  onMoveToSelection={moveActivityToSelection}
                  onMoveToDay={moveActivityToDay}
                  onRemoveActivity={removeActivityCompletely}
                  tripDuration={tripDuration}
                />
              ))}
            </div>

            {tripDuration > 5 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Your trip is {tripDuration} days long. The first 5 days are shown here. 
                  You can organize the remaining days after saving.
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{tripDuration}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedActivities.length + Object.values(dayActivities).flat().length}
                  </div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${calculateTotalBudget()}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.values(dayActivities).filter(day => day.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Planned Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};