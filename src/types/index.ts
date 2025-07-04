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

export interface Flight {
  id: string;
  trip_id: string;
  origin: string;
  destination: string;
  departure_date?: string;
  return_date?: string;
  price?: number;
  airline?: string;
  flight_number?: string;
  api_response?: any;
  created_at: string;
}

export interface Insurance {
  id: string;
  trip_id: string;
  policy_type: string;
  coverage_amount?: number;
  premium_cost?: number;
  provider?: string;
  policy_pdf_url?: string;
  api_response?: any;
  created_at: string;
}

export interface ApiCache {
  id: string;
  api_type: string;
  query_hash: string;
  response_data: any;
  expires_at: string;
  created_at: string;
}