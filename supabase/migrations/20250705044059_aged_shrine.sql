/*
  # Add travelers and budget management fields

  1. New Fields
    - Add `number_of_travelers` to trips table
    - Add `budget_per_person` to trips table
    - Add `budget_breakdown` JSONB field for category allocations
    - Add `budget_alerts_enabled` boolean field

  2. Updates
    - Update existing trips to have default values
    - Ensure budget calculations work with multiple travelers

  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns to trips table
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS number_of_travelers integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS budget_per_person numeric(10,2),
ADD COLUMN IF NOT EXISTS budget_breakdown jsonb DEFAULT '{"accommodation": 30, "food": 25, "activities": 25, "transport": 15, "misc": 5}'::jsonb,
ADD COLUMN IF NOT EXISTS budget_alerts_enabled boolean DEFAULT true;

-- Update existing trips to have budget_per_person based on estimated_budget
UPDATE trips 
SET budget_per_person = estimated_budget 
WHERE budget_per_person IS NULL;

-- Add check constraints
ALTER TABLE trips 
ADD CONSTRAINT trips_number_of_travelers_check CHECK (number_of_travelers > 0 AND number_of_travelers <= 20);

ALTER TABLE trips 
ADD CONSTRAINT trips_budget_per_person_check CHECK (budget_per_person >= 0);