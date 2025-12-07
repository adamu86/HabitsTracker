export const themeService = {
  THEME_KEY: 'habitsTracker:theme',

  init() {
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
  },

  getTheme() {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved) return saved;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  },

  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },

  applyTheme(theme) {
    document.body.className = `theme-${theme}`;
  }
};
