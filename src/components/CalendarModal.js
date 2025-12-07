import { analyticsService } from '../services/analytics.js';
import { progressService } from '../services/supabase.js';

export class CalendarModal {
  constructor(habit, progressData, isReadOnly, onClose, onUpdate) {
    this.habit = habit;
    this.progressData = progressData;
    this.isReadOnly = isReadOnly;
    this.onClose = onClose;
    this.onUpdate = onUpdate;
    this.currentDate = new Date();
    this.currentDate.setDate(1);
  }

  async toggleDay(dateStr) {
    if (this.isReadOnly) return;

    try {
      const dateObj = new Date(dateStr + 'T00:00:00Z');
      await progressService.toggleProgress(this.habit.id, dateObj);
      if (this.onUpdate) {
        await this.onUpdate();
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji postępu:', error);
    }
  }

  isDayCompleted(dateStr) {
    return this.progressData.some(
      p => p.habit_id === this.habit.id && p.date === dateStr && p.done
    );
  }

  updateProgressData(newProgressData) {
    this.progressData = newProgressData;
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      this.updateCalendarDisplay(overlay);
    }
  }

  updateCalendarDisplay(overlay) {
    const calendarGrid = overlay.querySelector('#calendar-days');
    const monthHeader = overlay.querySelector('#calendar-month');
    const statsContainer = overlay.querySelector('.calendar-stats');

    if (calendarGrid) {
      calendarGrid.innerHTML = this.renderCalendarDays();
      this.attachDayButtonListeners(calendarGrid);
    }

    if (statsContainer) {
      const stats = this.getHabitStats();
      statsContainer.innerHTML = `
        <div class="stat-item">
          <div class="stat-label">Longest Streak</div>
          <div class="stat-number">${stats.longestStreak}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Days</div>
          <div class="stat-number">${stats.totalDays}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Completion</div>
          <div class="stat-number">${stats.completionRate}%</div>
        </div>
      `;
    }
  }

  attachDayButtonListeners(calendarGrid) {
    const dayButtons = calendarGrid.querySelectorAll('.calendar-day:not(.empty)');
    dayButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!btn.disabled) {
          const dateStr = btn.dataset.date;
          this.toggleDay(dateStr);
        }
      });
    });
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'calendar-modal-title');

    const stats = this.getHabitStats();

    overlay.innerHTML = `
      <div class="modal calendar-modal">
        <div class="modal-header">
          <div>
            <h2 id="calendar-modal-title" class="calendar-habit-title">
              <span class="calendar-habit-icon" style="color: ${this.habit.color}">
                ${this.habit.icon || '🎯'}
              </span>
              ${this.escapeHtml(this.habit.name)}
            </h2>
            <p>${this.escapeHtml(this.habit.description || '')}</p>
          </div>
          <button class="btn-close" aria-label="Zamknij">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="calendar-stats">
          <div class="stat-item">
            <div class="stat-label">Longest Streak</div>
            <div class="stat-number">${stats.longestStreak}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Days</div>
            <div class="stat-number">${stats.totalDays}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Completion</div>
            <div class="stat-number">${stats.completionRate}%</div>
          </div>
        </div>

        <div class="calendar-container">
          <div class="calendar-header">
            <button class="calendar-nav-btn" id="prev-month" aria-label="Poprzedni miesiąc">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h3 id="calendar-month">${this.formatMonth(this.currentDate)}</h3>
            <button class="calendar-nav-btn" id="next-month" aria-label="Następny miesiąc">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <div class="calendar-weekdays">
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
            <div class="weekday">Sun</div>
          </div>

          <div class="calendar-grid" id="calendar-days">
            ${this.renderCalendarDays()}
          </div>
        </div>

        <div class="calendar-legend">
          <div class="legend-item">
            <div class="legend-box completed"></div>
            <span>Completed</span>
          </div>
          <div class="legend-item">
            <div class="legend-box not-completed"></div>
            <span>Not completed</span>
          </div>
          <div class="legend-item">
            <div class="legend-box today"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.onClose();
      }
    });

    return overlay;
  }

  renderCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    let html = '';

    for (let i = 0; i < startingDayOfWeek; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const dateStr = analyticsService.formatDate(date);
      const isCompleted = this.isDayCompleted(dateStr);
      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;

      const dayClass = [
        'calendar-day',
        isCompleted ? 'completed' : '',
        isToday ? 'today' : '',
        isFuture && !this.isReadOnly ? 'future' : ''
      ].filter(Boolean).join(' ');

      html += `
        <button
          class="${dayClass}"
          data-date="${dateStr}"
          aria-label="${day} - ${isCompleted ? 'Completed' : 'Not completed'}"
          ${(this.isReadOnly || isFuture) ? 'disabled' : ''}
        >
          <span class="day-number">${day}</span>
          ${isCompleted ? '<span class="day-check">✓</span>' : ''}
        </button>
      `;
    }

    return html;
  }

  attachEventListeners(overlay) {
    const closeBtn = overlay.querySelector('.btn-close');
    const prevBtn = overlay.querySelector('#prev-month');
    const nextBtn = overlay.querySelector('#next-month');
    const calendarDays = overlay.querySelector('#calendar-days');

    closeBtn.addEventListener('click', this.onClose);

    prevBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.updateCalendar(overlay);
    });

    nextBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.updateCalendar(overlay);
    });

    calendarDays.addEventListener('click', (e) => {
      const dayBtn = e.target.closest('.calendar-day:not(.empty)');
      if (dayBtn && !dayBtn.disabled) {
        const dateStr = dayBtn.dataset.date;
        this.toggleDay(dateStr);
      }
    });

    document.addEventListener('keydown', this.handleEscape);
  }

  updateCalendar(overlay) {
    const monthHeader = overlay.querySelector('#calendar-month');
    const calendarGrid = overlay.querySelector('#calendar-days');

    monthHeader.textContent = this.formatMonth(this.currentDate);
    calendarGrid.innerHTML = this.renderCalendarDays();

    const dayButtons = calendarGrid.querySelectorAll('.calendar-day:not(.empty)');
    dayButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!btn.disabled) {
          const dateStr = btn.dataset.date;
          this.toggleDay(dateStr);
        }
      });
    });
  }

  formatMonth(date) {
    return date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
  }

  getHabitStats() {
    const habitProgress = this.progressData.filter(
      p => p.habit_id === this.habit.id && p.done
    );

    const longestStreak = analyticsService.getStreakCount(this.progressData, this.habit.id);
    const completionRate = habitProgress.length > 0
      ? Math.round((habitProgress.length / 365) * 100)
      : 0;

    return {
      longestStreak,
      totalDays: habitProgress.length,
      completionRate: Math.min(completionRate, 100)
    };
  }

  handleEscape = (e) => {
    if (e.key === 'Escape') {
      this.onClose();
    }
  };

  destroy() {
    document.removeEventListener('keydown', this.handleEscape);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
