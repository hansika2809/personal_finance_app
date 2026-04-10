import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatters';
import { borderRadius, fontSize, spacing } from '../theme';

export default function GoalCard({ goal, onPress, currency }) {
  const { colors } = useTheme();
  const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
  const percentage = Math.min(Math.round(progress * 100), 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => onPress && onPress(goal)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: goal.color + '20' }]}>
          <Ionicons name={goal.icon || 'flag'} size={24} color={goal.color} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.text }]}>{goal.title}</Text>
          <Text style={[styles.target, { color: colors.textSecondary }]}>
            Target: {formatCurrency(goal.targetAmount, currency)}
          </Text>
        </View>
        <Text style={[styles.percentage, { color: goal.color }]}>{percentage}%</Text>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.cardAlt }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%`, backgroundColor: goal.color },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.saved, { color: colors.text }]}>
          {formatCurrency(goal.currentAmount, currency)} saved
        </Text>
        <Text style={[styles.remaining, { color: colors.textSecondary }]}>
          {formatCurrency(remaining, currency)} to go
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  target: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  percentage: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  saved: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  remaining: {
    fontSize: fontSize.sm,
  },
});
