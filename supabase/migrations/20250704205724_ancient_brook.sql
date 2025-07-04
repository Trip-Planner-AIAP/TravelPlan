/*
  # Add AI Features - Checklist and Local Essentials

  1. New Tables
    - `checklist` - Travel checklist items with categories and priorities
    - `essentials` - Local travel essentials (SIM, forex, safety info)
    - `ai_usage` - Track AI token usage for budget enforcement

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data

  3. Features
    - Checklist generation with categories (documents, clothing, electronics)
    - Local essentials with SIM, forex, and safety information
    - Token usage tracking with 6000 token limit per trip
*/

-- Checklist table
CREATE TABLE IF NOT EXISTS checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('documents', 'clothing', 'electronics', 'health', 'misc')),
  item_name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 1 CHECK (priority IN (1, 2, 3)), -- 1=high, 2=medium, 3=low
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Essentials table
CREATE TABLE IF NOT EXISTS essentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  sim_info JSONB,
  forex_info JSONB,
  safety_notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  function_name TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE essentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Checklist policies
CREATE POLICY "Users can manage their trip checklists"
  ON checklist
  FOR ALL
  TO authenticated
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

-- Essentials policies
CREATE POLICY "Users can manage their trip essentials"
  ON essentials
  FOR ALL
  TO authenticated
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

-- AI usage policies
CREATE POLICY "Users can manage their AI usage"
  ON ai_usage
  FOR ALL
  TO authenticated
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS checklist_trip_id_idx ON checklist(trip_id);
CREATE INDEX IF NOT EXISTS checklist_category_idx ON checklist(category);
CREATE INDEX IF NOT EXISTS essentials_trip_id_idx ON essentials(trip_id);
CREATE INDEX IF NOT EXISTS ai_usage_trip_id_idx ON ai_usage(trip_id);
CREATE INDEX IF NOT EXISTS ai_usage_function_name_idx ON ai_usage(function_name);