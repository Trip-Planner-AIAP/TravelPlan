/*
  # Update RLS policies for mock authentication

  1. Security Changes
    - Update RLS policies on all tables to work with mock user ID
    - Allow operations for the specific mock user ID: '550e8400-e29b-41d4-a716-446655440000'
    - Maintain security while enabling development with mock authentication

  2. Tables Updated
    - `trips` table: Allow CRUD operations for mock user
    - `days` table: Allow CRUD operations for trips owned by mock user
    - `activities` table: Allow CRUD operations for activities in trips owned by mock user

  3. Notes
    - This is for development purposes with mock authentication
    - In production, these policies should use auth.uid() with real Supabase authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own trips" ON trips;
DROP POLICY IF EXISTS "Users can manage days of their trips" ON days;
DROP POLICY IF EXISTS "Users can manage activities of their trips" ON activities;

-- Create new policies that work with mock authentication
CREATE POLICY "Mock user can manage trips"
  ON trips
  FOR ALL
  TO authenticated, anon
  USING (user_id = '550e8400-e29b-41d4-a716-446655440000')
  WITH CHECK (user_id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Mock user can manage days"
  ON days
  FOR ALL
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = days.trip_id 
      AND trips.user_id = '550e8400-e29b-41d4-a716-446655440000'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = days.trip_id 
      AND trips.user_id = '550e8400-e29b-41d4-a716-446655440000'
    )
  );

CREATE POLICY "Mock user can manage activities"
  ON activities
  FOR ALL
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM days 
      JOIN trips ON trips.id = days.trip_id
      WHERE days.id = activities.day_id 
      AND trips.user_id = '550e8400-e29b-41d4-a716-446655440000'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM days 
      JOIN trips ON trips.id = days.trip_id
      WHERE days.id = activities.day_id 
      AND trips.user_id = '550e8400-e29b-41d4-a716-446655440000'
    )
  );