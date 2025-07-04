/*
  # Trip Planning Schema

  1. New Tables
    - `trips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `destination` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `duration_days` (integer)
      - `estimated_budget` (decimal)
      - `template_id` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `days`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `day_number` (integer)
      - `date` (date)
      - `title` (text)
      - `created_at` (timestamp)

    - `activities`
      - `id` (uuid, primary key)
      - `day_id` (uuid, references days)
      - `title` (text)
      - `description` (text)
      - `activity_type` (text)
      - `estimated_cost` (decimal)
      - `duration_minutes` (integer)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  destination text NOT NULL,
  start_date date,
  end_date date,
  duration_days integer,
  estimated_budget decimal(10,2),
  template_id text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create days table
CREATE TABLE IF NOT EXISTS days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL,
  date date,
  title text DEFAULT 'Day 1',
  created_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid REFERENCES days(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  activity_type text DEFAULT 'attraction',
  estimated_cost decimal(8,2) DEFAULT 0,
  duration_minutes integer DEFAULT 60,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
CREATE POLICY "Users can manage their own trips"
  ON trips
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for days
CREATE POLICY "Users can manage days of their trips"
  ON days
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = days.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

-- RLS Policies for activities
CREATE POLICY "Users can manage activities of their trips"
  ON activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM days 
      JOIN trips ON trips.id = days.trip_id
      WHERE days.id = activities.day_id 
      AND trips.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON trips(user_id);
CREATE INDEX IF NOT EXISTS days_trip_id_idx ON days(trip_id);
CREATE INDEX IF NOT EXISTS activities_day_id_idx ON activities(day_id);