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
  image_url: string;
  user_id: string;
  created_at: string;
}