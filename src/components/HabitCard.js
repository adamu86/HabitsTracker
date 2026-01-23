import { analyticsService } from '../services/analytics.js';
import { progressService } from '../services/supabase.js';

const CATEGORY_ICONS = {
  'Wellness': '🧘',
  'Learning': '📚',
  'Fitness': '💪',
  'Health': '❤️',
  'Productivity': '🧠',
  'Other': '🎯'
};

const DAYS_OF_WEEK = [
  { index: 0, short: 'Sun' },
  { index: 1, short: 'Mon' },
  { index: 2, short: 'Tue' },
  { index: 3, short: 'Wed' },
  { index: 4, short: 'Thu' },
  { index: 5, short: 'Fri' },
  { index: 6, short: 'Sat' }
];

export class HabitCard {
  constructor(habit, progressData, weekStart, isReadOnly, onUpdate, onOpenCalendar) {
    this.habit = habit;
    this.progressData = progressData;
    this.weekStart = weekStart;
    this.isReadOnly = isReadOnly;
    this.onUpdate = onUpdate;
    this.onOpenCalendar = onOpenCalendar;
  }

  async toggleDay(date) {
    if (this.isReadOnly) return;

    try {
      await progressService.toggleProgress(this.habit.id, date);
      if (this.onUpdate) {
        await this.onUpdate();
      }
    } catch (error) {
      console.error('Error while updating progress:', error);
      alert('Failed to update progress. Try again.');
    }
  }

  isDayCompleted(date) {
    const dateStr = analyticsService.formatDate(date);
    return this.progressData.some(
      p => p.habit_id === this.habit.id && p.date === dateStr && p.done
    );
  }

  isScheduledDay(dayOfWeek) {
    if (!this.habit.scheduled_days || this.habit.scheduled_days.length === 0) {
      return true;
    }
    return this.habit.scheduled_days.includes(dayOfWeek);
  }

  getScheduledDaysText() {
    if (!this.habit.scheduled_days || this.habit.scheduled_days.length === 0) {
      return '';
    }
    
    const allDaysSelected = this.habit.scheduled_days.length === 7;
    if (allDaysSelected) {
      return 'Every day';
    }

    return this.habit.scheduled_days
      .map(dayIndex => DAYS_OF_WEEK[dayIndex].short)
      .join(', ');
  }

  render() {
    const weekDates = analyticsService.getWeekDates(this.weekStart);
    const icon = this.habit.icon || CATEGORY_ICONS[this.habit.category] || CATEGORY_ICONS['Other'];

    const card = document.createElement('div');
    card.className = 'habit-card';
    card.style.borderColor = this.habit.color || '#3b82f6';

    card.innerHTML = `
      <div class="habit-header habit-clickable" data-habit-id="${this.habit.id}">
        <div class="habit-icon" style="background-color: ${this.habit.color}20; color: ${this.habit.color}">
          ${icon}
        </div>
        <div class="habit-info">
          <h3>${this.escapeHtml(this.habit.name)}</h3>
          ${this.habit.description ? `<p>${this.escapeHtml(this.habit.description)}</p>` : ''}
          ${this.getScheduledDaysText() ? `<p class="scheduled-days">${this.getScheduledDaysText()}</p>` : ''}
        </div>
        ${!this.isReadOnly ? `
          <div class="habit-actions">
            <button class="btn-ghost edit-btn" aria-label="Edit habit" data-habit-id="${this.habit.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-ghost delete-btn" aria-label="Delete habit" data-habit-id="${this.habit.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        ` : ''}
      </div>
      <div class="week-grid">
        ${weekDates.map(date => this.renderDayButton(date)).join('')}
      </div>
    `;

    const dayButtons = card.querySelectorAll('.day-button');
    dayButtons.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDay(weekDates[index]);
      });
    });

    const habitHeader = card.querySelector('.habit-clickable');
    habitHeader.addEventListener('click', () => {
      if (this.onOpenCalendar) {
        this.onOpenCalendar(this.habit);
      }
    });

    const editBtn = card.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => e.stopPropagation());
    }

    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => e.stopPropagation());
    }

    return card;
  }

  renderDayButton(date) {
    const completed = this.isDayCompleted(date);
    const isToday = analyticsService.isToday(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isFuture = date > new Date();
    const dayOfWeek = date.getDay();
    const isScheduled = this.isScheduledDay(dayOfWeek);

    const buttonClass = [
      'day-button',
      completed ? 'completed' : '',
      isToday ? 'today' : '',
      !isScheduled ? 'not-scheduled' : ''
    ].filter(Boolean).join(' ');

    return `
      <button
        class="${buttonClass}"
        aria-label="${dayName} - ${completed ? 'Completed' : 'Not completed'}"
        ${this.isReadOnly || isFuture || !isScheduled ? 'disabled' : ''}
        title="${!isScheduled ? 'Habit not scheduled on this day' : ''}\"
      >
        <span class="day-label">${dayName}</span>
        ${completed ? '<span class="check-icon">✓</span>' : ''}
      </button>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
