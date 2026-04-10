import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { getTotalIncome, getTotalExpenses } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { borderRadius, fontSize, spacing } from '../theme';

function SummaryItem({ icon, label, amount, color, bgColor }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.item, { backgroundColor: colors.card }]}>
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{amount}</Text>
    </View>
  );
}

export default function SummaryCards() {
  const { colors } = useTheme();
  const { transactions, settings } = useApp();

  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const savings = income - expenses;

  return (
    <View style={styles.container}>
      <SummaryItem
        icon="arrow-down-circle"
        label="Income"
        amount={formatCurrency(income, settings.currency)}
        color={colors.income}
        bgColor={colors.incomeLight}
      />
      <SummaryItem
        icon="arrow-up-circle"
        label="Expenses"
        amount={formatCurrency(expenses, settings.currency)}
        color={colors.expense}
        bgColor={colors.expenseLight}
      />
      <SummaryItem
        icon="wallet"
        label="Savings"
        amount={formatCurrency(savings, settings.currency)}
        color={colors.savings}
        bgColor={colors.savingsLight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  item: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    marginBottom: 2,
  },
  amount: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
