import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { getBalance } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { borderRadius, fontSize, spacing } from '../theme';

export default function BalanceCard() {
  const { colors } = useTheme();
  const { transactions, settings } = useApp();
  const balance = getBalance(transactions);

  return (
    <LinearGradient
      colors={[colors.primary, '#4A40E0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.label}>Total Balance</Text>
      <Text style={styles.amount}>
        {formatCurrency(balance, settings.currency)}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.hint}>Updated just now</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: fontSize.hero,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: spacing.lg,
  },
  hint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSize.xs,
  },
});
