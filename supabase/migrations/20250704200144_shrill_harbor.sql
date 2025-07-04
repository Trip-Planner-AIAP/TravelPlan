/*
  # Create planner board tables

  1. New Tables
    - `flights` - Store flight search results and bookings
    - `insurance` - Store insurance quotes and policies
    - `api_cache` - Cache API responses to handle rate limits

  2. Security
    - Enable RLS on all new tables
    - Add policies for mock user access
*/

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_date date,
  return_date date,
  price numeric(8,2),
  airline text,
  flight_number text,
  api_response jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mock user can manage flights"
  ON flights
  FOR ALL
  TO authenticated, anon
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

-- Insurance table
CREATE TABLE IF NOT EXISTS insurance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  policy_type text DEFAULT 'basic',
  coverage_amount numeric(10,2) DEFAULT 0,
  premium_cost numeric(8,2) DEFAULT 0,
  provider text,
  policy_pdf_url text,
  api_response jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mock user can manage insurance"
  ON insurance
  FOR ALL
  TO authenticated, anon
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

-- API Cache table
CREATE TABLE IF NOT EXISTS api_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_type text NOT NULL,
  query_hash text UNIQUE NOT NULL,
  response_data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read api cache"
  ON api_cache
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can manage api cache"
  ON api_cache
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS flights_trip_id_idx ON flights(trip_id);
CREATE INDEX IF NOT EXISTS insurance_trip_id_idx ON insurance(trip_id);
CREATE INDEX IF NOT EXISTS api_cache_query_hash_idx ON api_cache(query_hash);
CREATE INDEX IF NOT EXISTS api_cache_expires_at_idx ON api_cache(expires_at);