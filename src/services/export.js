export const exportService = {
  exportToJSON(habits, progress) {
    const data = {
      exportDate: new Date().toISOString(),
      habits: habits.map(h => ({
        id: h.id,
        name: h.name,
        description: h.description,
        category: h.category,
        color: h.color,
        icon: h.icon,
        scheduled_days: h.scheduled_days || [0, 1, 2, 3, 4, 5, 6],
        createdAt: h.created_at
      })),
      progress: progress.map(p => ({
        habitId: p.habit_id,
        date: p.date,
        done: p.done
      }))
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error('Invalid JSON: missing habits array');
      }
      if (!data.progress || !Array.isArray(data.progress)) {
        throw new Error('Invalid JSON: missing progress array');
      }

      // Store custom categories to localStorage
      const defaultCategoryNames = ['Wellness', 'Learning', 'Fitness', 'Health', 'Productivity', 'Other'];
      const customCategories = new Set();
      
      data.habits.forEach(h => {
        if (h.category && !defaultCategoryNames.includes(h.category)) {
          customCategories.add(h.category);
        }
      });

      if (customCategories.size > 0) {
        const storedCategories = JSON.parse(localStorage.getItem('custom_categories') || '[]');
        const categoryMap = new Map(storedCategories.map(c => [c.name, c]));
        
        customCategories.forEach(catName => {
          if (!categoryMap.has(catName)) {
            categoryMap.set(catName, { name: catName, icon: '🎯' });
          }
        });
        
        localStorage.setItem('custom_categories', JSON.stringify(Array.from(categoryMap.values())));
      }

      // Normalize habits for database insertion
      const habits = data.habits.map(h => ({
        name: h.name,
        description: h.description,
        category: h.category,
        color: h.color,
        icon: h.icon,
        scheduled_days: h.scheduled_days || [0, 1, 2, 3, 4, 5, 6]
      }));

      // Normalize progress for database insertion (will be matched by habit name)
      const progress = data.progress.map(p => ({
        habitId: p.habitId,
        date: p.date,
        done: p.done
      }));

      return { habits, progress };
    } catch (error) {
      throw new Error(`Failed to import JSON: ${error.message}`);
    }
  }
};
