/*
  # Update RLS policies for new user UUID

  1. Security
    - Update all RLS policies to use the correct user UUID
    - Maintain existing security structure
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Mock user can manage trips" ON trips;
DROP POLICY IF EXISTS "Mock user can manage days" ON days;
DROP POLICY IF EXISTS "Mock user can manage activities" ON activities;

-- Create new policies with the correct user UUID
CREATE POLICY "Mock user can manage trips"
  ON trips
  FOR ALL
  TO authenticated, anon
  USING (user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid)
  WITH CHECK (user_id = 'fec18839-8366-4317-b674-1b04a4a9b8bd'::uuid);

CREATE POLICY "Mock user can manage days"
  ON days
  FOR ALL
  TO authenticated, anon
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

CREATE POLICY "Mock user can manage activities"
  ON activities
  FOR ALL
  TO authenticated, anon
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