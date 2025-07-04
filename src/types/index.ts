export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  estimated_budget: number;
  image_url: string;
  user_id: string;
  template_id?: string;
  created_at: string;
}

export interface Day {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  title: string;
  created_at: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  day_id: string;
  title: string;
  description?: string;
  activity_type: 'flight' | 'hotel' | 'attraction' | 'meal' | 'transport';
  estimated_cost: number;
  duration_minutes: number;
  order_index: number;
  created_at: string;
}

export interface TripTemplate {
  id: string;
  title: string;
  destination: string;
  duration_days: number;
  estimated_budget: number;
  image_url: string;
  description: string;
  days: {
    day_number: number;
    activities: Omit<Activity, 'id' | 'day_id' | 'created_at'>[];
  }[];
}