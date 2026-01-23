/*
  # Add scheduled_days column to habits table
  
  Adds support for specifying which days of the week a habit should be performed.
  Days are stored as a JSON array where:
  - 0 = Sunday
  - 1 = Monday
  - 2 = Tuesday
  - 3 = Wednesday
  - 4 = Thursday
  - 5 = Friday
  - 6 = Saturday
  
  Example: [1,3,5] means Monday, Wednesday, Friday
*/

ALTER TABLE habits ADD COLUMN IF NOT EXISTS scheduled_days jsonb DEFAULT '[0,1,2,3,4,5,6]';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_habits_scheduled_days ON habits USING gin(scheduled_days);
