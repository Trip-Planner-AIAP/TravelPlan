import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Trip, Day, Activity, TripTemplate } from '../types';
import { tripTemplates } from '../data/tripTemplates';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTripFromTemplate = async (template: TripTemplate) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Calculate dates
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start trip in a week
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + template.duration_days - 1);

      // Create trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title: template.title,
          destination: template.destination,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          duration_days: template.duration_days,
          estimated_budget: template.estimated_budget,
          template_id: template.id,
          image_url: template.image_url
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // Create days and activities
      for (const templateDay of template.days) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + templateDay.day_number - 1);

        const { data: dayData, error: dayError } = await supabase
          .from('days')
          .insert({
            trip_id: tripData.id,
            day_number: templateDay.day_number,
            date: dayDate.toISOString().split('T')[0],
            title: `Day ${templateDay.day_number}`
          })
          .select()
          .single();

        if (dayError) throw dayError;

        // Create activities for this day
        if (templateDay.activities.length > 0) {
          const activities = templateDay.activities.map(activity => ({
            day_id: dayData.id,
            ...activity
          }));

          const { error: activitiesError } = await supabase
            .from('activities')
            .insert(activities);

          if (activitiesError) throw activitiesError;
        }
      }

      await fetchTrips();
      return { data: tripData, error: null };
    } catch (error) {
      console.error('Error creating trip:', error);
      return { error: error as Error };
    }
  };

  const createCustomTrip = async (title: string, destination: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2); // 3-day default trip

      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title,
          destination,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          duration_days: 3,
          estimated_budget: 500,
          image_url: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800'
        })
        .select()
        .single();

      if (error) throw error;

      // Create default days
      for (let i = 1; i <= 3; i++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + i - 1);

        await supabase
          .from('days')
          .insert({
            trip_id: data.id,
            day_number: i,
            date: dayDate.toISOString().split('T')[0],
            title: `Day ${i}`
          });
      }

      await fetchTrips();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating custom trip:', error);
      return { error: error as Error };
    }
  };

  return {
    trips,
    loading,
    templates: tripTemplates,
    createTripFromTemplate,
    createCustomTrip,
    refetch: fetchTrips
  };
};