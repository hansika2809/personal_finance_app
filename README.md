# Personal Finance Companion

A simple, clean personal finance tracker built with React Native and Expo. The idea behind this app is to give users a lightweight way to keep track of their daily spending, set savings goals, and understand where their money goes — without the complexity of a full banking app.

I chose React Native with Expo because it lets me build for both Android and iOS from a single codebase, and Expo makes the development workflow really smooth.

## What the App Does

The app has five main sections:

**Home Dashboard** — When you open the app, you get a quick snapshot of your finances. There's a balance card at the top, followed by income, expenses, and savings summaries. Below that, there's a bar chart showing your spending over the last 7 days, your top savings goal, and your most recent transactions.

**Transactions** — This is where you can add, view, edit, and delete transactions. Each transaction has an amount, type (income or expense), category, date, and an optional note. There's a search bar to find specific transactions and filter chips to toggle between All, Income, and Expense views. Transactions are grouped by date (Today, Yesterday, etc.) which makes it easy to scan through.

**Goals & Challenges** — I wanted to add something that makes the app feel more engaging, so I built a "No-Spend Streak" feature. It tracks how many consecutive days you've gone without spending and shows a calendar heatmap of your spend/no-spend days. Below that, you can create savings goals with custom icons and colors, track progress, and add funds toward each goal.

**Insights** — This screen helps you understand your spending patterns. It shows your top spending category, a week-over-week comparison (with percentage change), a category breakdown with horizontal bars, and a monthly trend line chart. There's also a smart tip at the bottom that gives you context-aware advice based on your actual spending data.

**Settings** — You can change your name, set a monthly budget, toggle dark mode, switch between currencies (INR, USD, EUR, GBP), or reset all data.

## Features Checklist

- [x] Home Dashboard with financial summary
- [x] Visual elements (bar chart, line chart, category breakdown)
- [x] Transaction tracking — add, view, edit, delete
- [x] Transaction filtering and search
- [x] Goal/Challenge feature (No-Spend Streak + Savings Goals)
- [x] Insights screen with spending analysis
- [x] Smooth navigation with bottom tabs and modal transitions
- [x] Empty states, loading states, and error handling
- [x] Local data persistence using AsyncStorage
- [x] State management with Context API and useReducer
- [x] Dark mode
- [x] Multi-currency support

## Tech Stack

- **React Native** with **Expo SDK 54**
- **React Navigation** — bottom tabs + native stack for modals
- **Context API + useReducer** — for global state management
- **AsyncStorage** — for offline-first local data persistence
- **react-native-chart-kit** — for bar and line charts
- **date-fns** — for date formatting and calculations
- **Ionicons** — for all the icons throughout the app

## Project Structure

```
FinanceApp/
├── App.js                     — app entry point, wraps providers
├── src/
│   ├── context/
│   │   ├── AppContext.js      — global state (transactions, goals, settings)
│   │   └── ThemeContext.js    — dark/light mode toggle
│   ├── data/
│   │   ├── categories.js     — category definitions with icons and colors
│   │   └── seedData.js       — sample data so the app isn't empty on first launch
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── TransactionsScreen.js
│   │   ├── AddTransactionScreen.js
│   │   ├── GoalsScreen.js
│   │   ├── InsightsScreen.js
│   │   └── SettingsScreen.js
│   ├── components/
│   │   ├── BalanceCard.js     — gradient balance display
│   │   ├── SummaryCards.js    — income/expense/savings row
│   │   ├── SpendingChart.js   — weekly bar chart
│   │   ├── TransactionItem.js — single transaction row
│   │   ├── GoalCard.js        — goal with progress bar
│   │   └── EmptyState.js      — placeholder for empty screens
│   ├── navigation/
│   │   └── AppNavigator.js    — tab and stack navigator setup
│   ├── utils/
│   │   ├── storage.js         — AsyncStorage read/write helpers
│   │   ├── formatters.js      — currency and date formatting
│   │   └── calculations.js    — totals, breakdowns, streaks, trends
│   └── theme/
│       └── index.js           — color palettes, spacing, typography tokens
```

## How to Run

### Prerequisites
- Node.js 18 or higher
- npm
- Expo Go app on your phone (for testing on a real device)

### Steps

```bash
# clone the repo
git clone https://github.com/YOUR_USERNAME/FinanceApp.git
cd FinanceApp

# install dependencies
npm install

# start the dev server
npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS) to run it on your phone.

To run on web for a quick preview:
```bash
npx expo start --web
```

## Building the APK

```bash
# install EAS CLI globally
npm install -g eas-cli

# log in to your Expo account
eas login

# build the APK
eas build -p android --profile preview
```

The build takes around 10-15 minutes. Once done, you can download the APK from your Expo dashboard.

## Design Decisions and Assumptions

**Offline-first approach** — I went with AsyncStorage for all data persistence. There's no backend or API calls. Everything works offline, which felt right for a personal finance tracker that people would use on the go.

**Seed data on first launch** — The app comes pre-loaded with about 20 sample transactions and 2 goals. This way, the dashboard, charts, and insights aren't empty when you first open the app. You can clear everything from Settings > Reset All Data.

**Currency defaults to INR** — Since this is being developed in India, the default currency is Indian Rupee (₹). You can switch to USD, EUR, or GBP from Settings.

**No-Spend Streak as the creative feature** — I picked this because it felt like something that would actually motivate users. It's simple to understand (don't spend today and your streak goes up), visual (calendar heatmap), and gives a sense of progress.

**Date selection** — The add transaction form shows the current date by default. For a production app, I'd integrate a proper date picker, but for this version the current date works for demo purposes.

**Clean code, no comments** — I focused on writing self-documenting code with clear variable names and function names instead of adding inline comments. The project structure itself is organized to be easy to follow.

## What I'd Add With More Time

- Proper date picker in the transaction form
- Animated number transitions on the balance card
- Notification reminders to log transactions
- Data export (CSV/JSON)
- Biometric lock
- Recurring transactions
- Budget limits per category with alerts
