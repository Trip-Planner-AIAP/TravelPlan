import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Shield, DollarSign, Plus, GripVertical, X } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePlannerBoard } from '../hooks/usePlannerBoard';
import { FlightSearchCard } from '../components/FlightSearchCard';
import { InsuranceCard } from '../components/InsuranceCard';
import { AddActivityModal } from '../components/AddActivityModal';
import { BudgetTracker } from '../components/BudgetTracker';
import { ChecklistModal } from '../components/ChecklistModal';
import { LocalEssentialsCard } from '../components/LocalEssentialsCard';
import type { Activity } from '../types';

interface SortableActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

const SortableActivityCard: React.FC<SortableActivityCardProps> = ({ activity, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

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
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(activity.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
            title="Delete activity"
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
  dayId: string;
  activities: Activity[];
  onAddActivity: (dayId: string) => void;
  onDeleteActivity: (activityId: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ dayNumber, dayId, activities, onAddActivity, onDeleteActivity }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Day {dayNumber}</h3>
        <button
          onClick={() => onAddActivity(dayId)}
          className="text-orange-600 hover:text-orange-700 p-1 hover:bg-orange-50 rounded transition-colors"
          title="Add new activity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Drag activities here or add new ones</p>
            </div>
          ) : (
            activities.map((activity) => (
              <SortableActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => {}}
                onDelete={onDeleteActivity}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export const PlannerBoard: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const {
    trip,
    days,
    activities,
    flights,
    insurance,
    totalBudget,
    loading,
    moveActivity,
    addActivity,
    deleteActivity,
    searchFlights,
    getInsuranceQuote
  } = usePlannerBoard(tripId!);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [showFlightResults, setShowFlightResults] = useState(false);
  const [showInsuranceQuote, setShowInsuranceQuote] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which day the activity is being moved to
    const targetDay = days.find(day => 
      activities.filter(a => a.day_id === day.id).some(a => a.id === overId) ||
      day.id === overId
    );

    if (targetDay) {
      moveActivity(activeId, targetDay.id);
    }

    setActiveId(null);
  };

  const handleFlightSearch = async () => {
    if (!trip) return;
    
    const result = await searchFlights({
      origin: 'NYC',
      destination: trip.destination,
      departureDate: trip.start_date,
      returnDate: trip.end_date
    });
    
    if (result.success) {
      setShowFlightResults(true);
    }
  };

  const handleInsuranceQuote = async () => {
    if (!trip) return;
    
    // Get selected coverage type from the form
    const coverageSelect = document.getElementById('coverage-type') as HTMLSelectElement;
    const selectedCoverage = coverageSelect?.value || 'basic';
    
    const result = await getInsuranceQuote({
      destination: trip.destination,
      duration: trip.duration_days,
      coverage: selectedCoverage
    });
    
    if (result.success) {
      setShowInsuranceQuote(true);
    }
  };

  const handleAddActivity = (dayId: string) => {
    setSelectedDayId(dayId);
    setShowAddActivityModal(true);
  };

  const handleCreateActivity = async (
    title: string, 
    type: string, 
    estimatedCost: number = 0, 
    durationMinutes: number = 60, 
    description: string = ''
  ) => {
    if (!selectedDayId || !title.trim()) return;
    
    await addActivity(selectedDayId, title.trim(), type, estimatedCost, durationMinutes, description);
    setShowAddActivityModal(false);
    setSelectedDayId('');
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(activityId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-orange-600 hover:text-orange-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
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
                <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
                <p className="text-gray-600">{trip.destination}</p>
              </div>
            </div>
            
            {/* Logo - clickable to home */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
              >
                <Plane className="w-6 h-6 text-orange-600" />
                <span className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">TripPlanner</span>
              </button>
            </div>
            
            {/* Budget Strip */}
            <BudgetTracker 
              totalCost={totalBudget}
              estimatedBudget={trip.estimated_budget}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Kanban Board */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Let's plan your {trip.destination} adventure! 🎉
              </h2>
              <p className="text-gray-600">
                Drag activities between days to organize your perfect itinerary
              </p>
            </div>

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {days.slice(0, 5).map((day) => {
                  const dayActivities = activities.filter(a => a.day_id === day.id);
                  return (
                    <DayColumn
                      key={day.id}
                      dayNumber={day.day_number}
                      dayId={day.id}
                      activities={dayActivities}
                      onAddActivity={handleAddActivity}
                      onDeleteActivity={handleDeleteActivity}
                    />
                  );
                })}
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg opacity-90">
                    <div className="font-medium text-gray-900">Moving activity...</div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Flight Search Card */}
            <FlightSearchCard
              onSearch={handleFlightSearch}
              loading={false}
            />

            {/* Insurance Card */}
            <InsuranceCard
              onGetQuote={handleInsuranceQuote}
              loading={false}
            />

            {/* AI Checklist Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Smart Checklist</h3>
                  <p className="text-sm text-gray-600">AI-powered packing list</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowChecklistModal(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span className="text-lg">✨</span>
                <span>Generate Smart Checklist</span>
              </button>
            </div>

            {/* Local Essentials Card */}
            <LocalEssentialsCard trip={trip} />

            {/* Flight Results (conditional) */}
            {showFlightResults && flights.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Results</h3>
                <div className="space-y-3">
                  {flights.slice(0, 3).map((flight) => (
                    <div key={flight.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{flight.airline}</p>
                          <p className="text-sm text-gray-600">{flight.origin} → {flight.destination}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-600">${flight.price}</p>
                          <p className="text-xs text-gray-500">{flight.flight_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Quote (conditional) */}
            {showInsuranceQuote && insurance.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Quote</h3>
                <div className="space-y-3">
                  {insurance.slice(0, 3).map((policy) => (
                    <div key={policy.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{policy.provider}</p>
                          <p className="text-xs text-gray-600 capitalize">{policy.policy_type} Coverage</p>
                        </div>
                        <p className="font-semibold text-orange-600">${policy.premium_cost}</p>
                      </div>
                      <p className="text-sm text-gray-600">Coverage: ${policy.coverage_amount?.toLocaleString()}</p>
                      <button className="mt-2 w-full bg-green-600 text-white py-1 px-3 rounded text-xs hover:bg-green-700 transition-colors">
                        Select This Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Activity Modal */}
        <AddActivityModal
          isOpen={showAddActivityModal}
          onClose={() => {
            setShowAddActivityModal(false);
            setSelectedDayId('');
          }}
          onCreateActivity={handleCreateActivity}
        />

        {/* Checklist Modal */}
        <ChecklistModal
          isOpen={showChecklistModal}
          onClose={() => setShowChecklistModal(false)}
          trip={trip}
        />
      </div>
    </div>
  );
};