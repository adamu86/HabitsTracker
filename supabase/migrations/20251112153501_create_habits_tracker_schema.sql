/*
  # Habits Tracker Schema

  ## Tables Created
  
  1. **habits**
     - `id` (uuid, primary key) - Unique identifier for each habit
     - `name` (text, required) - Name of the habit (3-50 characters)
     - `description` (text, optional) - Description of the habit (max 200 characters)
     - `category` (text, optional) - Category (Wellness, Learning, Fitness, Health, Productivity, Other)
     - `color` (text, required) - Hex color for visual identification
     - `icon` (text, optional) - Emoji or icon identifier
     - `created_at` (timestamptz) - Timestamp of creation
     - `updated_at` (timestamptz) - Timestamp of last update

  2. **progress**
     - `id` (uuid, primary key) - Unique identifier for each progress entry
     - `habit_id` (uuid, foreign key) - References habits table
     - `date` (date, required) - Date of the progress entry (YYYY-MM-DD)
     - `done` (boolean, required) - Whether the habit was completed
     - `created_at` (timestamptz) - Timestamp of creation
     - Unique constraint on (habit_id, date) to prevent duplicates

  ## Security
  
  - Enable RLS on both tables
  - Public read access for all habits and progress (for sharing functionality)
  - No authentication required (as per specification for vanilla JS app)

  ## Indexes
  
  - Index on progress.habit_id for faster queries
  - Index on progress.date for date-range queries
  - Unique index on (habit_id, date) combination
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  description text CHECK (description IS NULL OR char_length(description) <= 200),
  category text CHECK (category IN ('Wellness', 'Learning', 'Fitness', 'Health', 'Productivity', 'Other')),
  color text NOT NULL DEFAULT '#3b82f6',
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date date NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, date)
);

CREATE INDEX IF NOT EXISTS idx_progress_habit_id ON progress(habit_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to habits"
  ON habits FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to habits"
  ON habits FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to habits"
  ON habits FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to habits"
  ON habits FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to progress"
  ON progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to progress"
  ON progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to progress"
  ON progress FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to progress"
  ON progress FOR DELETE
  TO public
  USING (true);
