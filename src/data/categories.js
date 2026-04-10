const categories = {
  food: { label: 'Food', icon: 'fast-food', color: '#FF6B6B', type: 'expense' },
  transport: { label: 'Transport', icon: 'car', color: '#4ECDC4', type: 'expense' },
  shopping: { label: 'Shopping', icon: 'bag-handle', color: '#A78BFA', type: 'expense' },
  bills: { label: 'Bills', icon: 'receipt', color: '#F59E0B', type: 'expense' },
  entertainment: { label: 'Entertainment', icon: 'game-controller', color: '#EC4899', type: 'expense' },
  health: { label: 'Health', icon: 'medkit', color: '#10B981', type: 'expense' },
  education: { label: 'Education', icon: 'book', color: '#3B82F6', type: 'expense' },
  groceries: { label: 'Groceries', icon: 'cart', color: '#F97316', type: 'expense' },
  other_expense: { label: 'Other', icon: 'ellipsis-horizontal-circle', color: '#6B7280', type: 'expense' },
  salary: { label: 'Salary', icon: 'wallet', color: '#00C48C', type: 'income' },
  freelance: { label: 'Freelance', icon: 'laptop', color: '#6C63FF', type: 'income' },
  gift: { label: 'Gift', icon: 'gift', color: '#EC4899', type: 'income' },
  investment: { label: 'Investment', icon: 'trending-up', color: '#14B8A6', type: 'income' },
  other_income: { label: 'Other', icon: 'add-circle', color: '#8B5CF6', type: 'income' },
};

export const expenseCategories = Object.entries(categories)
  .filter(([_, v]) => v.type === 'expense')
  .map(([key, val]) => ({ key, ...val }));

export const incomeCategories = Object.entries(categories)
  .filter(([_, v]) => v.type === 'income')
  .map(([key, val]) => ({ key, ...val }));

export const getCategoryInfo = (key) => categories[key] || categories.other_expense;

export default categories;
