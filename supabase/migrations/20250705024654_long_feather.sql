/*
  # Fix RLS policies for mock authentication

  1. Security Changes
    - Update RLS policies to properly handle the mock user ID
    - Ensure all CRUD operations work for the hardcoded user ID
    - Fix INSERT policies that were causing 401 errors

  2. Tables Updated
    - All tables with RLS enabled
    - Proper policies for anon and authenticated roles
*/

-- Fix trips table policies
DROP POLICY IF EXISTS "Mock user can manage trips" ON trips;
CREATE POLICY "Mock user can manage trips"
  ON trips
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid)
  WITH CHECK (user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid);

-- Fix days table policies
DROP POLICY IF EXISTS "Mock user can manage days" ON days;
CREATE POLICY "Mock user can manage days"
  ON days
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = days.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = days.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix activities table policies
DROP POLICY IF EXISTS "Mock user can manage activities" ON activities;
CREATE POLICY "Mock user can manage activities"
  ON activities
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM days 
      JOIN trips ON trips.id = days.trip_id
      WHERE days.id = activities.day_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM days 
      JOIN trips ON trips.id = days.trip_id
      WHERE days.id = activities.day_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix flights table policies
DROP POLICY IF EXISTS "Mock user can manage flights" ON flights;
CREATE POLICY "Mock user can manage flights"
  ON flights
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = flights.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = flights.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix insurance table policies
DROP POLICY IF EXISTS "Mock user can manage insurance" ON insurance;
CREATE POLICY "Mock user can manage insurance"
  ON insurance
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = insurance.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = insurance.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix checklist table policies
DROP POLICY IF EXISTS "Users can manage their trip checklists" ON checklist;
CREATE POLICY "Mock user can manage checklist"
  ON checklist
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = checklist.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = checklist.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix essentials table policies
DROP POLICY IF EXISTS "Users can manage their trip essentials" ON essentials;
CREATE POLICY "Mock user can manage essentials"
  ON essentials
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = essentials.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = essentials.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix ai_usage table policies
DROP POLICY IF EXISTS "Users can manage their AI usage" ON ai_usage;
CREATE POLICY "Mock user can manage ai_usage"
  ON ai_usage
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = ai_usage.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = ai_usage.trip_id 
      AND trips.user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid
    )
  );

-- Fix api_cache table policies (update existing ones)
DROP POLICY IF EXISTS "Anyone can read api cache" ON api_cache;
DROP POLICY IF EXISTS "Anyone can manage api cache" ON api_cache;

CREATE POLICY "Anyone can read api cache"
  ON api_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert api cache"
  ON api_cache
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update api cache"
  ON api_cache
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete api cache"
  ON api_cache
  FOR DELETE
  TO anon, authenticated
  USING (true);