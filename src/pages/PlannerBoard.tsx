import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Shield, DollarSign, Plus, GripVertical, X } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePlannerBoard } from '../hooks/usePlannerBoard';
import { FlightSearchCard } from '../components/FlightSearchCard';
import { InsuranceCard } from '../components/InsuranceCard';
import { AddActivityModal } from '../components/AddActivityModal';
import { BudgetManager } from '../components/BudgetManager';
import { LocalEssentialsCard } from '../components/LocalEssentialsCard';
import { ItineraryAnalyzer } from '../components/ItineraryAnalyzer';
import { TripSummaryReport } from '../components/TripSummaryReport';
import { useAIFeatures } from '../hooks/useAIFeatures';
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
      case 'flight': return { emoji: '✈️', bg: 'from-blue-500 to-sky-500' };
      case 'hotel': return { emoji: '🏨', bg: 'from-purple-500 to-indigo-500' };
      case 'meal': return { emoji: '🍽️', bg: 'from-orange-500 to-red-500' };
      case 'transport': return { emoji: '🚗', bg: 'from-green-500 to-emerald-500' };
      default: return { emoji: '📍', bg: 'from-gray-500 to-slate-500' };
    }
  };

  const activityIcon = getActivityIcon(activity.activity_type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-200 group hover:border-orange-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${activityIcon.bg} rounded-lg flex items-center justify-center shadow-sm`}>
              <span className="text-sm">{activityIcon.emoji}</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm leading-tight">{activity.title}</h4>
          </div>
          {activity.description && (
            <p className="text-xs text-gray-600 mb-2 leading-relaxed">{activity.description}</p>
          )}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-gray-500">
              <span>{activity.duration_minutes}min</span>
            </div>
            <div className="font-medium text-orange-600">
              <span>${activity.estimated_cost}</span>
            </div>
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
            <X className="w-3 h-3" />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
          >
            <GripVertical className="w-3 h-3" />
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
  const {
    setNodeRef,
    isOver,
  } = useSortable({ 
    id: dayId,
    data: {
      type: 'day',
      dayId: dayId
    }
  });

  const totalCost = activities.reduce((sum, activity) => sum + activity.estimated_cost, 0);
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration_minutes, 0);
  const totalHours = Math.floor(totalDuration / 60);
  const remainingMinutes = totalDuration % 60;

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white rounded-lg p-4 min-h-[350px] border shadow-sm hover:shadow-md transition-all duration-200 ${
        isOver 
          ? 'border-orange-400 bg-orange-50 shadow-lg scale-105' 
          : 'border-gray-200'
      }`}
    >
      {/* Day Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">{dayNumber}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Day {dayNumber}</h3>
            <p className="text-xs text-gray-500">{activities.length} activities</p>
          </div>
        </div>
        <button
          onClick={() => onAddActivity(dayId)}
          className="w-7 h-7 bg-orange-100 text-orange-600 hover:text-white hover:bg-orange-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          title="Add new activity"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      {/* Day Stats */}
      {activities.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-2 mb-3 border border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{activities.length} items</span>
            <span className="text-gray-600">
              {totalHours > 0 ? `${totalHours}h` : ''}{remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}
            </span>
            <span className="font-medium text-orange-600">${totalCost}</span>
          </div>
        </div>
      )}

      <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📅</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">No activities planned</p>
              <p className="text-xs text-gray-500">Click + to add activities</p>
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
    selectFlight,
    deselectFlight,
    searchFlights,
    getInsuranceQuote,
    selectInsurance,
    deselectInsurance,
    refetch
  } = usePlannerBoard(tripId!);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [showInsuranceQuote, setShowInsuranceQuote] = useState(false);
  const [availableFlights, setAvailableFlights] = useState<Flight[]>([]);
  const [availableInsurance, setAvailableInsurance] = useState<Insurance[]>([]);
  const [showSummaryReport, setShowSummaryReport] = useState(false);

  // Checklist state
  const [checklist, setChecklist] = useState<any[]>([]);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const [hasGeneratedChecklist, setHasGeneratedChecklist] = useState(false);
  const [isChecklistConfirmed, setIsChecklistConfirmed] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{ remaining: number; canMakeCall: boolean }>({ remaining: 6000, canMakeCall: true });
  
  const { 
    loading: aiLoading, 
    error: aiError, 
    generateChecklist, 
    updateChecklistItem, 
    getChecklist,
    checkTokenUsage 
  } = useAIFeatures(trip?.id || '');

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    if (trip) {
      loadChecklist();
      loadTokenInfo();
    }
  }, [trip]);

  const loadChecklist = async () => {
    if (!trip) return;
    const items = await getChecklist();
    setChecklist(items);
    setHasGeneratedChecklist(items.length > 0);
  };

  const loadTokenInfo = async () => {
    if (!trip) return;
    const info = await checkTokenUsage();
    setTokenInfo(info);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback during drag over
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a day column directly
    const targetDay = days.find(day => day.id === overId);
    
    if (targetDay) {
      moveActivity(activeId, targetDay.id);
    } else {
      // Find which day the target activity belongs to
      const targetActivity = activities.find(a => a.id === overId);
      if (targetActivity) {
        const targetDay = days.find(day => day.id === targetActivity.day_id);
        if (targetDay) {
          moveActivity(activeId, targetDay.id);
        }
      }
    }

    setActiveId(null);
  };

  const handleGenerateChecklist = async () => {
    if (!trip) return;
    
    setIsGeneratingChecklist(true);
    
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
      setHasGeneratedChecklist(true);
      await loadTokenInfo(); // Refresh token info
    }
    
    setIsGeneratingChecklist(false);
  };

  const handleToggleChecklistItem = async (itemId: string, currentStatus: boolean) => {
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
    setIsChecklistConfirmed(true);
  };

  const getChecklistCompletionStats = () => {
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
  }, {} as Record<string, any[]>);

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

  const handleFlightSearch = async () => {
    if (!trip) return;
    
    const result = await searchFlights({
      origin: 'NYC',
      destination: trip.destination,
      departureDate: trip.start_date,
      returnDate: trip.end_date
    });
    
    if (result.success && result.data) {
      setAvailableFlights(result.data);
    }
  };

  const handleSelectFlight = async (flight: Flight) => {
    try {
      const result = await selectFlight(flight);
      if (result && result.success) {
        console.log('Flight selected successfully');
        // Optionally show a success message to user
      }
    } catch (error) {
      console.error('Error selecting flight:', error);
    }
  };

  const handleDeselectFlight = async (flightId: string) => {
    const result = await deselectFlight(flightId);
    if (result.success) {
      console.log('Flight deselected successfully');
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
      setAvailableInsurance(result.data || []);
      setShowInsuranceQuote(true);
    }
  };

  const handleSelectInsurance = async (insurance: Insurance) => {
    try {
      const result = await selectInsurance(insurance);
      if (result && result.success) {
        console.log('Insurance selected successfully');
      }
    } catch (error) {
      console.error('Error selecting insurance:', error);
    }
  };

  const handleDeselectInsurance = async (insuranceId: string) => {
    const result = await deselectInsurance(insuranceId);
    if (result.success) {
      console.log('Insurance deselected successfully');
    }
  };

  // Check if user has completed major planning phases
  const getPlanningProgress = () => {
    const hasActivities = activities.length > 0;
    const hasFlights = flights.length > 0;
    const hasInsurance = insurance.length > 0;
    const hasChecklist = checklist.length > 0;
    
    const completedPhases = [hasActivities, hasFlights, hasInsurance, hasChecklist].filter(Boolean).length;
    const canShowSummary = completedPhases >= 2; // Show summary when at least 2 phases are complete
    
    return {
      hasActivities,
      hasFlights,
      hasInsurance,
      hasChecklist,
      completedPhases,
      canShowSummary
    };
  };

  const planningProgress = getPlanningProgress();

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
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div className="text-sm">
                <span className="font-medium text-gray-900">
                  ${totalBudget.toFixed(2)}
                </span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-600">
                  ${(trip.estimated_budget || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Kanban Board - Full Width */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Let's plan your {trip.destination} adventure! 
              </span>
              <span className="ml-2">🎉</span>
            </h2>
            <p className="text-gray-600 flex items-center space-x-2">
              <span>✨</span>
              <span>Drag activities between days to organize your perfect itinerary</span>
            </p>
          </div>

          {/* Travel Progress Indicator */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white">🗺️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Trip Planning Progress</h4>
                  <p className="text-sm text-gray-600">
                    {activities.length} activities planned across {days.length} days
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {activities.length === 0 ? 0 : Math.round((activities.length / (days.length * 2)) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            <div className="mt-3 w-full bg-white rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${activities.length === 0 ? 0 : Math.min((activities.length / (days.length * 2)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={days.map(d => d.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {days.map((day) => {
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
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white rounded-lg border-2 border-orange-400 p-3 shadow-2xl transform rotate-2 scale-110 opacity-95">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">✨</span>
                    </div>
                    <div className="font-medium text-orange-700">Moving activity...</div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Flight and Travel Services Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Flight Search Card */}
          <FlightSearchCard
            onSearch={handleFlightSearch}
            loading={false}
            tripDestination={trip.destination}
            flights={availableFlights}
            onSelectFlight={handleSelectFlight}
            onDeselectFlight={handleDeselectFlight}
            selectedFlights={flights}
          />

          {/* Insurance Card */}
          <InsuranceCard
            onGetQuote={handleInsuranceQuote}
            loading={false}
            availableInsurance={availableInsurance}
            selectedInsurance={insurance}
            onSelectInsurance={handleSelectInsurance}
            onDeselectInsurance={handleDeselectInsurance}
          />
        </div>

        {/* Local Essentials and Trip Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Local Essentials Card */}
          <LocalEssentialsCard trip={trip} />

          {/* Placeholder for symmetry */}
          <div></div>
        </div>

        {/* Budget Manager Section */}
        <div className="mb-8">
          <BudgetManager 
            trip={trip} 
            activities={activities} 
            onTripUpdate={(updatedTrip) => {
              // Update the trip state and refetch data
              refetch();
            }}
          />
        </div>

        {/* AI Itinerary Analyzer */}
        <div className="mb-8">
          <ItineraryAnalyzer trip={trip} days={days} activities={activities} />
        </div>

        {/* Smart Checklist Button - Below AI Assistant */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl animate-pulse">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Your Smart Checklist?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Now that you've planned your itinerary and the AI has analyzed it, let's create your personalized packing checklist!
              </p>
              
              <button
                onClick={handleGenerateChecklist}
                disabled={isGeneratingChecklist || (!tokenInfo.canMakeCall && !hasGeneratedChecklist)}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-lg mx-auto"
              >
                {isGeneratingChecklist ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Smart Checklist...</span>
                  </>
                ) : hasGeneratedChecklist ? (
                  <>
                    <span className="text-xl">📋</span>
                    <span>View Your Checklist Below</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    <span>Generate AI-Powered Checklist</span>
                  </>
                )}
              </button>
              
              {!tokenInfo.canMakeCall && !hasGeneratedChecklist && (
                <div className="mt-4 text-sm text-yellow-700 bg-yellow-100 px-4 py-3 rounded-lg border border-yellow-300">
                  <div className="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Token limit reached. Checklist generation unavailable.</span>
                  </div>
                </div>
              )}
              
              {!hasGeneratedChecklist && tokenInfo.canMakeCall && (
                <div className="mt-4 text-xs text-gray-500">
                  <p>AI-powered insights • Tokens remaining: {tokenInfo.remaining} / 6000</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Travel Checklist Section */}
        {hasGeneratedChecklist && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 border-b border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Smart Travel Checklist</h2>
                  <p className="text-lg text-gray-600">{trip.destination} • {trip.duration_days} days</p>
                </div>
              </div>
              
              {/* Progress Header */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Perfect! Your personalized checklist is ready 🎯
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">{getChecklistCompletionStats().percentage}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${getChecklistCompletionStats().percentage}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-600">
                  You've packed {getChecklistCompletionStats().completed} of {getChecklistCompletionStats().total} items!
                  {getChecklistCompletionStats().percentage === 100 && " 🎉 You're all set for your adventure!"}
                </p>
              </div>
            </div>

            {/* Checklist Content */}
            <div className="p-8">
              {!isChecklistConfirmed ? (
                <>
                  {/* Checklist Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {Object.entries(groupedChecklist).map(([category, items]) => (
                      <div key={category} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {categoryNames[category as keyof typeof categoryNames]}
                            </h4>
                            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                              ({items.filter(item => item.is_completed).length}/{items.length})
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          {items
                            .sort((a, b) => a.priority - b.priority)
                            .map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center space-x-4 p-4 rounded-xl border transition-all hover:shadow-sm ${
                                item.is_completed 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-white border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <button
                                onClick={() => handleToggleChecklistItem(item.id, item.is_completed)}
                                className="flex-shrink-0"
                              >
                                {item.is_completed ? (
                                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-orange-500 transition-colors"></div>
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
                              
                              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                priorityColors[item.priority as keyof typeof priorityColors]
                              }`}>
                                {priorityLabels[item.priority as keyof typeof priorityLabels]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-semibold text-gray-900 mb-3">
                        Your checklist is ready! 🎉
                      </h4>
                      <p className="text-lg text-gray-600">
                        What would you like to do next?
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                      <button
                        onClick={handleConfirmChecklist}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/30"
                      >
                        <span className="text-xl">✅</span>
                        <span>Perfect! I'm Ready to Pack</span>
                      </button>
                      
                      <button
                        className="flex-1 bg-white border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-sm"
                      >
                        <span className="text-xl">📌</span>
                        <span>Save for Later</span>
                      </button>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-500">
                        Your checklist is automatically saved and you can access it anytime
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        AI-powered insights • Tokens remaining: {tokenInfo.remaining} / 6000
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* Confirmation Message */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl text-white">✅</span>
                  </div>
                  <h3 className="text-3xl font-bold text-green-800 mb-4">
                    Checklist Confirmed! 
                  </h3>
                  <p className="text-xl text-green-700 mb-8">
                    You're all set for your {trip.destination} adventure. Have an amazing trip!
                  </p>
                  <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-green-800 font-medium">
                      🎒 {getChecklistCompletionStats().completed} items packed
                    </p>
                    <p className="text-green-700 text-sm mt-2">
                      Your checklist will remain available for future reference
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trip Summary Action Button - Below Checklist */}
        {planningProgress.canShowSummary && (
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-200 p-6 animate-fadeIn">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trip Summary Report</h3>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <span>✨</span>
                  <span>Your planning is {Math.round((planningProgress.completedPhases / 4) * 100)}% complete</span>
                </p>
              </div>
            </div>
            
            {/* Progress Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className={`flex items-center space-x-2 text-sm ${planningProgress.hasActivities ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{planningProgress.hasActivities ? '✅' : '⭕'}</span>
                <span>Activities</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${planningProgress.hasFlights ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{planningProgress.hasFlights ? '✅' : '⭕'}</span>
                <span>Flights</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${planningProgress.hasInsurance ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{planningProgress.hasInsurance ? '✅' : '⭕'}</span>
                <span>Insurance</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${planningProgress.hasChecklist ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{planningProgress.hasChecklist ? '✅' : '⭕'}</span>
                <span>Checklist</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowSummaryReport(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span className="text-lg">📋</span>
              <span>Generate Complete Trip Summary Report</span>
            </button>
          </div>
        )}
        {/* Add Activity Modal */}
        <AddActivityModal
          isOpen={showAddActivityModal}
          destination={trip.destination}
          onClose={() => {
            setShowAddActivityModal(false);
            setSelectedDayId('');
          }}
          onCreateActivity={handleCreateActivity}
        />

        {/* Trip Summary Report Modal */}
        <TripSummaryReport
          isOpen={showSummaryReport}
          onClose={() => setShowSummaryReport(false)}
          trip={trip}
          days={days}
          activities={activities}
          flights={flights}
          insurance={insurance}
          checklist={checklist}
          totalBudget={totalBudget}
        />
      </div>
    </div>
  );
};