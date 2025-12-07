const COLORS = [
  '#93c5fd', '#86efac', '#fdba74', '#d8b4fe', '#fde68a', '#bfdbfe',
  '#fca5a5', '#a7f3d0', '#fef08a', '#ddd6fe', '#b3d9f2', '#e9e5af'
];

const CATEGORIES = [
  { name: 'Wellness', icon: '🧘' },
  { name: 'Learning', icon: '📚' },
  { name: 'Fitness', icon: '💪' },
  { name: 'Health', icon: '❤️' },
  { name: 'Productivity', icon: '🧠' },
  { name: 'Other', icon: '🎯' }
];

export class HabitModal {
  constructor(onSave, onClose, habit = null) {
    this.onSave = onSave;
    this.onClose = onClose;
    this.habit = habit;
    this.formData = {
      name: habit?.name || '',
      description: habit?.description || '',
      color: habit?.color || COLORS[0],
      category: habit?.category || 'Wellness',
      icon: habit?.icon || CATEGORIES[0].icon
    };
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modal-title');

    const isEdit = !!this.habit;

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title">${isEdit ? 'Edit Habit' : 'Add New Habit'}</h2>
            <p>${isEdit ? 'Update your habit details below.' : 'Create a new habit to track your daily progress.'}</p>
          </div>
          <button class="btn-close" aria-label="Zamknij">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form id="habit-form">
          <div class="form-group">
            <label for="habit-name">
              Habit Name <span class="required">*</span>
            </label>
            <input
              type="text"
              id="habit-name"
              class="form-input"
              placeholder="e.g. Morning Meditation"
              value="${this.escapeHtml(this.formData.name)}"
              required
              minlength="3"
              maxlength="50"
              autocomplete="off"
            />
          </div>

          <div class="form-group">
            <label for="habit-description">
              Description (Optional)
            </label>
            <textarea
              id="habit-description"
              class="form-textarea"
              placeholder="Add a brief description..."
              maxlength="200"
            >${this.escapeHtml(this.formData.description)}</textarea>
          </div>

          <div class="form-group">
            <label>Color <span class="required">*</span></label>
            <div class="color-grid">
              ${COLORS.map(color => `
                <button
                  type="button"
                  class="color-option ${color === this.formData.color ? 'selected' : ''}"
                  style="background-color: ${color}"
                  data-color="${color}"
                  aria-label="Kolor ${color}"
                ></button>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label>Category <span class="required">*</span></label>
            <div class="category-grid">
              ${CATEGORIES.map(cat => `
                <button
                  type="button"
                  class="category-option ${cat.name === this.formData.category ? 'selected' : ''}"
                  data-category="${cat.name}"
                  data-icon="${cat.icon}"
                >
                  <span class="icon">${cat.icon}</span>
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" id="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" id="save-btn">
              ${isEdit ? 'Save Changes' : 'Add Habit'}
            </button>
          </div>
        </form>
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

  attachEventListeners(overlay) {
    const form = overlay.querySelector('#habit-form');
    const nameInput = overlay.querySelector('#habit-name');
    const descInput = overlay.querySelector('#habit-description');
    const closeBtn = overlay.querySelector('.btn-close');
    const cancelBtn = overlay.querySelector('#cancel-btn');
    const colorOptions = overlay.querySelectorAll('.color-option');
    const categoryOptions = overlay.querySelectorAll('.category-option');

    nameInput.addEventListener('input', (e) => {
      this.formData.name = e.target.value;
    });

    descInput.addEventListener('input', (e) => {
      this.formData.description = e.target.value;
    });

    colorOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        colorOptions.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.formData.color = btn.dataset.color;
      });
    });

    categoryOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryOptions.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.formData.category = btn.dataset.category;
        this.formData.icon = btn.dataset.icon;
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (this.formData.name.length < 3 || this.formData.name.length > 50) {
        alert('Nazwa nawyku musi mieć od 3 do 50 znaków');
        return;
      }

      const saveBtn = overlay.querySelector('#save-btn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Zapisywanie...';

      try {
        const habitData = {
          name: this.formData.name.trim(),
          description: this.formData.description.trim(),
          color: this.formData.color,
          category: this.formData.category,
          icon: this.formData.icon
        };

        await this.onSave(habitData);
        this.onClose();
      } catch (error) {
        console.error('Błąd podczas zapisywania nawyku:', error);
        alert('Nie udało się zapisać nawyku. Spróbuj ponownie.');
        saveBtn.disabled = false;
        saveBtn.textContent = this.habit ? 'Save Changes' : 'Add Habit';
      }
    });

    closeBtn.addEventListener('click', this.onClose);
    cancelBtn.addEventListener('click', this.onClose);

    document.addEventListener('keydown', this.handleEscape);
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
