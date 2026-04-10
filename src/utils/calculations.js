import { startOfWeek, endOfWeek, subWeeks, subMonths, format, parseISO, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';

export const getTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getBalance = (transactions) => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

export const getCategoryBreakdown = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const breakdown = {};
  expenses.forEach(t => {
    if (!breakdown[t.category]) {
      breakdown[t.category] = 0;
    }
    breakdown[t.category] += t.amount;
  });
  return Object.entries(breakdown)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const getWeeklySpending = (transactions) => {
  const today = new Date();
  const days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTotal = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(dayStr))
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      day: format(day, 'EEE'),
      amount: dayTotal,
    };
  });
};

export const getThisWeekTotal = (transactions) => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  return transactions
    .filter(t => {
      const d = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(d, { start: weekStart, end: weekEnd });
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getLastWeekTotal = (transactions) => {
  const now = new Date();
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  return transactions
    .filter(t => {
      const d = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(d, { start: lastWeekStart, end: lastWeekEnd });
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getMonthlyTrend = (transactions) => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const total = transactions
      .filter(t => {
        const d = parseISO(t.date);
        return t.type === 'expense' && isWithinInterval(d, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, t) => sum + t.amount, 0);
    months.push({
      month: format(monthDate, 'MMM'),
      amount: total,
    });
  }
  return months;
};

export const getTopCategory = (transactions) => {
  const breakdown = getCategoryBreakdown(transactions);
  return breakdown.length > 0 ? breakdown[0] : null;
};

export const getNoSpendDays = (transactions) => {
  const today = new Date();
  const days = eachDayOfInterval({
    start: subDays(today, 29),
    end: today,
  });

  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const hasExpense = transactions.some(
      t => t.type === 'expense' && t.date.startsWith(dayStr)
    );
    return {
      date: dayStr,
      day: format(day, 'd'),
      noSpend: !hasExpense,
    };
  });
};

export const getCurrentStreak = (transactions) => {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i <= 30; i++) {
    const day = subDays(today, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const hasExpense = transactions.some(
      t => t.type === 'expense' && t.date.startsWith(dayStr)
    );
    if (hasExpense) break;
    streak++;
  }
  return streak;
};
