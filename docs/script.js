// ============================================
// HABITS TRACKER DOCUMENTATION SCRIPTS
// ============================================

/**
 * Pokazuje wybraną sekcję dokumentacji
 * @param {string} sectionId - ID sekcji do wyświetlenia
 */
function showSection(sectionId) {
    // Ukryj wszystkie sekcje
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Wyświetl wybraną sekcję
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        // Przewiń do góry strony
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Aktualizuj aktywny link w nawigacji
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Zaznacz kliknięty link jako aktywny
    const activeLink = Array.from(navLinks).find(link => {
        const href = link.getAttribute('href');
        return href === '#' + sectionId;
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Inicjalizacja dokumentacji
 */
function initDocumentation() {
    // Domyślnie pokazuj sekcję "Wprowadzenie"
    const introduction = document.getElementById('introduction');
    if (introduction) {
        introduction.classList.add('active');
    }

    // Zaznacz pierwszy link jako aktywny
    const firstLink = document.querySelector('.nav-link');
    if (firstLink) {
        firstLink.classList.add('active');
    }

    // Obsługuj klikanie na linki nawigacyjne
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Obsługuj klikanie na karty komponentów
    const componentItems = document.querySelectorAll('.component-item[data-component]');
    componentItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const description = item.getAttribute('data-description');
            showModal(title, description);
        });
    });

    // Obsługuj klikanie na karty serwisów
    const serviceItems = document.querySelectorAll('.service-item[data-service]');
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const description = item.getAttribute('data-description');
            showModal(title, description);
        });
    });

    // Obsługuj zamykanie modalu
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            hideModal();
        });
    }

    // Zamknij modal na kliknięcie poza nim
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    // Obsługuj klawisz Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    // Przewijanie gładkie dla kodów
    document.querySelectorAll('pre code').forEach(block => {
        block.addEventListener('click', function() {
            // Umożliwia zaznaczenie kodu
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    // Dodaj animację do elementów
    observeElements();
}

/**
 * Wyświetla modal z informacjami
 * @param {string} title - Tytuł modalu
 * @param {string} description - Opis
 */
function showModal(title, description) {
    const modal = document.getElementById('infoModal');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        modal.classList.add('show');
    }
}

/**
 * Ukrywa modal
 */
function hideModal() {
    const modal = document.getElementById('infoModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Obserwuje elementy i dodaje animacje podczas przewijania
 */
function observeElements() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    // Obserwuj karty funkcji
    document.querySelectorAll('.feature-card, .component-item, .service-item, .intro-box, .tech-stack, .info-box').forEach(el => {
        el.style.opacity = '0.7';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

/**
 * Obsługuje kopiowanie kodu do schowka
 */
function setupCodeCopy() {
    document.querySelectorAll('pre').forEach(preBlock => {
        const copyButton = document.createElement('button');
        copyButton.textContent = '📋 Kopiuj';
        copyButton.className = 'copy-button';
        copyButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: var(--primary-green);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        `;

        preBlock.style.position = 'relative';
        preBlock.appendChild(copyButton);

        preBlock.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });

        preBlock.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });

        copyButton.addEventListener('click', () => {
            const code = preBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = '✅ Skopiowano!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            });
        });
    });
}

// Zainicjalizuj dokumentację gdy załaduje się strona
document.addEventListener('DOMContentLoaded', () => {
    initDocumentation();
    setupCodeCopy();
    
    // Sprawdź czy jest hash w URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Obsługuj zmianę hasha w URL
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Obsługuj zmianę rozmiaru okna
window.addEventListener('resize', () => {
    // Dostosuj układ do rozmiaru ekranu
});
