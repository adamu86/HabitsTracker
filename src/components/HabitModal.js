const COLORS = [
  '#93c5fd', '#86efac', '#fdba74', '#d8b4fe', '#fde68a', '#bfdbfe',
  '#fca5a5', '#a7f3d0', '#fef08a', '#ddd6fe', '#b3d9f2', '#e9e5af'
];

const DEFAULT_CATEGORIES = [
  { name: 'Wellness', icon: '🧘' },
  { name: 'Learning', icon: '📚' },
  { name: 'Fitness', icon: '💪' },
  { name: 'Health', icon: '❤️' },
  { name: 'Productivity', icon: '🧠' },
  { name: 'Other', icon: '🎯' }
];

const CATEGORY_ICONS = [
  '🧘', '📚', '💪', '❤️', '🧠', '🎯', '🏃', '🍎', '🧘‍♀️', '🏋️', '📖', '💻',
  '🎨', '🎵', '📱', '🚴', '🏊', '⚽', '🧗', '🤸', '🧘‍♂️', '🎯', '💪', '⏰'
];

const DAYS_OF_WEEK = [
  { index: 0, short: 'Sun', full: 'Sunday' },
  { index: 1, short: 'Mon', full: 'Monday' },
  { index: 2, short: 'Tue', full: 'Tuesday' },
  { index: 3, short: 'Wed', full: 'Wednesday' },
  { index: 4, short: 'Thu', full: 'Thursday' },
  { index: 5, short: 'Fri', full: 'Friday' },
  { index: 6, short: 'Sat', full: 'Saturday' }
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
      icon: habit?.icon || DEFAULT_CATEGORIES[0].icon,
      scheduled_days: habit?.scheduled_days || [0, 1, 2, 3, 4, 5, 6]
    };
  }

  // Get all available categories (default + custom)
  getAvailableCategories() {
    const customCategories = this.getCustomCategories();
    const allCategories = [...DEFAULT_CATEGORIES];
    
    customCategories.forEach(cat => {
      if (!allCategories.find(c => c.name === cat.name)) {
        allCategories.push(cat);
      }
    });
    
    return allCategories;
  }

  // Get custom categories from localStorage
  getCustomCategories() {
    try {
      const stored = localStorage.getItem('custom_categories');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading custom categories:', error);
      return [];
    }
  }

  // Save custom category to localStorage
  saveCustomCategory(name, icon) {
    try {
      const custom = this.getCustomCategories();
      if (!custom.find(c => c.name === name)) {
        custom.push({ name, icon });
        localStorage.setItem('custom_categories', JSON.stringify(custom));
      }
    } catch (error) {
      console.error('Error saving custom category:', error);
    }
  }

  // Update custom category in localStorage
  updateCustomCategory(oldName, newName, newIcon) {
    try {
      const custom = this.getCustomCategories();
      const index = custom.findIndex(c => c.name === oldName);
      if (index !== -1) {
        custom[index] = { name: newName, icon: newIcon };
        localStorage.setItem('custom_categories', JSON.stringify(custom));
        return true;
      }
    } catch (error) {
      console.error('Error updating custom category:', error);
    }
    return false;
  }

  // Save custom color to localStorage
  saveCustomColor(color) {
    try {
      const custom = this.getCustomColors();
      if (!custom.includes(color)) {
        custom.push(color);
        localStorage.setItem('custom_colors', JSON.stringify(custom));
      }
    } catch (error) {
      console.error('Error saving custom color:', error);
    }
  }

  // Get custom colors from localStorage
  getCustomColors() {
    try {
      const stored = localStorage.getItem('custom_colors');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading custom colors:', error);
      return [];
    }
  }

  // Get all available colors (default + custom)
  getAvailableColors() {
    const custom = this.getCustomColors();
    return [...new Set([...COLORS, ...custom])]; // Remove duplicates
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
          <button class="btn-close" aria-label="Close">
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
            <div class="color-grid" id="color-grid">
              ${this.getAvailableColors().map(color => `
                <button
                  type="button"
                  class="color-option ${color === this.formData.color ? 'selected' : ''}"
                  style="background-color: ${color}"
                  data-color="${color}"
                  aria-label="Color ${color}"
                ></button>
              `).join('')}
              <button
                type="button"
                class="color-option add-color"
                id="add-color-btn"
                title="Add custom color"
              >
                <span class="add-icon">➕</span>
              </button>
            </div>
            <div id="color-picker-form" class="color-picker-form" style="display: none; margin-top: 12px;">
              <div style="display: flex; gap: 8px; align-items: flex-end;">
                <div style="flex: 1;">
                  <label for="custom-color-input" style="display: block; font-size: 12px; margin-bottom: 4px;">Pick a color</label>
                  <div style="display: flex; gap: 8px;">
                    <input
                      type="color"
                      id="custom-color-input"
                      class="color-input"
                      value="${this.formData.color}"
                    />
                    <input
                      type="text"
                      class="form-input"
                      id="custom-color-hex"
                      placeholder="#000000"
                      maxlength="7"
                      style="flex: 1; min-width: 100px;"
                      value="${this.formData.color}"
                    />
                  </div>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="btn btn-sm btn-secondary" id="cancel-color-btn">Cancel</button>
                  <button type="button" class="btn btn-sm btn-primary" id="save-color-btn">Add Color</button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Category <span class="required">*</span></label>
            <div class="category-grid" id="category-grid">
              ${this.getAvailableCategories().map(cat => `
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
              <button
                type="button"
                class="category-option add-category"
                id="add-category-btn"
                title="Add new category"
              >
                <span class="icon">➕</span>
                <span>New</span>
              </button>
            </div>
            <div id="new-category-form" class="new-category-form" style="display: none; margin-top: 12px;">
              <div class="new-category-form-content">
                <div class="new-category-input-group">
                  <div class="new-category-field">
                    <label for="new-category-name" class="new-category-label">Category name</label>
                    <input
                      type="text"
                      id="new-category-name"
                      class="form-input"
                      placeholder="e.g., Reading"
                      maxlength="30"
                    />
                  </div>
                  <div class="new-category-field">
                    <label class="new-category-label">Icon</label>
                    <div id="icon-picker" class="icon-picker">
                      ${CATEGORY_ICONS.map(icon => `
                        <button
                          type="button"
                          class="icon-option"
                          data-icon="${icon}"
                          title="${icon}"
                        >
                          ${icon}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </div>
                <div class="new-category-actions">
                  <button type="button" class="btn btn-sm btn-secondary" id="cancel-category-btn">Cancel</button>
                  <button type="button" class="btn btn-sm btn-primary" id="save-category-btn">Add Category</button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Scheduled Days <span class="required">*</span></label>
            <div class="days-grid">
              ${[...DAYS_OF_WEEK.slice(1), DAYS_OF_WEEK[0]].map(day => `
                <button
                  type="button"
                  class="day-option ${this.formData.scheduled_days.includes(day.index) ? 'selected' : ''}"
                  data-day="${day.index}"
                  title="${day.full}"
                  aria-label="${day.full}"
                >
                  ${day.short}
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
    const colorOptions = overlay.querySelectorAll('.color-option:not(.add-color)');
    const addColorBtn = overlay.querySelector('#add-color-btn');
    const categoryOptions = overlay.querySelectorAll('.category-option:not(.add-category)');
    const addCategoryBtn = overlay.querySelector('#add-category-btn');
    const dayOptions = overlay.querySelectorAll('.day-option');

    let selectedNewIcon = '🎯';

    nameInput.addEventListener('input', (e) => {
      this.formData.name = e.target.value;
    });

    descInput.addEventListener('input', (e) => {
      this.formData.description = e.target.value;
    });

    // Color picker
    colorOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        colorOptions.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.formData.color = btn.dataset.color;
      });
    });

    // Add color button
    addColorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = overlay.querySelector('#color-picker-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Color input sync
    const colorInput = overlay.querySelector('#custom-color-input');
    const colorHexInput = overlay.querySelector('#custom-color-hex');

    if (colorInput && colorHexInput) {
      colorInput.addEventListener('input', (e) => {
        colorHexInput.value = e.target.value;
      });

      colorHexInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          colorInput.value = value;
        }
      });
    }

    // Cancel color picker
    const cancelColorBtn = overlay.querySelector('#cancel-color-btn');
    if (cancelColorBtn) {
      cancelColorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.querySelector('#color-picker-form').style.display = 'none';
      });
    }

    // Save custom color
    const saveColorBtn = overlay.querySelector('#save-color-btn');
    if (saveColorBtn) {
      saveColorBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const customColor = colorInput.value;

        if (!/^#[0-9A-F]{6}$/i.test(customColor)) {
          alert('Invalid color format. Use format: #RRGGBB');
          return;
        }

        // Check if color already exists
        if (this.getAvailableColors().includes(customColor)) {
          alert('This color already exists');
          return;
        }

        // Save the custom color
        this.saveCustomColor(customColor);

        // Select the new color
        this.formData.color = customColor;

        // Re-render color grid
        const colorGrid = overlay.querySelector('#color-grid');
        colorGrid.innerHTML = this.getAvailableColors().map(color => `
          <button
            type="button"
            class="color-option ${color === this.formData.color ? 'selected' : ''}"
            style="background-color: ${color}"
            data-color="${color}"
            aria-label="Color ${color}"
          ></button>
        `).join('') + `
          <button
            type="button"
            class="color-option add-color"
            id="add-color-btn"
            title="Add custom color"
          >
            <span class="add-icon">➕</span>
          </button>
        `;

        // Re-attach color option listeners
        const newColorOptions = overlay.querySelectorAll('.color-option:not(.add-color)');
        newColorOptions.forEach(btn => {
          btn.addEventListener('click', () => {
            newColorOptions.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            this.formData.color = btn.dataset.color;
          });
        });

        // Re-attach add color button
        const newAddColorBtn = overlay.querySelector('#add-color-btn');
        if (newAddColorBtn) {
          newAddColorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const form = overlay.querySelector('#color-picker-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
          });
        }

        // Reset form
        overlay.querySelector('#color-picker-form').style.display = 'none';
        overlay.querySelector('#custom-color-hex').value = colorInput.value;
      });
    }

    categoryOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryOptions.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.formData.category = btn.dataset.category;
        this.formData.icon = btn.dataset.icon;
      });
    });

    // Add category button
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = overlay.querySelector('#new-category-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        // Set initial icon selection
        const firstIcon = overlay.querySelector('.icon-option');
        if (firstIcon) {
          selectedNewIcon = firstIcon.dataset.icon;
          firstIcon.classList.add('selected');
        }
      });
    }

    // Icon picker
    const iconOptions = overlay.querySelectorAll('.icon-option');
    iconOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        iconOptions.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedNewIcon = btn.dataset.icon;
      });
    });

    // Cancel category creation
    const cancelCategoryBtn = overlay.querySelector('#cancel-category-btn');
    if (cancelCategoryBtn) {
      cancelCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.querySelector('#new-category-form').style.display = 'none';
        overlay.querySelector('#new-category-name').value = '';
        iconOptions.forEach(b => b.classList.remove('selected'));
      });
    }

    // Save new category
    const saveCategoryBtn = overlay.querySelector('#save-category-btn');
    if (saveCategoryBtn) {
      saveCategoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nameInput = overlay.querySelector('#new-category-name');
        const categoryName = nameInput.value.trim();

        if (!categoryName) {
          alert('Please enter a category name');
          return;
        }

        if (categoryName.length > 30) {
          alert('Category name must be 30 characters or less');
          return;
        }

        // Check if category already exists
        if (this.getAvailableCategories().find(c => c.name === categoryName)) {
          alert('This category already exists');
          return;
        }

        // Save the custom category
        this.saveCustomCategory(categoryName, selectedNewIcon);

        // Select the new category
        this.formData.category = categoryName;
        this.formData.icon = selectedNewIcon;

        // Re-render category grid
        const categoryGrid = overlay.querySelector('#category-grid');
        categoryGrid.innerHTML = this.getAvailableCategories().map(cat => `
          <button
            type="button"
            class="category-option ${cat.name === this.formData.category ? 'selected' : ''}"
            data-category="${cat.name}"
            data-icon="${cat.icon}"
          >
            <span class="icon">${cat.icon}</span>
            <span>${cat.name}</span>
          </button>
        `).join('') + `
          <button
            type="button"
            class="category-option add-category"
            id="add-category-btn-new"
            title="Add new category"
          >
            <span class="icon">➕</span>
            <span>New</span>
          </button>
        `;

        // Re-attach category option listeners
        const newCategoryOptions = overlay.querySelectorAll('.category-option:not(.add-category)');
        newCategoryOptions.forEach(btn => {
          btn.addEventListener('click', () => {
            newCategoryOptions.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            this.formData.category = btn.dataset.category;
            this.formData.icon = btn.dataset.icon;
          });
        });



        // Re-attach add category button with proper handler
        const newAddCategoryBtn = overlay.querySelector('#add-category-btn-new');
        if (newAddCategoryBtn) {
          newAddCategoryBtn.id = 'add-category-btn';
          newAddCategoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const form = overlay.querySelector('#new-category-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
            const firstIcon = overlay.querySelector('.icon-option');
            if (firstIcon) {
              selectedNewIcon = firstIcon.dataset.icon;
              firstIcon.classList.add('selected');
            }
          });
        }

        // Reset form
        overlay.querySelector('#new-category-form').style.display = 'none';
        overlay.querySelector('#new-category-name').value = '';
        overlay.querySelectorAll('.icon-option').forEach(b => b.classList.remove('selected'));
      });
    }

    dayOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dayIndex = parseInt(btn.dataset.day);
        if (this.formData.scheduled_days.includes(dayIndex)) {
          this.formData.scheduled_days = this.formData.scheduled_days.filter(d => d !== dayIndex);
          btn.classList.remove('selected');
        } else {
          this.formData.scheduled_days.push(dayIndex);
          this.formData.scheduled_days.sort((a, b) => a - b);
          btn.classList.add('selected');
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (this.formData.name.length < 3 || this.formData.name.length > 50) {
        alert('Habit name must be between 3 and 50 characters');
        return;
      }

      if (this.formData.scheduled_days.length === 0) {
        alert('Select at least one day');
        return;
      }

      const saveBtn = overlay.querySelector('#save-btn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        const habitData = {
          name: this.formData.name.trim(),
          description: this.formData.description.trim(),
          color: this.formData.color,
          category: this.formData.category,
          icon: this.formData.icon,
          scheduled_days: this.formData.scheduled_days
        };

        await this.onSave(habitData);
        this.onClose();
      } catch (error) {
        console.error('Error while saving habit:', error);
        alert('Failed to save habit. Try again.');
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
