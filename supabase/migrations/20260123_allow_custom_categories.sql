/*
  # Allow custom categories in habits
  
  Removes the CHECK constraint that limited categories to predefined values,
  allowing users to create and use custom category names.
  
  Previously allowed categories were:
  - Wellness
  - Learning
  - Fitness
  - Health
  - Productivity
  - Other
  
  Now any text value is allowed for the category field.
*/

-- Remove the CHECK constraint on category column
ALTER TABLE habits DROP CONSTRAINT IF EXISTS habits_category_check;

-- Add a new constraint that just ensures category is not empty (if provided)
ALTER TABLE habits ADD CONSTRAINT habits_category_not_empty CHECK (category IS NULL OR char_length(category) > 0);
