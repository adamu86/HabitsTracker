# Habits Tracker

[![Status](https://img.shields.io/badge/status-production--ready-green)](https://github.com/your-username/habits-tracker)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

Aplikacja do śledzenia nawyków zbudowana w czystym JavaScript, z Supabase jako bazą danych i Chart.js do wizualizacji.

## Spis treści

- [Wprowadzenie](#wprowadzenie)
- [Rozpoczęcie](#rozpoczęcie)
- [Funkcjonalności](#funkcjonalności)
- [Architektura](#architektura)
- [Użytkowanie](#użytkowanie)
- [Baza danych](#baza-danych)
- [Wdrażanie](#wdrażanie)
- [Współtworzenie](#współtworzenie)

## Wprowadzenie

Habits Tracker to kompletna aplikacja webowa do monitorowania codziennych nawyków. Umożliwia tworzenie nawyków, śledzenie postępów w siatce dni oraz wizualizację danych za pomocą wykresów. Aplikacja jest zbudowana bez frameworków, używając nowoczesnego JavaScript ES6+.

### Kluczowe cechy

- **Prosta instalacja**: Brak autentyfikacji, dane przechowywane w Supabase
- **Responsywny design**: Działa na urządzeniach mobilnych i desktop
- **Dostępność**: Zgodna z WCAG AA
- **Udostępnianie**: Generuj linki do publicznych widoków postępów

## Rozpoczęcie

### Wymagania

- Node.js 18 lub nowszy
- Konto Supabase (bezpłatne)

### Instalacja

1. **Sklonuj repozytorium**

   ```bash
   git clone https://github.com/your-username/habits-tracker.git
   cd habits-tracker
   ```

2. **Zainstaluj zależności**

   ```bash
   npm install
   ```

3. **Skonfiguruj Supabase**

   Utwórz plik `.env` w katalogu głównym:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Uruchom aplikację**

   ```bash
   npm run dev
   ```

   Aplikacja będzie dostępna na `http://localhost:5173`.

### Build produkcyjny

```bash
npm run build
```

## Funkcjonalności

### Zarządzanie nawykami

- Tworzenie, edycja i usuwanie nawyków
- Kategorie: Wellness, Learning, Fitness, Health, Productivity, Other
- Kolory i ikony dla wizualnej identyfikacji

### Śledzenie postępów

- Siatka tygodniowa z możliwością zaznaczania dni
- Licznik serii (streak) dla motywacji
- Automatyczny zapis w bazie danych

### Wizualizacja

- Wykresy słupkowe pokazujące tygodniowy postęp
- Wykres kołowy rozkładu kategorii
- Responsywne wykresy dostosowane do motywu

### Dodatkowe funkcje

- Tryb ciemny/jasny z automatycznym wykrywaniem
- Udostępnianie postępów przez linki publiczne
- Pełna obsługa klawiatury i czytników ekranowych

## Architektura

### Struktura projektu

```
habits-tracker/
├── index.html
├── src/
│   ├── main.js          # Punkt wejścia
│   ├── app.js           # Główna logika aplikacji
│   ├── styles.css       # Style CSS
│   ├── components/      # Komponenty UI
│   │   ├── HabitCard.js
│   │   ├── HabitModal.js
│   │   ├── ShareModal.js
│   │   └── Charts.js
│   └── services/        # Usługi
│       ├── supabase.js
│       ├── analytics.js
│       ├── share.js
│       └── theme.js
├── package.json
└── docs/                # Ta dokumentacja
```

### Technologie

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Baza danych**: Supabase (PostgreSQL)
- **Wizualizacja**: Chart.js
- **Build**: Vite
- **Stylowanie**: Tailwind CSS (opcjonalne, jeśli używane)

## Użytkowanie

### Dodawanie nawyku

1. Kliknij przycisk "Dodaj nawyk"
2. Wypełnij nazwę (wymagana, 3-50 znaków)
3. Wybierz kategorię i kolor
4. Opcjonalnie dodaj opis

### Śledzenie postępów

- W siatce dni kliknij na datę, aby zaznaczyć wykonanie
- Dzisiejsza data jest wyróżniona niebieską kropką
- Przyszłe dni są wyłączone

### Udostępnianie

- Kliknij przycisk udostępniania w karcie nawyku
- Skopiuj wygenerowany link
- Link zawiera dane w formacie JSON zakodowanym w base64

## Baza danych

Aplikacja używa Supabase jako bazy danych. Schemat składa się z dwóch tabel:

### Tabela `habits`

| Kolumna     | Typ         | Opis                        |
| ----------- | ----------- | --------------------------- |
| id          | uuid        | Klucz główny                |
| name        | text        | Nazwa nawyku (3-50 znaków)  |
| description | text        | Opis (opcjonalny, max 200)  |
| category    | text        | Kategoria                   |
| color       | text        | Kolor w hex                 |
| icon        | text        | Ikona emoji                 |
| created_at  | timestamptz | Data utworzenia             |
| updated_at  | timestamptz | Data ostatniej aktualizacji |

### Tabela `progress`

| Kolumna    | Typ         | Opis                 |
| ---------- | ----------- | -------------------- |
| id         | uuid        | Klucz główny         |
| habit_id   | uuid        | Klucz obcy do habits |
| date       | date        | Data postępu         |
| done       | boolean     | Czy wykonane         |
| created_at | timestamptz | Data utworzenia      |

Unikalne ograniczenie na `(habit_id, date)` zapobiega duplikatom.

## Wdrażanie

### GitHub Pages

1. Prześlij kod do repozytorium GitHub
2. W ustawieniach włącz GitHub Pages
3. Wybierz branch i folder `/docs` (dla dokumentacji) lub `/dist` (dla aplikacji)
4. Adres: `https://username.github.io/repo-name/`

### Netlify / Vercel

1. Połącz repozytorium z Netlify lub Vercel
2. Skonfiguruj build command: `npm run build`
3. Publish directory: `dist`

### Inne opcje

- Firebase Hosting
- Surge.sh
- Dowolny hosting statycznych plików

## Współtworzenie

### Zgłaszanie błędów

Użyj [GitHub Issues](https://github.com/your-username/habits-tracker/issues) do zgłaszania błędów lub propozycji funkcji.

### Rozwój lokalny

1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Uruchom dev server: `npm run dev`
4. Dla testów: `npm run test` (jeśli dostępne)

### Wytyczne

- Kod w czystym JavaScript ES6+
- Semantic HTML i dostępność
- Minimalistyczny design
- Brak zewnętrznych zależności poza wymienionymi

---

Licencja: MIT
