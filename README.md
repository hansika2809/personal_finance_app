# Personal Finance Companion

A cross-platform mobile app built with React Native (Expo) that helps users track spending, set savings goals, and gain insights into their financial habits.

## Features Implemented

| # | Feature | Status |
|---|---------|--------|
| 1 | Home Dashboard with Summary | ✅ |
| 2 | Visual Element (Charts, Trends, Breakdown) | ✅ |
| 3 | Transaction Tracking (Add, View, Edit, Delete) | ✅ |
| 4 | Transaction Filtering and Search | ✅ |
| 5 | Goal / Challenge Feature (No-Spend Streak) | ✅ |
| 6 | Insights Screen | ✅ |
| 7 | Smooth Navigation Flow | ✅ |
| 8 | Empty, Loading, and Error States | ✅ |
| 9 | Local Data Persistence (AsyncStorage) | ✅ |
| 10 | State Management (Context + useReducer) | ✅ |

## Additional Features

- Dark Mode support
- Multi-currency support (INR, USD, EUR, GBP)
- No-Spend Streak gamification with calendar heatmap
- Smart spending tips based on patterns
- Week-over-week spending comparison
- Monthly trend line chart
- Category breakdown with progress bars
- Seed data for immediate demo experience

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **State Management**: React Context API with useReducer
- **Local Storage**: AsyncStorage (offline-first)
- **Charts**: react-native-chart-kit with react-native-svg
- **Date Handling**: date-fns
- **Icons**: @expo/vector-icons (Ionicons)

## Project Structure

```
FinanceApp/
├── App.js                              # Entry point
├── src/
│   ├── context/
│   │   ├── AppContext.js               # Global state (transactions, goals, settings)
│   │   └── ThemeContext.js             # Dark/light mode
│   ├── data/
│   │   ├── categories.js              # Category definitions
│   │   └── seedData.js                # Sample data for first launch
│   ├── screens/
│   │   ├── HomeScreen.js              # Dashboard
│   │   ├── TransactionsScreen.js      # Transaction list with search/filter
│   │   ├── AddTransactionScreen.js    # Add/Edit transaction form
│   │   ├── GoalsScreen.js             # Goals + No-Spend Challenge
│   │   ├── InsightsScreen.js          # Analytics and patterns
│   │   └── SettingsScreen.js          # App settings
│   ├── components/
│   │   ├── BalanceCard.js             # Gradient balance display
│   │   ├── SummaryCards.js            # Income/Expense/Savings row
│   │   ├── SpendingChart.js           # Weekly bar chart
│   │   ├── TransactionItem.js         # Transaction list item
│   │   ├── GoalCard.js                # Goal progress card
│   │   └── EmptyState.js             # Empty state display
│   ├── navigation/
│   │   └── AppNavigator.js            # Tab + Stack navigation
│   ├── utils/
│   │   ├── storage.js                 # AsyncStorage helpers
│   │   ├── formatters.js             # Currency/date formatting
│   │   └── calculations.js           # Financial computations
│   └── theme/
│       └── index.js                   # Design tokens
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for mobile testing)

### Installation

```bash
git clone <your-repo-url>
cd FinanceApp
npm install
```

### Run the App

```bash
# Start the development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web (for preview)
npx expo start --web
```

### Build APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK
eas build -p android --profile preview
```

Add this to your `eas.json` before building:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## Assumptions and Design Decisions

1. **Offline-First**: All data is stored locally using AsyncStorage. No backend required.
2. **Seed Data**: The app ships with sample transactions and goals so dashboard and charts are populated on first launch.
3. **Currency**: Defaults to INR (₹) with support for USD, EUR, and GBP in Settings.
4. **No-Spend Challenge**: Tracks days without any expense as a streak. Calendar heatmap shows last 14 days.
5. **Smart Tips**: Auto-generated spending advice based on category breakdown percentages.
6. **Date Handling**: Transactions use current date by default. Date picker UI is shown but simplified for this version.

## Screens Overview

### 1. Home Dashboard
- Greeting with user name and current date
- Gradient balance card with total balance
- Income / Expenses / Savings summary cards
- Weekly spending bar chart (last 7 days)
- Top goal with progress bar
- Recent 5 transactions with "See All" link

### 2. Transactions
- Search bar (searches by description and category)
- Filter chips (All / Income / Expense)
- Date-grouped transaction list (Today, Yesterday, etc.)
- Floating action button to add new transaction
- Long press to delete with confirmation
- Tap to edit existing transaction

### 3. Add/Edit Transaction
- Income / Expense type toggle
- Large amount input with currency symbol
- Category grid with icons
- Date display
- Optional notes field
- Delete option for existing transactions

### 4. Goals & Challenges
- No-Spend Streak counter with emoji progression
- 14-day calendar heatmap (green = no-spend, red = spent)
- Savings goals with progress bars
- Add funds to goals
- Create/Edit/Delete goals with icon and color picker

### 5. Insights
- Period selector (This Week / This Month / All Time)
- Top spending category highlight
- Week-over-week comparison with percentage change
- Category breakdown with horizontal bars
- Monthly spending trend (line chart)
- Context-aware smart tips

### 6. Settings
- User name (editable)
- Monthly budget (editable)
- Dark mode toggle
- Currency selection
- Reset all data

## Architecture

### State Management
The app uses React Context API with `useReducer` for predictable state updates:
- `AppContext`: Manages transactions, goals, and settings
- `ThemeContext`: Manages dark/light mode

### Data Persistence
- All state changes are automatically saved to AsyncStorage
- Data loads from AsyncStorage on app startup
- Falls back to seed data if no saved data exists

### Navigation
- Bottom Tab Navigator with 5 tabs
- Native Stack Navigator for modal screens (Add/Edit Transaction)
- Smooth slide-from-bottom animation for modals

## License

MIT
