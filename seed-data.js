import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const demoHabits = [
  {
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness',
    category: 'Wellness',
    color: '#93c5fd',
    icon: '🧘'
  },
  {
    name: 'Read 30 Pages',
    description: 'Daily reading habit',
    category: 'Learning',
    color: '#86efac',
    icon: '📚'
  },
  {
    name: 'Exercise',
    description: '30 min workout',
    category: 'Fitness',
    color: '#fdba74',
    icon: '💪'
  },
  {
    name: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated',
    category: 'Health',
    color: '#d8b4fe',
    icon: '❤️'
  }
];

async function getWeekDates() {
  const dates = [];
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

async function seedData() {
  console.log('🌱 Rozpoczynam seedowanie danych...');

  try {
    const { data: existingHabits } = await supabase
      .from('habits')
      .select('id');

    if (existingHabits && existingHabits.length > 0) {
      console.log('⚠️  Baza danych zawiera już dane. Pomijam seedowanie.');
      return;
    }

    console.log('📝 Tworzę przykładowe nawyki...');
    const { data: createdHabits, error: habitsError } = await supabase
      .from('habits')
      .insert(demoHabits)
      .select();

    if (habitsError) {
      throw habitsError;
    }

    console.log(`✅ Utworzono ${createdHabits.length} nawyków`);

    const weekDates = await getWeekDates();
    const progressData = [];

    createdHabits.forEach((habit, index) => {
      weekDates.forEach((date, dayIndex) => {
        const shouldComplete = Math.random() > 0.3;

        if (index === 0) {
          if (dayIndex < 6) progressData.push({ habit_id: habit.id, date, done: true });
        } else if (index === 1) {
          if ([0, 2, 3, 5].includes(dayIndex)) progressData.push({ habit_id: habit.id, date, done: true });
        } else if (index === 2) {
          if ([0, 1, 3, 4, 5].includes(dayIndex)) progressData.push({ habit_id: habit.id, date, done: true });
        } else if (index === 3) {
          if ([0, 1, 2, 4, 5].includes(dayIndex)) progressData.push({ habit_id: habit.id, date, done: true });
        }
      });
    });

    if (progressData.length > 0) {
      console.log('📊 Tworzę przykładowy postęp...');
      const { error: progressError } = await supabase
        .from('progress')
        .insert(progressData);

      if (progressError) {
        throw progressError;
      }

      console.log(`✅ Utworzono ${progressData.length} wpisów postępu`);
    }

    console.log('🎉 Seedowanie zakończone pomyślnie!');
  } catch (error) {
    console.error('❌ Błąd podczas seedowania:', error);
    process.exit(1);
  }
}

seedData();
