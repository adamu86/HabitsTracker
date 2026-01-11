# Habits Tracker - Dokumentacja

Ta dokumentacja została wygenerowana automatycznie na podstawie plików README.md i FEATURES.md projektu Habits Tracker.

## Wprowadzenie

Kompletna aplikacja do śledzenia nawyków, zbudowana z użyciem Vanilla JavaScript, Supabase i Chart.js.

![Habits Tracker](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Funkcjonalności

### Must Have (✅ Zaimplementowane)

- **CRUD nawyków** - Dodawanie, edycja, usuwanie nawyków z walidacją
- **Siatka dni z tracking** - Widok tygodniowy z możliwością oznaczania wykonanych dni
- **Persystencja danych** - Supabase jako baza danych z automatycznym zapisem
- **Wizualizacja (Chart.js)** - Wykresy słupkowe i kołowe pokazujące postęp
- **Udostępnianie read-only** - Generowanie linków do udostępniania z danymi w URL

### Should Have (✅ Zaimplementowane)

- **Licznik streaku** - Śledzenie najdłuższej serii kolejnych dni
- **Kategorie z kolorami** - 6 kategorii z dedykowanymi ikonami i kolorami

### Could Have (✅ Zaimplementowane)

- **Tryb ciemny/jasny** - Automatyczne wykrywanie preferencji systemu + przełącznik

## Architektura

### Struktura projektu

```
/
├── index.html                    # Główny plik HTML
├── src/
│   ├── main.js                   # Punkt wejścia aplikacji
│   ├── app.js                    # Główna logika aplikacji
│   ├── styles.css                # Style CSS (design inspirowany Figma)
│   ├── services/
│   │   ├── supabase.js          # Serwis komunikacji z Supabase
│   │   ├── analytics.js         # Serwis analityki i statystyk
│   │   ├── share.js             # Serwis udostępniania
│   │   └── theme.js             # Serwis zarządzania motywem
│   └── components/
│       ├── HabitCard.js         # Komponent karty nawyku
│       ├── HabitModal.js        # Modal dodawania/edycji nawyku
│       ├── ShareModal.js        # Modal udostępniania
│       └── Charts.js            # Komponenty wykresów
├── seed-data.js                 # Script do inicjalizacji przykładowych danych
└── package.json
```

### Technologie

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend/Database**: Supabase (PostgreSQL)
- **Wizualizacja**: Chart.js 4.4.0
- **Build Tool**: Vite 5.4
- **Czcionki**: Inter (Google Fonts)

## Instalacja

### Wymagania

- Node.js 18+
- Konto Supabase (darmowe)

### Krok 1: Klonowanie repozytorium

```bash
git clone <repository-url>
cd habits-tracker
```

### Krok 2: Instalacja zależności

```bash
npm install
```

### Krok 3: Konfiguracja Supabase

Plik `.env` powinien zawierać:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Krok 4: Inicjalizacja bazy danych

Baza danych została automatycznie skonfigurowana z następującymi tabelami:

- `habits` - przechowuje informacje o nawykach
- `progress` - przechowuje postęp dla każdego nawyku

### Krok 5: Załadowanie przykładowych danych (opcjonalnie)

```bash
npm run seed
```

### Krok 6: Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Krok 7: Build produkcyjny

```bash
npm run build
```

## Użytkowanie

Aplikacja pozwala na śledzenie nawyków poprzez:

- Dodawanie nowych nawyków z kategoriami i kolorami
- Oznaczanie dni wykonania w siatce tygodniowej
- Wyświetlanie statystyk i wykresów postępu
- Udostępnianie postępów innym użytkownikom

## Baza danych

### Schemat tabel

- **habits**: id (uuid), name (text), description (text), category (text), color (text), icon (text), created_at (timestamptz), updated_at (timestamptz)
- **progress**: id (uuid), habit_id (uuid), date (date), done (boolean), created_at (timestamptz)

## Accessibility

Aplikacja spełnia standardy WCAG AA z pełną obsługą klawiatury, czytników ekranowych i wysokim kontrastem.

## Jak hostować tę dokumentację

Możesz hostować tę statyczną stronę HTML w dowolnym miejscu obsługującym pliki HTML, takich jak:

### GitHub Pages

1. Prześlij folder `docs/` do repozytorium GitHub
2. W ustawieniach repozytorium włącz GitHub Pages
3. Wybierz branch `main` i folder `/docs`
4. Dokumentacja będzie dostępna pod adresem: `https://twoje-username.github.io/nazwa-repo/`

### Netlify

1. Przeciągnij folder `docs/` na stronę Netlify (netlify.com)
2. Strona zostanie automatycznie wdrożona

### Vercel

1. Zainstaluj Vercel CLI: `npm i -g vercel`
2. W folderze `docs/` uruchom: `vercel`
3. Strona zostanie wdrożona

### Inne opcje

- Firebase Hosting
- Surge.sh
- GitLab Pages
- Dowolny serwer webowy

## Aktualizacja dokumentacji

Aby zaktualizować dokumentację:

1. Zmodyfikuj pliki `README.md` lub `FEATURES.md` w głównym folderze projektu
2. Poproś o regenerację dokumentacji
3. Prześlij zaktualizowane pliki do hostingu

---

**Wygenerowano:** 11 stycznia 2026
