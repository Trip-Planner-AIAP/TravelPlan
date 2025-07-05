import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Trip, Day, Activity, Flight, Insurance } from '../types';

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}

interface InsuranceQuoteParams {
  destination: string;
  duration: number;
  coverage: string;
}

export const usePlannerBoard = (tripId: string) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      // Fetch trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;
      setTrip(tripData);

      // Fetch days
      const { data: daysData, error: daysError } = await supabase
        .from('days')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_number');

      if (daysError) throw daysError;
      setDays(daysData || []);

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .in('day_id', (daysData || []).map(d => d.id))
        .order('order_index');

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);

      // Fetch flights
      const { data: flightsData, error: flightsError } = await supabase
        .from('flights')
        .select('*')
        .eq('trip_id', tripId);

      if (flightsError) throw flightsError;
      setFlights(flightsData || []);

      // Fetch insurance
      const { data: insuranceData, error: insuranceError } = await supabase
        .from('insurance')
        .select('*')
        .eq('trip_id', tripId);

      if (insuranceError) throw insuranceError;
      setInsurance(insuranceData || []);

    } catch (error) {
      console.error('Error fetching trip data:', error);
      // Fallback to demo data
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Demo data when database is not available
    const demoTrip: Trip = {
      id: tripId,
      title: 'Tokyo Adventure',
      destination: 'Tokyo, Japan',
      start_date: '2024-03-15',
      end_date: '2024-03-20',
      duration_days: 5,
      estimated_budget: 1200,
      image_url: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      user_id: 'fec18839-8366-4317-b674-1b04a4a9b8bd',
      template_id: 'tokyo_adventure',
      created_at: new Date().toISOString()
    };

    const demoDays: Day[] = Array.from({ length: 5 }, (_, i) => ({
      id: `day-${i + 1}`,
      trip_id: tripId,
      day_number: i + 1,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      title: `Day ${i + 1}`,
      created_at: new Date().toISOString()
    }));

    const demoActivities: Activity[] = [
      {
        id: 'activity-1',
        day_id: 'day-1',
        title: 'Arrive at Narita Airport',
        description: 'International flight arrival',
        activity_type: 'flight',
        estimated_cost: 450,
        duration_minutes: 180,
        order_index: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 'activity-2',
        day_id: 'day-1',
        title: 'Check-in at Shibuya Hotel',
        description: 'Modern hotel in the heart of Tokyo',
        activity_type: 'hotel',
        estimated_cost: 120,
        duration_minutes: 60,
        order_index: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 'activity-3',
        day_id: 'day-2',
        title: 'Visit Senso-ji Temple',
        description: 'Tokyo\'s oldest temple in Asakusa',
        activity_type: 'attraction',
        estimated_cost: 0,
        duration_minutes: 180,
        order_index: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 'activity-4',
        day_id: 'day-2',
        title: 'Lunch at Tsukiji Market',
        description: 'Fresh sushi and seafood',
        activity_type: 'meal',
        estimated_cost: 35,
        duration_minutes: 90,
        order_index: 1,
        created_at: new Date().toISOString()
      }
    ];

    setTrip(demoTrip);
    setDays(demoDays);
    setActivities(demoActivities);
    setFlights([]);
    setInsurance([]);
  };

  const moveActivity = async (activityId: string, newDayId: string) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('activities')
        .update({ day_id: newDayId })
        .eq('id', activityId);

      if (error) throw error;

      // Update local state
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, day_id: newDayId }
            : activity
        )
      );
    } catch (error) {
      console.error('Error moving activity:', error);
      // Still update local state for demo purposes
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, day_id: newDayId }
            : activity
        )
      );
    }
  };

  const selectFlight = async (flight: Flight) => {
    try {
      // Add flight to selected flights if not already selected
      if (!flights.some(f => f.id === flight.id)) {
        setFlights(prev => [...prev, flight]);
        
        // Try to save to database
        const { error } = await supabase
          .from('flights')
          .insert({
            id: flight.id,
            trip_id: flight.trip_id,
            origin: flight.origin,
            destination: flight.destination,
            departure_date: flight.departure_date,
            return_date: flight.return_date,
            price: flight.price,
            airline: flight.airline,
            flight_number: flight.flight_number,
            api_response: flight.api_response
          });
        
        if (error) {
          console.error('Database error (continuing with local state):', error);
        }
      }

      // Automatically add flight activities to the itinerary
      await addFlightActivities(flight);
      
      return { success: true };
    } catch (error) {
      console.error('Error selecting flight:', error);
      // Still update local state even if database fails
      if (!flights.some(f => f.id === flight.id)) {
        setFlights(prev => [...prev, flight]);
        await addFlightActivities(flight);
      }
      return { success: true }; // Return success for local state update
    }
  };

  const deselectFlight = async (flightId: string) => {
    try {
      // Remove flight from selected flights
      const flightToRemove = flights.find(f => f.id === flightId);
      if (!flightToRemove) return { success: false, error: 'Flight not found' };
      
      setFlights(prev => prev.filter(f => f.id !== flightId));
      
      // Remove from database
      const { error } = await supabase
        .from('flights')
        .delete()
        .eq('id', flightId);
      
      if (error) {
        console.error('Database error:', error);
        // Still continue with local state update for demo purposes
        return { success: false, error };
      }
      
      // Remove related flight activities
      await removeFlightActivities(flightToRemove);
      
      return { success: true };
    } catch (error) {
      console.error('Error deselecting flight:', error);
      // Still update local state even if database fails
      setFlights(prev => prev.filter(f => f.id !== flightId));
      return { success: false, error };
    }
  };

  const removeFlightActivities = async (flight: Flight) => {
    try {
      // Find and remove flight-related activities
      const flightActivities = activities.filter(activity => 
        activity.activity_type === 'flight' && 
        (activity.title.includes(flight.airline || '') || 
         activity.title.includes(flight.flight_number || '') ||
         activity.description?.includes(flight.origin || '') ||
         activity.description?.includes(flight.destination || ''))
      );
      
      for (const activity of flightActivities) {
        // Remove from local state
        setActivities(prev => prev.filter(a => a.id !== activity.id));
        
        // Try to remove from database
        try {
          await supabase
            .from('activities')
            .delete()
            .eq('id', activity.id);
        } catch (dbError) {
          console.error('Error removing activity from database:', dbError);
        }
      }
    } catch (error) {
      console.error('Error removing flight activities:', error);
    }
  };

  const addFlightActivities = async (flight: Flight) => {
    try {
      // Check if this is an outbound or return flight based on dates
      const tripStartDate = new Date(trip?.start_date || '');
      const tripEndDate = new Date(trip?.end_date || '');
      const flightDepartureDate = new Date(flight.departure_date || '');
      const flightReturnDate = new Date(flight.return_date || '');
      
      const isOutbound = Math.abs(flightDepartureDate.getTime() - tripStartDate.getTime()) < 24 * 60 * 60 * 1000; // Within 1 day
      const isReturn = flight.return_date && Math.abs(flightReturnDate.getTime() - tripEndDate.getTime()) < 24 * 60 * 60 * 1000;
      
      if (isOutbound) {
        // Add arrival activity to first day
        const firstDay = days.find(d => d.day_number === 1);
        if (firstDay) {
          const result = await addActivity(
            firstDay.id,
            `Arrive via ${flight.airline} ${flight.flight_number}`,
            'flight',
            flight.price || 0,
            180, // 3 hours for international arrival
            `Flight from ${flight.origin} to ${flight.destination}`
          );
          console.log('Added arrival activity:', result);
        }
      }
      
      if (isReturn) {
        // Add departure activity to last day
        const lastDay = days[days.length - 1];
        if (lastDay) {
          const result = await addActivity(
            lastDay.id,
            `Depart via ${flight.airline} ${flight.flight_number}`,
            'flight',
            0, // Return flight cost already counted
            120, // 2 hours for departure
            `Return flight from ${flight.destination} to ${flight.origin}`
          );
          console.log('Added departure activity:', result);
        }
      } else {
        // If no return date specified, add as one-way flight to first day
        const firstDay = days.find(d => d.day_number === 1);
        if (firstDay) {
          const result = await addActivity(
            firstDay.id,
            `${flight.airline} ${flight.flight_number}`,
            'flight',
            flight.price || 0,
            180,
            `Flight from ${flight.origin} to ${flight.destination}`
          );
          console.log('Added one-way flight activity:', result);
        }
      }
    } catch (error) {
      console.error('Error adding flight activities:', error);
    }
  };

  const searchFlights = async (params: FlightSearchParams) => {
    try {
      // Check cache first
      const queryHash = btoa(JSON.stringify(params));
      const { data: cachedData } = await supabase
        .from('api_cache')
        .select('*')
        .eq('api_type', 'flights')
        .eq('query_hash', queryHash)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (cachedData) {
        // Use cached data
        return { success: true, data: cachedData.response_data };
      }

      // Simulate API call (in real app, this would be actual flight API)
      const mockFlights: Flight[] = [
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departureDate,
          return_date: params.returnDate,
          price: 650,
          airline: 'Japan Airlines',
          flight_number: 'JL006',
          api_response: {},
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departureDate,
          return_date: params.returnDate,
          price: 720,
          airline: 'ANA',
          flight_number: 'NH110',
          api_response: {},
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departureDate,
          return_date: params.returnDate,
          price: 580,
          airline: 'United Airlines',
          flight_number: 'UA78',
          api_response: {},
          created_at: new Date().toISOString()
        }
      ];

      // Cache the results
      await supabase
        .from('api_cache')
        .insert({
          api_type: 'flights',
          query_hash: queryHash,
          response_data: mockFlights,
          expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
        });

      return { success: true, data: mockFlights };
    } catch (error) {
      console.error('Error searching flights:', error);
      return { success: false, error };
    }
  };

  const getInsuranceQuote = async (params: InsuranceQuoteParams) => {
    try {
      // Check cache first
      const queryHash = btoa(JSON.stringify(params));
      const { data: cachedData } = await supabase
        .from('api_cache')
        .select('*')
        .eq('api_type', 'insurance')
        .eq('query_hash', queryHash)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (cachedData) {
        setInsurance(cachedData.response_data);
        return { success: true, data: cachedData.response_data };
      }

      // Calculate coverage based on policy type and destination risk
      const getCoverageDetails = (coverageType: string, destination: string, duration: number) => {
        const baseMultiplier = destination.toLowerCase().includes('japan') ? 1.2 : 
                              destination.toLowerCase().includes('europe') ? 1.1 : 
                              destination.toLowerCase().includes('asia') ? 0.9 : 1.0;
        
        const durationMultiplier = Math.max(1, duration / 7); // Longer trips cost more
        
        switch (coverageType.toLowerCase()) {
          case 'basic':
            return {
              coverage: 25000 * baseMultiplier,
              premium: (45 + (duration * 8)) * baseMultiplier
            };
          case 'premium':
            return {
              coverage: 75000 * baseMultiplier,
              premium: (85 + (duration * 12)) * baseMultiplier
            };
          case 'comprehensive':
            return {
              coverage: 150000 * baseMultiplier,
              premium: (125 + (duration * 18)) * baseMultiplier
            };
          default:
            return {
              coverage: 50000 * baseMultiplier,
              premium: (65 + (duration * 10)) * baseMultiplier
            };
        }
      };

      const coverageDetails = getCoverageDetails(params.coverage, params.destination, params.duration);
      
      // Generate multiple insurance options
      const mockInsurance: Insurance[] = [
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          policy_type: params.coverage,
          coverage_amount: coverageDetails.coverage,
          premium_cost: Math.round(coverageDetails.premium),
          provider: 'TravelGuard',
          policy_pdf_url: 'https://example.com/policy.pdf',
          api_response: {},
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          policy_type: params.coverage,
          coverage_amount: coverageDetails.coverage * 0.8,
          premium_cost: Math.round(coverageDetails.premium * 0.85),
          provider: 'WorldNomads',
          policy_pdf_url: 'https://example.com/policy2.pdf',
          api_response: {},
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          policy_type: params.coverage,
          coverage_amount: coverageDetails.coverage * 1.2,
          premium_cost: Math.round(coverageDetails.premium * 1.15),
          provider: 'Allianz Travel',
          policy_pdf_url: 'https://example.com/policy3.pdf',
          api_response: {},
          created_at: new Date().toISOString()
        }
      ];

      // Cache the results
      await supabase
        .from('api_cache')
        .insert({
          api_type: 'insurance',
          query_hash: queryHash,
          response_data: mockInsurance,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });

      // Save to insurance table
      await supabase
        .from('insurance')
        .insert(mockInsurance);

      setInsurance(mockInsurance);
      return { success: true, data: mockInsurance };
    } catch (error) {
      console.error('Error getting insurance quote:', error);
      return { success: false, error };
    }
  };

  const selectInsurance = async (insurancePolicy: Insurance) => {
    try {
      // Add insurance to selected insurance if not already selected
      if (!insurance.some(i => i.id === insurancePolicy.id)) {
        setInsurance(prev => [...prev, insurancePolicy]);
        
        // Try to save to database
        const { error } = await supabase
          .from('insurance')
          .insert({
            id: insurancePolicy.id,
            trip_id: insurancePolicy.trip_id,
            policy_type: insurancePolicy.policy_type,
            coverage_amount: insurancePolicy.coverage_amount,
            premium_cost: insurancePolicy.premium_cost,
            provider: insurancePolicy.provider,
            policy_pdf_url: insurancePolicy.policy_pdf_url,
            api_response: insurancePolicy.api_response
          });
        
        if (error) {
          console.error('Database error (continuing with local state):', error);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error selecting insurance:', error);
      // Still update local state even if database fails
      if (!insurance.some(i => i.id === insurancePolicy.id)) {
        setInsurance(prev => [...prev, insurancePolicy]);
      }
      return { success: true }; // Return success for local state update
    }
  };

  const deselectInsurance = async (insuranceId: string) => {
    try {
      // Remove insurance from selected insurance
      const insuranceToRemove = insurance.find(i => i.id === insuranceId);
      if (!insuranceToRemove) return { success: false, error: 'Insurance not found' };
      
      setInsurance(prev => prev.filter(i => i.id !== insuranceId));
      
      // Remove from database
      const { error } = await supabase
        .from('insurance')
        .delete()
        .eq('id', insuranceId);
      
      if (error) {
        console.error('Database error:', error);
        // Still continue with local state update for demo purposes
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deselecting insurance:', error);
      // Still update local state even if database fails
      setInsurance(prev => prev.filter(i => i.id !== insuranceId));
      return { success: false, error };
    }
  };

  const totalBudget = activities.reduce((sum, activity) => sum + activity.estimated_cost, 0) +
                     flights.reduce((sum, flight) => sum + (flight.price || 0), 0) +
                     insurance.reduce((sum, policy) => sum + (policy.premium_cost || 0), 0);

  // Calculate total cost considering number of travelers
  const totalCostWithTravelers = trip ? 
    (activities.reduce((sum, activity) => sum + activity.estimated_cost, 0) * (trip.number_of_travelers || 1)) +
    flights.reduce((sum, flight) => sum + (flight.price || 0), 0) +
    insurance.reduce((sum, policy) => sum + (policy.premium_cost || 0), 0)
    : 0;

  const addActivity = async (
    dayId: string, 
    title: string, 
    activityType: string = 'attraction',
    estimatedCost: number = 0,
    durationMinutes: number = 60,
    description: string = ''
  ) => {
    try {
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        day_id: dayId,
        title,
        description,
        activity_type: activityType as Activity['activity_type'],
        estimated_cost: estimatedCost,
        duration_minutes: durationMinutes,
        order_index: activities.filter(a => a.day_id === dayId).length,
        created_at: new Date().toISOString()
      };

      // Try to insert into database
      const { error } = await supabase
        .from('activities')
        .insert(newActivity);

      if (error) throw error;

      // Update local state
      setActivities(prev => [...prev, newActivity]);
      return { success: true, data: newActivity };
    } catch (error) {
      console.error('Error adding activity:', error);
      
      // Fallback: Add to local state even if database fails
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        day_id: dayId,
        title,
        description,
        activity_type: activityType as Activity['activity_type'],
        estimated_cost: estimatedCost,
        duration_minutes: durationMinutes,
        order_index: activities.filter(a => a.day_id === dayId).length,
        created_at: new Date().toISOString()
      };
      
      setActivities(prev => [...prev, newActivity]);
      return { success: true, data: newActivity };
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      // Try to delete from database
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;

      // Update local state
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting activity:', error);
      
      // Fallback: Remove from local state even if database fails
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
      return { success: true };
    }
  };

  return {
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
    refetch: fetchTripData
  };
};