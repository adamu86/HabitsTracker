# 🔥 Habits Tracker

Kompletna aplikacja do śledzenia nawyków, zbudowana z użyciem Vanilla JavaScript, Supabase i Chart.js.

![Habits Tracker](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Funkcjonalności

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

## 🏗️ Architektura

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

## 🚀 Instalacja i Uruchomienie

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

## 📊 Struktura bazy danych

### Tabela `habits`
```sql
- id (uuid, PK)
- name (text, 3-50 znaków)
- description (text, max 200 znaków)
- category (text: Wellness, Learning, Fitness, Health, Productivity, Other)
- color (text, hex color)
- icon (text, emoji)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Tabela `progress`
```sql
- id (uuid, PK)
- habit_id (uuid, FK -> habits)
- date (date, YYYY-MM-DD)
- done (boolean)
- created_at (timestamptz)
- UNIQUE(habit_id, date)
```

## 🎨 Design

Design aplikacji jest inspirowany materiałami z Figma i zawiera:

- **Tryb ciemny** - Ciemny motyw z gradientami (#0f172a, #1e293b)
- **Tryb jasny** - Jasny motyw z minimalistycznym designem (#f1f5f9, #ffffff)
- **Responsywność** - Pełna obsługa od 360px do 1440px+
- **Interakcje** - Smooth transitions (200-300ms), hover states, focus management
- **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

### Paleta kolorów

**Kategorie:**
- Wellness: `#93c5fd` (niebieski)
- Learning: `#86efac` (zielony)
- Fitness: `#fdba74` (pomarańczowy)
- Health: `#fca5a5` (czerwony)
- Productivity: `#d8b4fe` (fioletowy)
- Other: `#bfdbfe` (jasnoniebieski)

## 🔧 Funkcjonalności szczegółowo

### 1. Zarządzanie nawykami
- **Dodawanie**: Formularz z nazwą, opisem, kategorią i kolorem
- **Edycja**: Modyfikacja wszystkich pól nawyku
- **Usuwanie**: Z potwierdzeniem, aby zapobiec przypadkowym usunięciom
- **Walidacja**: Nazwa min. 3 znaki, max 50 znaków

### 2. Tracking postępu
- **Siatka tygodniowa**: 7 dni z możliwością toggle stanu
- **Wizualne oznaczenie**: Zielony = wykonane, Szary = nie wykonane
- **Dzisiejsza data**: Oznaczona niebieską kropką
- **Dni przyszłe**: Wyłączone (disabled)

### 3. Statystyki i analityka
- **Current Streak**: Najdłuższa seria kolejnych dni wykonania
- **Total Habits**: Liczba wszystkich nawyków
- **This Week**: Procent wykonania w bieżącym tygodniu
- **Category Distribution**: Wykres kołowy z podziałem na kategorie
- **Weekly Progress**: Wykres słupkowy pokazujący postęp w każdym dniu tygodnia

### 4. Udostępnianie
- **Generowanie linku**: Dane kodowane w base64 w URL
- **Tryb read-only**: Wyłączenie wszystkich funkcji edycji
- **Banner informacyjny**: Widoczny w trybie publicznym

### 5. Tryb ciemny/jasny
- **Automatyczne wykrywanie**: System preference
- **Przełącznik**: Ikona słońca/księżyca w nagłówku
- **Persystencja**: Zapisywanie w localStorage

## 🎯 Użytkowanie

### Dodawanie nowego nawyku
1. Kliknij przycisk "Add Habit" w nagłówku
2. Wypełnij formularz:
   - Nazwa (wymagana, 3-50 znaków)
   - Opis (opcjonalny, max 200 znaków)
   - Wybierz kolor z palety
   - Wybierz kategorię
3. Kliknij "Add Habit"

### Śledzenie postępu
1. Kliknij na dzień tygodnia w karcie nawyku
2. Dzień zostanie oznaczony jako wykonany (zielony)
3. Kliknij ponownie, aby odznaczyć

### Edycja nawyku
1. Kliknij ikonę ołówka na karcie nawyku
2. Zmodyfikuj pola w formularzu
3. Kliknij "Save Changes"

### Usuwanie nawyku
1. Kliknij ikonę kosza na karcie nawyku
2. Potwierdź usunięcie w dialogu

### Udostępnianie dashboardu
1. Kliknij przycisk "Share" w nagłówku
2. Skopiuj wygenerowany link
3. Wyślij link do innych osób
4. Osoby z linkiem zobaczą dashboard w trybie read-only

## ♿ Accessibility

Aplikacja jest w pełni dostępna i zawiera:

- **Semantic HTML**: Poprawna struktura tagów HTML5
- **ARIA labels**: Na wszystkich interaktywnych elementach
- **Keyboard navigation**: Pełna obsługa klawiatury (Tab, Enter, Escape)
- **Focus management**: Widoczne focus states na wszystkich elementach
- **Screen reader support**: Poprawne oznaczenia dla czytników ekranu
- **Touch-friendly**: Minimum 44px hit targets na urządzeniach dotykowych
- **Color contrast**: Minimum WCAG AA dla wszystkich tekstów

## 🧪 Testowanie

### Manualne testowanie
1. **CRUD nawyków**: Dodaj, edytuj i usuń nawyk
2. **Tracking**: Kliknij dni tygodnia i sprawdź aktualizację
3. **Udostępnianie**: Wygeneruj link i otwórz w nowej karcie
4. **Responsywność**: Przetestuj na różnych rozmiarach ekranu
5. **Tryb ciemny/jasny**: Przełącz motyw i sprawdź wszystkie funkcje

### Testy w przeglądarce
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować ten kod.

## 🤝 Wkład

Projekt stworzony jako kompletna demonstracja aplikacji do śledzenia nawyków.

## 📞 Wsparcie

W przypadku problemów lub pytań, sprawdź:
1. Dokumentację Supabase: https://supabase.com/docs
2. Dokumentację Chart.js: https://www.chartjs.org/docs/
3. Dokumentację Vite: https://vitejs.dev/

---

**Built with ❤️ using Vanilla JavaScript, Supabase, and Chart.js**
