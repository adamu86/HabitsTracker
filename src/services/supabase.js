import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL lub klucz nie są skonfigurowane w zmiennych środowiskowych');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const habitService = {
  async getAllHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createHabit(habit) {
    const { data, error } = await supabase
      .from('habits')
      .insert([habit])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateHabit(id, updates) {
    const { data, error } = await supabase
      .from('habits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteHabit(id) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const progressService = {
  async getProgress() {
    const { data, error } = await supabase
      .from('progress')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async toggleProgress(habitId, date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('habit_id', habitId)
      .eq('date', dateStr)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('progress')
        .update({ done: !existing.done })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('progress')
        .insert([{ habit_id: habitId, date: dateStr, done: true }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async getProgressForHabit(habitId, startDate, endDate) {
    const query = supabase
      .from('progress')
      .select('*')
      .eq('habit_id', habitId)
      .eq('done', true);

    if (startDate) {
      query.gte('date', startDate);
    }

    if (endDate) {
      query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
};
