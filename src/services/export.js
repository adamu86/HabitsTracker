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

  exportToCSV(habits) {
    const escapeCsvField = (field) => {
      const str = String(field ?? '');
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = "ID,Nazwa,Kategoria,Opis";
    const rows = habits.map(habit => 
      [
        habit.id,
        habit.name,
        habit.category,
        habit.description
      ].map(escapeCsvField).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
