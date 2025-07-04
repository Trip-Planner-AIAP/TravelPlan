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
        setFlights(cachedData.response_data);
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

      // Save to flights table
      await supabase
        .from('flights')
        .insert(mockFlights);

      setFlights(mockFlights);
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

      // Simulate API call
      const mockInsurance: Insurance[] = [
        {
          id: crypto.randomUUID(),
          trip_id: tripId,
          policy_type: params.coverage,
          coverage_amount: 50000,
          premium_cost: 85,
          provider: 'TravelGuard',
          policy_pdf_url: 'https://example.com/policy.pdf',
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

  const totalBudget = activities.reduce((sum, activity) => sum + activity.estimated_cost, 0) +
                     flights.reduce((sum, flight) => sum + (flight.price || 0), 0) +
                     insurance.reduce((sum, policy) => sum + (policy.premium_cost || 0), 0);

  const addActivity = async (dayId: string, title: string, activityType: string = 'attraction') => {
    try {
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        day_id: dayId,
        title,
        description: '',
        activity_type: activityType as Activity['activity_type'],
        estimated_cost: 0,
        duration_minutes: 60,
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
        description: '',
        activity_type: activityType as Activity['activity_type'],
        estimated_cost: 0,
        duration_minutes: 60,
        order_index: activities.filter(a => a.day_id === dayId).length,
        created_at: new Date().toISOString()
      };
      
      setActivities(prev => [...prev, newActivity]);
      return { success: true, data: newActivity };
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
    searchFlights,
    getInsuranceQuote,
    refetch: fetchTripData
  };
};