import { analyticsService } from '../services/analytics.js';

const CATEGORY_COLORS = {
  'Wellness': '#93c5fd',
  'Learning': '#86efac',
  'Fitness': '#fdba74',
  'Health': '#fca5a5',
  'Productivity': '#d8b4fe',
  'Other': '#bfdbfe'
};

export class Charts {
  constructor(habits, progress, weekStart) {
    this.habits = habits;
    this.progress = progress;
    this.weekStart = weekStart;
    this.weeklyChart = null;
    this.categoryChart = null;
  }

  renderWeeklyProgress(container) {
    const canvas = container.querySelector('#weekly-chart');
    if (!canvas) return;

    const stats = analyticsService.getWeeklyStats(
      this.habits,
      this.progress,
      this.weekStart
    );

    const ctx = canvas.getContext('2d');

    if (this.weeklyChart) {
      this.weeklyChart.destroy();
    }

    const isDark = document.body.classList.contains('theme-dark');
    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    this.weeklyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.map(s => s.day),
        datasets: [{
          label: 'Completed Habits',
          data: stats.map(s => s.completed),
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.y} z ${stats[context.dataIndex].total} nawyków`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: textColor
            },
            grid: {
              color: gridColor
            },
            border: {
              display: false
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        }
      }
    });
  }

  renderCategoryDistribution(container) {
    const canvas = container.querySelector('#category-chart');
    if (!canvas) return;

    const distribution = analyticsService.getCategoryDistribution(
      this.habits,
      this.progress
    );

    if (distribution.length === 0) {
      container.innerHTML = '<p style="text-align: center; opacity: 0.5; padding: 2rem;">Brak danych</p>';
      return;
    }

    const ctx = canvas.getContext('2d');

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const isDark = document.body.classList.contains('theme-dark');
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: distribution.map(d => d.name),
        datasets: [{
          data: distribution.map(d => d.value),
          backgroundColor: distribution.map(d => CATEGORY_COLORS[d.name] || '#bfdbfe'),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 16,
              font: {
                size: 13,
                weight: '500'
              },
              generateLabels: (chart) => {
                const data = chart.data;
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return {
                    text: `${label} ${percentage}%`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    fontColor: textColor,
                    hidden: false,
                    index: i
                  };
                });
              }
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  destroy() {
    if (this.weeklyChart) {
      this.weeklyChart.destroy();
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  }
}
