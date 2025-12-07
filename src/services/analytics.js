export const analyticsService = {
  getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  },

  getWeekDates(startDate) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  },

  formatDate(date) {
    return date.toISOString().split('T')[0];
  },

  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  getStreakCount(progressData, habitId) {
    if (!progressData || progressData.length === 0) return 0;

    const habitProgress = progressData
      .filter(p => p.habit_id === habitId && p.done)
      .map(p => {
        const date = new Date(p.date);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .sort((a, b) => a - b);

    if (habitProgress.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < habitProgress.length; i++) {
      const prevDate = new Date(habitProgress[i - 1]);
      const currentDate = new Date(habitProgress[i]);
      const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (dayDiff > 1) {
        currentStreak = 1;
      }
    }

    return maxStreak;
  },

  getCurrentStreakCount(progressData, habitId) {
    if (!progressData || progressData.length === 0) return 0;

    const habitProgress = progressData
      .filter(p => p.habit_id === habitId && p.done)
      .map(p => {
        const date = new Date(p.date);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .sort((a, b) => b - a);

    if (habitProgress.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastProgress = habitProgress[0];

    if (lastProgress.getTime() !== today.getTime() && lastProgress.getTime() !== yesterday.getTime()) {
      return 0;
    }

    let currentStreak = 1;
    let currentDate = new Date(lastProgress);
    currentDate.setDate(currentDate.getDate() - 1);

    for (let i = 1; i < habitProgress.length; i++) {
      if (habitProgress[i].getTime() === currentDate.getTime()) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  },

  getLongestStreak(habits, progressData) {
    let longest = 0;
    let habitWithLongest = null;

    habits.forEach(habit => {
      const streak = this.getStreakCount(progressData, habit.id);
      if (streak > longest) {
        longest = streak;
        habitWithLongest = habit;
      }
    });

    return { streak: longest, habit: habitWithLongest };
  },

  getCurrentStreak(habits, progressData) {
    let longest = 0;
    let habitWithLongest = null;

    habits.forEach(habit => {
      const streak = this.getCurrentStreakCount(progressData, habit.id);
      if (streak > longest) {
        longest = streak;
        habitWithLongest = habit;
      }
    });

    return { streak: longest, habit: habitWithLongest };
  },

  getWeeklyStats(habits, progressData, weekStart) {
    const weekDates = this.getWeekDates(weekStart);
    const stats = [];

    weekDates.forEach(date => {
      const dateStr = this.formatDate(date);
      const completed = progressData.filter(
        p => p.date === dateStr && p.done
      ).length;

      stats.push({
        date: dateStr,
        day: date.toLocaleDateString('pl-PL', { weekday: 'short' }),
        completed,
        total: habits.length
      });
    });

    return stats;
  },

  getCompletionRate(habits, progressData, weekStart) {
    const weekDates = this.getWeekDates(weekStart);
    const totalPossible = habits.length * weekDates.length;

    if (totalPossible === 0) return 0;

    const completed = progressData.filter(p => {
      const progressDate = new Date(p.date);
      return p.done && weekDates.some(wd =>
        this.formatDate(wd) === this.formatDate(progressDate)
      );
    }).length;

    return Math.round((completed / totalPossible) * 100);
  },

  getCategoryDistribution(habits, progressData) {
    const categories = {};

    habits.forEach(habit => {
      const category = habit.category || 'Other';
      if (!categories[category]) {
        categories[category] = { count: 0, completed: 0 };
      }
      categories[category].count++;

      const habitProgress = progressData.filter(
        p => p.habit_id === habit.id && p.done
      );
      categories[category].completed += habitProgress.length;
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      value: data.count,
      completed: data.completed
    }));
  },

  isPerfectDay(habits, progressData) {
    if (habits.length === 0) return false;
    
    const today = this.formatDate(new Date());
    
    return habits.every(habit => {
      return progressData.some(p => 
        p.habit_id === habit.id && 
        p.date === today && 
        p.done === true
      );
    });
  },
};
