import { shareService } from '../services/share.js';

export class ShareModal {
  constructor(habits, progress, onClose) {
    this.habits = habits;
    this.progress = progress;
    this.onClose = onClose;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'share-modal-title');

    const shareLink = shareService.generateShareLink(this.habits, this.progress);

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2 id="share-modal-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share Your Dashboard
            </h2>
            <p>Copy the link below to share your habits progress with others.</p>
          </div>
          <button class="btn-close" aria-label="Zamknij">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="share-content">
          <div class="share-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </div>

          <h3>Share your progress with others</h3>
          <p>Anyone with this link can view your habits and progress in read-only mode.</p>

          <div class="share-link-container">
            <input
              type="text"
              class="share-link-input"
              value="${shareLink}"
              readonly
              id="share-link-input"
              aria-label="Link do udostępnienia"
            />
            <button class="btn btn-primary" id="copy-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </button>
          </div>

          <div class="tip-box">
            <span>💡</span>
            <span>Tip: Share your progress to stay accountable and inspire others on their habit-building journey!</span>
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

  attachEventListeners(overlay) {
    const closeBtn = overlay.querySelector('.btn-close');
    const copyBtn = overlay.querySelector('#copy-btn');
    const linkInput = overlay.querySelector('#share-link-input');

    closeBtn.addEventListener('click', this.onClose);

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(linkInput.value);

        copyBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied!
        `;

        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          `;
        }, 2000);
      } catch (error) {
        console.error('Błąd podczas kopiowania:', error);
        linkInput.select();
        document.execCommand('copy');
      }
    });

    linkInput.addEventListener('click', () => {
      linkInput.select();
    });

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
}
