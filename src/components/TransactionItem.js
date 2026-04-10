import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getCategoryInfo } from '../data/categories';
import { formatCurrency, formatTime } from '../utils/formatters';
import { borderRadius, fontSize, spacing } from '../theme';

export default function TransactionItem({ transaction, onPress, currency }) {
  const { colors } = useTheme();
  const category = getCategoryInfo(transaction.category);
  const isExpense = transaction.type === 'expense';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress && onPress(transaction)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon} size={22} color={category.color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{category.label}</Text>
        <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>
          {transaction.note || 'No description'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isExpense ? colors.expense : colors.income }]}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, currency)}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary }]}>
          {formatTime(transaction.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  note: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  time: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
