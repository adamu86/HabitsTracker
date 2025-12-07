import { habitService, progressService } from './services/supabase.js';
import { analyticsService } from './services/analytics.js';
import { shareService } from './services/share.js';
import { themeService } from './services/theme.js';
import { exportService } from './services/export.js';
import { HabitCard } from './components/HabitCard.js';
import { HabitModal } from './components/HabitModal.js';
import { ShareModal } from './components/ShareModal.js';
import { CalendarModal } from './components/CalendarModal.js';
import { Charts } from './components/Charts.js';

export class App {
  constructor() {
    this.habits = [];
    this.progress = [];
    this.weekStart = analyticsService.getWeekStart();
    this.isReadOnly = false;
    this.currentModal = null;
    this.charts = null;
    this.sortBy = 'name';
  }

  async init() {
    themeService.init();

    const sharedData = shareService.parseShareLink();
    if (sharedData) {
      this.habits = sharedData.habits;
      this.progress = sharedData.progress;
      this.isReadOnly = true;
    } else {
      await this.loadData();
    }

    this.render();
    this.attachEventListeners();
  }

  async loadData() {
    try {
      this.habits = await habitService.getAllHabits();
      this.progress = await progressService.getProgress();
    } catch (error) {
      console.error('Błąd podczas wczytywania danych:', error);
      alert('Wystąpił błąd podczas wczytywania danych. Odśwież stronę.');
    }
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    if (this.isReadOnly) {
      const banner = document.createElement('div');
      banner.className = 'read-only-banner';
      banner.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <strong>Viewing shared dashboard in read-only mode</strong>
      `;
      app.appendChild(banner);
    }

    app.appendChild(this.renderHeader());
    app.appendChild(this.renderMainContent());
  }

  renderHeader() {
    const isPerfect = analyticsService.isPerfectDay(this.habits, this.progress);
    const header = document.createElement('header');
    header.className = 'header';

    const theme = themeService.getTheme();

    header.innerHTML = `
      <div class="header-left">
        <div class="logo">🔥</div>
        <div class="header-text">
          <h1>Habits Tracker</h1>
          <p>Build better habits, one day at a time</p>
        </div>
        ${isPerfect ? '<h2 class="trophy">🏆 All today\'s habits done!</h2>' : ''}
      </div>
      <div class="header-actions">
      <select id="sort-select" style="padding: 8px; border-radius: 6px; border: 1px solid #ccc; margin-right: 8px;">
        <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Name A-Z</option>
        <option value="category" ${this.sortBy === 'category' ? 'selected' : ''}>Category</option>
      </select>
        <button class="btn btn-icon" id="theme-toggle" aria-label="Przełącz motyw">
          ${theme === 'dark' ? `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          `}
        </button>
        ${!this.isReadOnly ? `
          <button class="btn btn-secondary" id="export-btn-json" aria-label="Eksportuj nawyki do JSON">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="8 17 12 21 16 17"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
            </svg>
            JSON
          </button>
          <button class="btn btn-secondary" id="export-btn-csv" aria-label="Eksportuj nawyki do CSV">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="8 17 12 21 16 17"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
            </svg>
            CSV
          </button>
          <button class="btn btn-secondary" id="share-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
          <button class="btn btn-primary" id="add-habit-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Habit
          </button>
        ` : ''}
      </div>
    `;

    return header;
  }

  renderMainContent() {
    const main = document.createElement('main');
    main.className = 'main-content';

    const habitsSection = document.createElement('div');

    if (this.habits.length === 0) {
      habitsSection.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎯</div>
          <h3>No habits yet</h3>
          <p>Start building better habits by adding your first habit!</p>
          ${!this.isReadOnly ? `
            <button class="btn btn-primary" id="empty-add-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Your First Habit
            </button>
          ` : ''}
        </div>
      `;
    } else {
      const grid = document.createElement('div');
      grid.className = 'habits-grid';

      const sortedHabits = [...this.habits].sort((a, b) => {
        if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (this.sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });

      sortedHabits.forEach(habit => {
        const card = new HabitCard(
          habit,
          this.progress,
          this.weekStart,
          this.isReadOnly,
          () => this.handleUpdate(),
          (h) => this.openCalendarModal(h)
        );
        grid.appendChild(card.render());
      });

      habitsSection.appendChild(grid);
    }

    const sidebar = this.renderSidebar();

    main.appendChild(habitsSection);
    main.appendChild(sidebar);

    return main;
  }

  renderSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    const longestStreakData = analyticsService.getLongestStreak(this.habits, this.progress);
    const currentStreakData = analyticsService.getCurrentStreak(this.habits, this.progress);
    const completionRate = analyticsService.getCompletionRate(this.habits, this.progress, this.weekStart);

    sidebar.innerHTML = `
      <div class="stat-card streak">
        <div class="stat-header">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <h4>Longest Streak</h4>
          </div>
        </div>
        <div class="stat-value">
          🔥 ${longestStreakData.streak} day${longestStreakData.streak !== 1 ? 's' : ''}
        </div>
      </div>

      <div class="stat-card">
        <div class="stats-grid">
          <div class="stat-item">
            <h4>Total Habits</h4>
            <div class="value">${this.habits.length}</div>
          </div>
          <div class="stat-item">
            <h4>This Week</h4>
            <div class="value">${completionRate}%</div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>Category Distribution</h3>
        <div class="chart-container">
          <canvas id="category-chart"></canvas>
        </div>
      </div>

      <div class="chart-card">
        <h3>Weekly Progress</h3>
        <div class="chart-container">
          <canvas id="weekly-chart"></canvas>
        </div>
      </div>
    `;

    return sidebar;
  }

  attachEventListeners() {
    const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.render();
          this.attachEventListeners();
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        themeService.toggleTheme();
        this.render();
        this.attachEventListeners();
        this.renderCharts();
      });
    }

    if (!this.isReadOnly) {
      const addBtn = document.getElementById('add-habit-btn');
      const emptyAddBtn = document.getElementById('empty-add-btn');
      const exportBtnJSON = document.getElementById('export-btn-json');
      const exportBtnCSV = document.getElementById('export-btn-csv');
      const shareBtn = document.getElementById('share-btn');

      if (addBtn) {
        addBtn.addEventListener('click', () => this.openAddModal());
      }

      if (emptyAddBtn) {
        emptyAddBtn.addEventListener('click', () => this.openAddModal());
      }

      if (exportBtnJSON) {
        exportBtnJSON.addEventListener('click', () => {
          exportService.exportToJSON(this.habits, this.progress);
        });
      }

      if (exportBtnCSV) {
        exportBtnCSV.addEventListener('click', () => {
          exportService.exportToCSV(this.habits);
        });
      }

      if (shareBtn) {
        shareBtn.addEventListener('click', () => this.openShareModal());
      }

      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const habitId = btn.dataset.habitId;
          const habit = this.habits.find(h => h.id === habitId);
          if (habit) {
            this.openEditModal(habit);
          }
        });
      });

      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const habitId = btn.dataset.habitId;
          this.deleteHabit(habitId);
        });
      });
    }

    this.renderCharts();
  }

  renderCharts() {
    if (this.charts) {
      this.charts.destroy();
    }

    this.charts = new Charts(this.habits, this.progress, this.weekStart);

    const weeklyContainer = document.querySelector('.chart-card:has(#weekly-chart)');
    const categoryContainer = document.querySelector('.chart-card:has(#category-chart)');

    if (weeklyContainer) {
      this.charts.renderWeeklyProgress(weeklyContainer);
    }

    if (categoryContainer) {
      this.charts.renderCategoryDistribution(categoryContainer);
    }
  }

  openAddModal() {
    this.currentModal = new HabitModal(
      async (habitData) => {
        await habitService.createHabit(habitData);
        await this.handleUpdate();
      },
      () => this.closeModal()
    );

    document.body.appendChild(this.currentModal.render());
  }

  openEditModal(habit) {
    this.currentModal = new HabitModal(
      async (habitData) => {
        await habitService.updateHabit(habit.id, habitData);
        await this.handleUpdate();
      },
      () => this.closeModal(),
      habit
    );

    document.body.appendChild(this.currentModal.render());
  }

  openShareModal() {
    this.currentModal = new ShareModal(
      this.habits,
      this.progress,
      () => this.closeModal()
    );

    document.body.appendChild(this.currentModal.render());
  }

  openCalendarModal(habit) {
    this.currentModal = new CalendarModal(
      habit,
      this.progress,
      this.isReadOnly,
      () => this.closeModal(),
      async () => {
        await this.loadData();
        this.currentModal.updateProgressData(this.progress);
      }
    );

    document.body.appendChild(this.currentModal.render());
  }

  closeModal() {
    if (this.currentModal) {
      const overlay = document.querySelector('.modal-overlay');
      if (overlay) {
        overlay.remove();
      }
      if (this.currentModal.destroy) {
        this.currentModal.destroy();
      }
      this.currentModal = null;
    }
  }

  async deleteHabit(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    const confirmed = confirm(`Czy na pewno chcesz usunąć nawyk "${habit.name}"? Ta akcja jest nieodwracalna.`);
    if (!confirmed) return;

    try {
      await habitService.deleteHabit(habitId);
      await this.handleUpdate();
    } catch (error) {
      console.error('Błąd podczas usuwania nawyku:', error);
      alert('Nie udało się usunąć nawyku. Spróbuj ponownie.');
    }
  }

  async handleUpdate() {
    await this.loadData();
    this.render();
    this.attachEventListeners();
  }
}
