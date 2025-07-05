import { useState, useEffect } from 'react';
import type { Trip, Day, Activity } from '../types';

interface ItinerarySuggestion {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  title: string;
  description: string;
  affectedActivities: string[];
  suggestedFix?: string;
  priority: 'high' | 'medium' | 'low';
}

export const useItineraryAnalyzer = (trip: Trip | null, days: Day[], activities: Activity[]) => {
  const [suggestions, setSuggestions] = useState<ItinerarySuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (trip && days.length > 0 && activities.length > 0) {
      analyzeItinerary();
    } else {
      setSuggestions([]);
    }
  }, [trip, days, activities]);

  const analyzeItinerary = async () => {
    setIsAnalyzing(true);
    
    try {
      const newSuggestions: ItinerarySuggestion[] = [];

      // Group activities by day
      const activitiesByDay = days.map(day => ({
        day,
        activities: activities.filter(a => a.day_id === day.id).sort((a, b) => a.order_index - b.order_index)
      }));

      // 1. Check for flight logic issues
      checkFlightLogic(activitiesByDay, newSuggestions);

      // 2. Check for hotel logic issues
      checkHotelLogic(activitiesByDay, newSuggestions);

      // 3. Check for timing conflicts
      checkTimingConflicts(activitiesByDay, newSuggestions);

      // 4. Check for geographical logic
      checkGeographicalLogic(activitiesByDay, newSuggestions, trip);

      // 5. Check for activity sequence logic
      checkActivitySequence(activitiesByDay, newSuggestions);

      // 6. Check for budget anomalies
      checkBudgetAnomalies(activitiesByDay, newSuggestions, trip);

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error analyzing itinerary:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkFlightLogic = (activitiesByDay: any[], suggestions: ItinerarySuggestion[]) => {
    const flightActivities = activitiesByDay.flatMap(({ day, activities }) => 
      activities
        .filter(a => a.activity_type === 'flight')
        .map(a => ({ ...a, dayNumber: day.day_number }))
    );

    // Check for departure flights not on first day
    const departureFlights = flightActivities.filter(f => 
      f.title.toLowerCase().includes('depart') || 
      f.title.toLowerCase().includes('arrive at') ||
      f.description?.toLowerCase().includes('departure')
    );

    departureFlights.forEach(flight => {
      if (flight.dayNumber > 1) {
        suggestions.push({
          id: `flight-departure-${flight.id}`,
          type: 'error',
          title: '✈️ Departure Flight Timing Issue',
          description: `Your departure flight "${flight.title}" is scheduled for Day ${flight.dayNumber}, but departure flights typically happen on Day 1 or the last day of your trip.`,
          affectedActivities: [flight.id],
          suggestedFix: 'Move this flight to Day 1 if it\'s your outbound flight, or to the last day if it\'s your return flight.',
          priority: 'high'
        });
      }
    });

    // Check for return flights not on last day
    const returnFlights = flightActivities.filter(f => 
      f.title.toLowerCase().includes('return') || 
      f.title.toLowerCase().includes('departure') ||
      f.description?.toLowerCase().includes('return')
    );

    const lastDay = Math.max(...activitiesByDay.map(d => d.day.day_number));
    returnFlights.forEach(flight => {
      if (flight.dayNumber < lastDay && flight.dayNumber > 1) {
        suggestions.push({
          id: `flight-return-${flight.id}`,
          type: 'error',
          title: '✈️ Return Flight Timing Issue',
          description: `Your return flight "${flight.title}" is on Day ${flight.dayNumber}, but you have activities planned for later days. This doesn't make sense!`,
          affectedActivities: [flight.id],
          suggestedFix: `Move this flight to Day ${lastDay} (your last day) or adjust your trip duration.`,
          priority: 'high'
        });
      }
    });

    // Check for multiple flights on same day
    const flightsByDay = flightActivities.reduce((acc, flight) => {
      if (!acc[flight.dayNumber]) acc[flight.dayNumber] = [];
      acc[flight.dayNumber].push(flight);
      return acc;
    }, {} as Record<number, any[]>);

    Object.entries(flightsByDay).forEach(([dayNum, flights]) => {
      if (flights.length > 2) {
        suggestions.push({
          id: `multiple-flights-day-${dayNum}`,
          type: 'warning',
          title: '✈️ Multiple Flights Same Day',
          description: `You have ${flights.length} flights scheduled for Day ${dayNum}. This might be too many for one day.`,
          affectedActivities: flights.map(f => f.id),
          suggestedFix: 'Consider spreading flights across different days or combining connecting flights.',
          priority: 'medium'
        });
      }
    });
  };

  const checkHotelLogic = (activitiesByDay: any[], suggestions: ItinerarySuggestion[]) => {
    const hotelActivities = activitiesByDay.flatMap(({ day, activities }) => 
      activities
        .filter(a => a.activity_type === 'hotel')
        .map(a => ({ ...a, dayNumber: day.day_number }))
    );

    // Check for check-out before check-in
    const checkIns = hotelActivities.filter(h => 
      h.title.toLowerCase().includes('check-in') || h.title.toLowerCase().includes('check in')
    );
    const checkOuts = hotelActivities.filter(h => 
      h.title.toLowerCase().includes('check-out') || h.title.toLowerCase().includes('check out')
    );

    checkIns.forEach(checkIn => {
      checkOuts.forEach(checkOut => {
        if (checkOut.dayNumber <= checkIn.dayNumber) {
          suggestions.push({
            id: `hotel-logic-${checkIn.id}-${checkOut.id}`,
            type: 'error',
            title: '🏨 Hotel Check-in/Check-out Logic Error',
            description: `You have hotel check-out on Day ${checkOut.dayNumber} but check-in on Day ${checkIn.dayNumber}. You can't check out before checking in!`,
            affectedActivities: [checkIn.id, checkOut.id],
            suggestedFix: 'Move check-in to an earlier day or check-out to a later day.',
            priority: 'high'
          });
        }
      });
    });

    // Check for check-in on last day
    const lastDay = Math.max(...activitiesByDay.map(d => d.day.day_number));
    checkIns.forEach(checkIn => {
      if (checkIn.dayNumber === lastDay) {
        suggestions.push({
          id: `hotel-checkin-lastday-${checkIn.id}`,
          type: 'warning',
          title: '🏨 Hotel Check-in on Last Day',
          description: `You're checking into a hotel on Day ${lastDay} (your last day). This might not be necessary if you're departing the same day.`,
          affectedActivities: [checkIn.id],
          suggestedFix: 'Consider if you really need accommodation on your departure day.',
          priority: 'medium'
        });
      }
    });
  };

  const checkTimingConflicts = (activitiesByDay: any[], suggestions: ItinerarySuggestion[]) => {
    activitiesByDay.forEach(({ day, activities }) => {
      if (activities.length === 0) return;

      const totalDuration = activities.reduce((sum, a) => sum + a.duration_minutes, 0);
      const totalHours = Math.round(totalDuration / 60 * 10) / 10;

      if (totalHours > 16) {
        suggestions.push({
          id: `overloaded-day-${day.id}`,
          type: 'warning',
          title: '⏰ Overloaded Day Schedule',
          description: `Day ${day.day_number} has ${totalHours} hours of activities planned. This might be too ambitious and exhausting!`,
          affectedActivities: activities.map(a => a.id),
          suggestedFix: 'Consider moving some activities to other days or removing less important ones.',
          priority: 'medium'
        });
      }

      // Check for unrealistic activity combinations
      const hasFlightAndManyActivities = activities.some(a => a.activity_type === 'flight') && activities.length > 3;
      if (hasFlightAndManyActivities) {
        const flightActivity = activities.find(a => a.activity_type === 'flight');
        suggestions.push({
          id: `flight-busy-day-${day.id}`,
          type: 'warning',
          title: '✈️ Flight Day Too Busy',
          description: `Day ${day.day_number} has a flight plus ${activities.length - 1} other activities. Flight days are usually tiring and unpredictable.`,
          affectedActivities: activities.map(a => a.id),
          suggestedFix: 'Consider keeping flight days lighter with fewer activities.',
          priority: 'medium'
        });
      }
    });
  };

  const checkGeographicalLogic = (activitiesByDay: any[], suggestions: ItinerarySuggestion[], trip: Trip | null) => {
    if (!trip) return;

    // Check for activities that don't match destination
    activitiesByDay.forEach(({ day, activities }) => {
      activities.forEach(activity => {
        // Check for obvious mismatches
        const destination = trip.destination.toLowerCase();
        const activityTitle = activity.title.toLowerCase();
        const activityDesc = activity.description?.toLowerCase() || '';

        // Example: Tokyo activities in Paris trip
        if (destination.includes('paris') && (activityTitle.includes('tokyo') || activityTitle.includes('japan'))) {
          suggestions.push({
            id: `location-mismatch-${activity.id}`,
            type: 'error',
            title: '🌍 Location Mismatch',
            description: `Activity "${activity.title}" seems to be for a different destination than ${trip.destination}.`,
            affectedActivities: [activity.id],
            suggestedFix: 'Double-check this activity is for the correct destination.',
            priority: 'high'
          });
        }

        // Check for winter activities in summer destinations
        if ((destination.includes('bali') || destination.includes('thailand')) && 
            (activityTitle.includes('skiing') || activityTitle.includes('winter'))) {
          suggestions.push({
            id: `season-mismatch-${activity.id}`,
            type: 'warning',
            title: '🌡️ Seasonal Activity Mismatch',
            description: `"${activity.title}" might not be available in ${trip.destination} due to climate.`,
            affectedActivities: [activity.id],
            suggestedFix: 'Verify this activity is available in your destination.',
            priority: 'medium'
          });
        }
      });
    });
  };

  const checkActivitySequence = (activitiesByDay: any[], suggestions: ItinerarySuggestion[]) => {
    activitiesByDay.forEach(({ day, activities }) => {
      if (activities.length < 2) return;

      // Check for meals at weird times
      const meals = activities.filter(a => a.activity_type === 'meal');
      meals.forEach((meal, index) => {
        const mealTitle = meal.title.toLowerCase();
        
        // Breakfast should be early in the day
        if (mealTitle.includes('breakfast') && index > 2) {
          suggestions.push({
            id: `breakfast-timing-${meal.id}`,
            type: 'suggestion',
            title: '🍳 Breakfast Timing',
            description: `"${meal.title}" is scheduled late in your Day ${day.day_number} activities. Breakfast is usually one of the first activities.`,
            affectedActivities: [meal.id],
            suggestedFix: 'Consider moving breakfast earlier in the day.',
            priority: 'low'
          });
        }

        // Dinner should be later in the day
        if (mealTitle.includes('dinner') && index < activities.length - 3) {
          suggestions.push({
            id: `dinner-timing-${meal.id}`,
            type: 'suggestion',
            title: '🍽️ Dinner Timing',
            description: `"${meal.title}" is scheduled early in your Day ${day.day_number} activities. Dinner is usually one of the last activities.`,
            affectedActivities: [meal.id],
            suggestedFix: 'Consider moving dinner later in the day.',
            priority: 'low'
          });
        }
      });

      // Check for transport after arrival
      const hasArrivalFlight = activities.some(a => 
        a.activity_type === 'flight' && 
        (a.title.toLowerCase().includes('arrive') || a.description?.toLowerCase().includes('arrival'))
      );
      
      if (hasArrivalFlight) {
        const flightIndex = activities.findIndex(a => 
          a.activity_type === 'flight' && 
          (a.title.toLowerCase().includes('arrive') || a.description?.toLowerCase().includes('arrival'))
        );
        
        const hasTransportAfter = activities.slice(flightIndex + 1).some(a => a.activity_type === 'transport');
        
        if (!hasTransportAfter && activities.length > flightIndex + 1) {
          suggestions.push({
            id: `missing-transport-${day.id}`,
            type: 'suggestion',
            title: '🚗 Missing Airport Transport',
            description: `You have activities planned after arriving at the airport on Day ${day.day_number}, but no transport from the airport.`,
            affectedActivities: activities.slice(flightIndex).map(a => a.id),
            suggestedFix: 'Consider adding transport from the airport to your next activity.',
            priority: 'medium'
          });
        }
      }
    });
  };

  const checkBudgetAnomalies = (activitiesByDay: any[], suggestions: ItinerarySuggestion[], trip: Trip | null) => {
    if (!trip) return;

    const totalCost = activitiesByDay.flatMap(d => d.activities).reduce((sum, a) => sum + a.estimated_cost, 0);
    const budgetPerDay = trip.estimated_budget / trip.duration_days;

    activitiesByDay.forEach(({ day, activities }) => {
      const dayCost = activities.reduce((sum, a) => sum + a.estimated_cost, 0);
      
      if (dayCost > budgetPerDay * 2) {
        suggestions.push({
          id: `expensive-day-${day.id}`,
          type: 'warning',
          title: '💰 Expensive Day Alert',
          description: `Day ${day.day_number} costs $${dayCost}, which is ${Math.round(dayCost / budgetPerDay * 100)}% of your daily budget ($${Math.round(budgetPerDay)}).`,
          affectedActivities: activities.map(a => a.id),
          suggestedFix: 'Consider moving some expensive activities to other days or finding cheaper alternatives.',
          priority: 'medium'
        });
      }

      // Check for free days (might be unrealistic)
      if (dayCost === 0 && activities.length > 2) {
        suggestions.push({
          id: `free-day-${day.id}`,
          type: 'suggestion',
          title: '🆓 Completely Free Day',
          description: `Day ${day.day_number} has ${activities.length} activities but costs $0. This might be unrealistic.`,
          affectedActivities: activities.map(a => a.id),
          suggestedFix: 'Double-check if these activities are truly free or if you missed some costs.',
          priority: 'low'
        });
      }
    });
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getSuggestionsByPriority = () => {
    return {
      high: suggestions.filter(s => s.priority === 'high'),
      medium: suggestions.filter(s => s.priority === 'medium'),
      low: suggestions.filter(s => s.priority === 'low')
    };
  };

  return {
    suggestions,
    isAnalyzing,
    dismissSuggestion,
    getSuggestionsByPriority,
    reanalyze: analyzeItinerary
  };
};