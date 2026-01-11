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

    // Obsługa wyszukiwania
    setupSearch();

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

/**
 * Inicjalizacja wyszukiwania w dokumentacji
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput) return;

    // Zbierz wszystkie wyszukiwalne elementy
    const searchableContent = collectSearchableContent();

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length === 0) {
            searchResults.classList.remove('show');
            searchResults.innerHTML = '';
            return;
        }

        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }

        const results = performSearch(query, searchableContent);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Brak wyników</div>';
            searchResults.classList.add('show');
            return;
        }

        displaySearchResults(results, searchResults, query);
    });

    // Zamknij wyniki wyszukiwania na kliknięcie gdzieś indziej
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            searchResults.classList.remove('show');
        }
    });
}

/**
 * Zbiera wszystką zawartość do wyszukiwania
 */
function collectSearchableContent() {
    const content = [];

    // Dodaj nagłówki sekcji
    document.querySelectorAll('.section h2').forEach(heading => {
        const section = heading.closest('.section');
        if (section) {
            content.push({
                title: heading.textContent,
                text: heading.textContent,
                section: section.id,
                type: 'section'
            });
        }
    });

    // Dodaj paragrafy
    document.querySelectorAll('.section > p').forEach(para => {
        const section = para.closest('.section');
        if (section) {
            content.push({
                title: section.querySelector('h2').textContent,
                text: para.textContent,
                section: section.id,
                type: 'paragraph'
            });
        }
    });

    // Dodaj komponenty
    document.querySelectorAll('.component-item[data-component]').forEach(item => {
        content.push({
            title: item.getAttribute('data-title'),
            text: item.querySelector('p').textContent,
            section: 'components',
            type: 'component',
            element: item
        });
    });

    // Dodaj serwisy
    document.querySelectorAll('.service-item[data-service]').forEach(item => {
        content.push({
            title: item.getAttribute('data-title'),
            text: item.querySelector('p').textContent,
            section: 'services',
            type: 'service',
            element: item
        });
    });

    // Dodaj nagłówki w box'ach
    document.querySelectorAll('.info-box h3, .tech-stack h3, .migration-box h3').forEach(heading => {
        const section = heading.closest('.section');
        if (section) {
            content.push({
                title: heading.textContent,
                text: heading.textContent,
                section: section.id,
                type: 'subsection'
            });
        }
    });

    return content;
}

/**
 * Wyszukuje rezultaty
 */
function performSearch(query, content) {
    return content.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const textMatch = item.text.toLowerCase().includes(query);
        return titleMatch || textMatch;
    }).slice(0, 8); // Limit to 8 results
}

/**
 * Wyświetla rezultaty wyszukiwania
 */
function displaySearchResults(results, container, query) {
    container.innerHTML = '';

    results.forEach(result => {
        const resultEl = document.createElement('div');
        resultEl.className = 'search-result-item';

        const titleEl = document.createElement('div');
        titleEl.className = 'search-result-title';
        titleEl.textContent = result.title;

        const textEl = document.createElement('div');
        textEl.className = 'search-result-text';
        // Highlight matched query
        let highlightedText = result.text.replace(
            new RegExp(`(${query})`, 'gi'),
            '<mark>$1</mark>'
        );
        textEl.innerHTML = highlightedText;

        const sectionEl = document.createElement('div');
        sectionEl.className = 'search-result-section';

        const sectionNames = {
            'introduction': 'Wprowadzenie',
            'features': 'Główne funkcje',
            'architecture': 'Architektura',
            'components': 'Komponenty',
            'services': 'Serwisy',
            'database': 'Baza danych',
            'getting-started': 'Szybki start'
        };

        sectionEl.textContent = sectionNames[result.section] || result.section;

        resultEl.appendChild(titleEl);
        resultEl.appendChild(textEl);
        resultEl.appendChild(sectionEl);

        resultEl.addEventListener('click', () => {
            if (result.element) {
                // Dla komponentów i serwisów - otwórz modal
                const title = result.element.getAttribute('data-title');
                const description = result.element.getAttribute('data-description');
                showModal(title, description);
            } else {
                // Dla sekcji - przejdź do sekcji
                showSection(result.section);
            }
            container.classList.remove('show');
            document.getElementById('searchInput').value = '';
        });

        container.appendChild(resultEl);
    });

    container.classList.add('show');
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
