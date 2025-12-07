export const shareService = {
  generateShareLink(habits, progress) {
    const data = {
      habits: habits.map(h => ({
        id: h.id,
        name: h.name,
        description: h.description,
        category: h.category,
        color: h.color,
        icon: h.icon
      })),
      progress: progress.map(p => ({
        habit_id: p.habit_id,
        date: p.date,
        done: p.done
      }))
    };

    const json = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(json));
    const baseUrl = window.location.href.split('?')[0].split('#')[0];

    return `${baseUrl}?view=public&data=${encoded}`;
  },

  parseShareLink() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const data = params.get('data');

    if (view !== 'public' || !data) {
      return null;
    }

    const decoded = decodeURIComponent(atob(data));
    const parsed = JSON.parse(decoded);

    if (!parsed.habits || !parsed.progress) {
      throw new Error('Nieprawidłowy format danych');
    }

    return {
      habits: parsed.habits,
      progress: parsed.progress,
      isReadOnly: true
    };
  },

  isReadOnlyMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'public';
  }
};
