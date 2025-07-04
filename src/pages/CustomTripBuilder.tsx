import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Calendar, MapPin, DollarSign, Clock, GripVertical, X } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { activitySuggestions, type ActivitySuggestion } from '../data/activitySuggestions';
import { useTrips } from '../hooks/useTrips';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Activity } from '../types';

interface CustomActivity extends Omit<Activity, 'id' | 'day_id' | 'created_at'> {
  tempId: string;
}

interface SortableActivityProps {
  activity: CustomActivity;
  onRemove: (tempId: string) => void;
}

const SortableActivity: React.FC<SortableActivityProps> = ({ activity, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow group"
    >
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
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onRemove(activity.tempId)}
            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
            title="Remove activity"
          >
            <X className="w-4 h-4" />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface DayColumnProps {
  dayNumber: number;
  activities: CustomActivity[];
  onDrop: (dayNumber: number) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ dayNumber, activities }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Day {dayNumber}</h3>
        <div className="text-sm text-gray-500">
          {activities.length} activities
        </div>
      </div>
      
      <SortableContext items={activities.map(a => a.tempId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm">Drag activities here</p>
            </div>
          ) : (
            activities.map((activity) => (
              <SortableActivity
                key={activity.tempId}
                activity={activity}
                onRemove={() => {}}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export const CustomTripBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get trip details from navigation state
  const tripDetails = location.state as { title: string; destination: string } | null;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('attraction');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<CustomActivity[]>([]);
  const [dayActivities, setDayActivities] = useState<{ [key: number]: CustomActivity[] }>({
    1: [], 2: [], 3: [], 4: [], 5: []
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tripDuration, setTripDuration] = useState(3);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
    // Also remove from day columns
    setDayActivities(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[parseInt(day)] = updated[parseInt(day)].filter(a => a.tempId !== tempId);
      });
      return updated;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a day column
    const dayMatch = overId.match(/day-(\d+)/);
    if (dayMatch) {
      const dayNumber = parseInt(dayMatch[1]);
      const activity = selectedActivities.find(a => a.tempId === activeId) ||
                     Object.values(dayActivities).flat().find(a => a.tempId === activeId);
      
      if (activity) {
        // Remove from current location
        setSelectedActivities(prev => prev.filter(a => a.tempId !== activeId));
        setDayActivities(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(day => {
            updated[parseInt(day)] = updated[parseInt(day)].filter(a => a.tempId !== activeId);
          });
          return updated;
        });

        // Add to target day
        setDayActivities(prev => ({
          ...prev,
          [dayNumber]: [...prev[dayNumber], activity]
        }));
      }
    }

    setActiveId(null);
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
          estimated_budget: calculateTotalBudget(),
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
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Build Your Trip</h1>
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
                    <span>${calculateTotalBudget()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Activity Library */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

            {/* Selected Activities */}
            {selectedActivities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Activities ({selectedActivities.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedActivities.map((activity) => (
                    <div
                      key={activity.tempId}
                      className="p-2 bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">${activity.estimated_cost}</p>
                      </div>
                      <button
                        onClick={() => removeActivityFromSelection(activity.tempId)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Drag these activities to specific days →
                </p>
              </div>
            )}
          </div>

          {/* Kanban Board */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Plan Your {tripDetails.title} 🗓️
              </h2>
              <p className="text-gray-600">
                Drag activities from the library to organize your perfect itinerary
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Array.from({ length: Math.min(tripDuration, 5) }, (_, i) => i + 1).map((dayNum) => (
                  <div key={dayNum} id={`day-${dayNum}`}>
                    <DayColumn
                      dayNumber={dayNum}
                      activities={dayActivities[dayNum] || []}
                      onDrop={(dayNumber) => {}}
                    />
                  </div>
                ))}
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg opacity-90">
                    <div className="font-medium text-gray-900">Moving activity...</div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {tripDuration > 5 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Your trip is {tripDuration} days long. The first 5 days are shown here. 
                  You can organize the remaining days after saving.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};