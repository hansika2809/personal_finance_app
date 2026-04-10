import { format, isToday, isYesterday, parseISO } from 'date-fns';

const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const formatCurrency = (amount, currency = 'INR') => {
  const symbol = currencySymbols[currency] || '₹';
  const absAmount = Math.abs(amount);
  if (absAmount >= 100000) {
    return `${symbol}${(absAmount / 100000).toFixed(1)}L`;
  }
  if (absAmount >= 1000) {
    return `${symbol}${absAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return `${symbol}${absAmount.toFixed(absAmount % 1 === 0 ? 0 : 2)}`;
};

export const formatDate = (dateStr) => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};

export const formatTime = (dateStr) => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'h:mm a');
};

export const formatMonthYear = (dateStr) => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMM yyyy');
};

export const getGroupKey = (dateStr) => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};
