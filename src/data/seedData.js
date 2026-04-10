import { subDays, format } from 'date-fns';

const generateDate = (daysAgo, hour = 10) => {
  const d = subDays(new Date(), daysAgo);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
};

export const seedTransactions = [
  { id: '1', amount: 45000, type: 'income', category: 'salary', date: generateDate(28, 9), note: 'Monthly salary' },
  { id: '2', amount: 8000, type: 'income', category: 'freelance', date: generateDate(20, 14), note: 'Logo design project' },
  { id: '3', amount: 350, type: 'expense', category: 'food', date: generateDate(0, 13), note: 'Lunch at cafe' },
  { id: '4', amount: 150, type: 'expense', category: 'transport', date: generateDate(0, 9), note: 'Auto rickshaw' },
  { id: '5', amount: 2500, type: 'expense', category: 'shopping', date: generateDate(1, 16), note: 'New headphones' },
  { id: '6', amount: 800, type: 'expense', category: 'food', date: generateDate(1, 20), note: 'Dinner with friends' },
  { id: '7', amount: 1200, type: 'expense', category: 'bills', date: generateDate(2, 10), note: 'Electricity bill' },
  { id: '8', amount: 500, type: 'expense', category: 'entertainment', date: generateDate(2, 18), note: 'Movie tickets' },
  { id: '9', amount: 3500, type: 'expense', category: 'groceries', date: generateDate(3, 11), note: 'Weekly groceries' },
  { id: '10', amount: 200, type: 'expense', category: 'transport', date: generateDate(3, 8), note: 'Bus pass' },
  { id: '11', amount: 1500, type: 'expense', category: 'health', date: generateDate(5, 15), note: 'Gym membership' },
  { id: '12', amount: 750, type: 'expense', category: 'food', date: generateDate(5, 13), note: 'Restaurant dinner' },
  { id: '13', amount: 2000, type: 'expense', category: 'education', date: generateDate(7, 10), note: 'Online course' },
  { id: '14', amount: 5000, type: 'income', category: 'gift', date: generateDate(7, 12), note: 'Birthday gift' },
  { id: '15', amount: 450, type: 'expense', category: 'food', date: generateDate(8, 12), note: 'Coffee and snacks' },
  { id: '16', amount: 6000, type: 'expense', category: 'shopping', date: generateDate(10, 15), note: 'Clothes shopping' },
  { id: '17', amount: 300, type: 'expense', category: 'transport', date: generateDate(12, 9), note: 'Uber ride' },
  { id: '18', amount: 1800, type: 'expense', category: 'bills', date: generateDate(14, 10), note: 'Internet bill' },
  { id: '19', amount: 2200, type: 'expense', category: 'groceries', date: generateDate(18, 11), note: 'Groceries restock' },
  { id: '20', amount: 15000, type: 'income', category: 'freelance', date: generateDate(15, 14), note: 'App development project' },
  { id: '21', amount: 900, type: 'expense', category: 'entertainment', date: generateDate(21, 19), note: 'Concert tickets' },
  { id: '22', amount: 400, type: 'expense', category: 'food', date: generateDate(22, 13), note: 'Pizza delivery' },
];

export const seedGoals = [
  {
    id: 'g1',
    title: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 18500,
    deadline: '2026-08-31',
    icon: 'shield-checkmark',
    color: '#6C63FF',
    createdAt: generateDate(60),
  },
  {
    id: 'g2',
    title: 'New Laptop',
    targetAmount: 80000,
    currentAmount: 32000,
    deadline: '2026-12-31',
    icon: 'laptop',
    color: '#00C48C',
    createdAt: generateDate(45),
  },
];

export const defaultSettings = {
  currency: 'INR',
  darkMode: false,
  monthlyBudget: 30000,
  userName: 'User',
};
