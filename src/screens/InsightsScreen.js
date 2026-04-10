import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import {
  getCategoryBreakdown, getThisWeekTotal, getLastWeekTotal,
  getMonthlyTrend, getTopCategory, getTotalExpenses,
} from '../utils/calculations';
import { getCategoryInfo } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import { borderRadius, fontSize, spacing } from '../theme';
import EmptyState from '../components/EmptyState';

const screenWidth = Dimensions.get('window').width;

const periods = ['This Week', 'This Month', 'All Time'];

export default function InsightsScreen() {
  const { colors, isDark } = useTheme();
  const { transactions, settings } = useApp();
  const [period, setPeriod] = useState('All Time');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      if (period === 'This Week') {
        const d = new Date(t.date);
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      if (period === 'This Month') {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, period]);

  const breakdown = getCategoryBreakdown(filteredTransactions);
  const topCategory = getTopCategory(filteredTransactions);
  const thisWeek = getThisWeekTotal(transactions);
  const lastWeek = getLastWeekTotal(transactions);
  const monthlyTrend = getMonthlyTrend(transactions);
  const totalExpenses = getTotalExpenses(filteredTransactions);

  const weekDiff = lastWeek > 0
    ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
    : 0;

  if (transactions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.topBar}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>Insights</Text>
        </View>
        <EmptyState
          icon="analytics-outline"
          title="No data yet"
          subtitle="Add some transactions to see your spending insights"
        />
      </View>
    );
  }

  const smartTip = getSmartTip(breakdown, totalExpenses);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Insights</Text>
      </View>

      <View style={styles.periodRow}>
        {periods.map(p => (
          <View
            key={p}
            style={[
              styles.periodChip,
              { backgroundColor: period === p ? colors.primary : colors.card },
            ]}
          >
            <Text
              style={[styles.periodText, { color: period === p ? '#FFF' : colors.textSecondary }]}
              onPress={() => setPeriod(p)}
            >
              {p}
            </Text>
          </View>
        ))}
      </View>

      {topCategory && (
        <View style={[styles.topCatCard, { backgroundColor: colors.card }]}>
          <View style={styles.topCatHeader}>
            <View style={[
              styles.topCatIcon,
              { backgroundColor: getCategoryInfo(topCategory.category).color + '20' },
            ]}>
              <Ionicons
                name={getCategoryInfo(topCategory.category).icon}
                size={28}
                color={getCategoryInfo(topCategory.category).color}
              />
            </View>
            <View style={styles.topCatInfo}>
              <Text style={[styles.topCatLabel, { color: colors.textSecondary }]}>
                Top Spending Category
              </Text>
              <Text style={[styles.topCatName, { color: colors.text }]}>
                {getCategoryInfo(topCategory.category).label}
              </Text>
            </View>
            <Text style={[styles.topCatAmount, { color: colors.expense }]}>
              {formatCurrency(topCategory.amount, settings.currency)}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.compCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Week over Week</Text>
        <View style={styles.compRow}>
          <View style={styles.compItem}>
            <Text style={[styles.compLabel, { color: colors.textSecondary }]}>This Week</Text>
            <Text style={[styles.compAmount, { color: colors.text }]}>
              {formatCurrency(thisWeek, settings.currency)}
            </Text>
          </View>
          <View style={[styles.compDivider, { backgroundColor: colors.border }]} />
          <View style={styles.compItem}>
            <Text style={[styles.compLabel, { color: colors.textSecondary }]}>Last Week</Text>
            <Text style={[styles.compAmount, { color: colors.text }]}>
              {formatCurrency(lastWeek, settings.currency)}
            </Text>
          </View>
          <View style={[styles.compBadge, {
            backgroundColor: weekDiff <= 0 ? colors.incomeLight : colors.expenseLight,
          }]}>
            <Ionicons
              name={weekDiff <= 0 ? 'trending-down' : 'trending-up'}
              size={16}
              color={weekDiff <= 0 ? colors.income : colors.expense}
            />
            <Text style={[styles.compBadgeText, {
              color: weekDiff <= 0 ? colors.income : colors.expense,
            }]}>
              {Math.abs(weekDiff)}%
            </Text>
          </View>
        </View>
      </View>

      {breakdown.length > 0 && (
        <View style={[styles.breakdownCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Category Breakdown</Text>
          {breakdown.slice(0, 6).map((item, index) => {
            const cat = getCategoryInfo(item.category);
            const pct = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
            return (
              <View key={item.category} style={styles.breakdownRow}>
                <View style={[styles.breakdownIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon} size={18} color={cat.color} />
                </View>
                <Text style={[styles.breakdownName, { color: colors.text }]}>{cat.label}</Text>
                <View style={styles.breakdownBarTrack}>
                  <View style={[
                    styles.breakdownBarFill,
                    { width: `${pct}%`, backgroundColor: cat.color },
                  ]} />
                </View>
                <Text style={[styles.breakdownPct, { color: colors.textSecondary }]}>
                  {Math.round(pct)}%
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {monthlyTrend.some(m => m.amount > 0) && (
        <View style={[styles.trendCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Trend</Text>
          <LineChart
            data={{
              labels: monthlyTrend.map(m => m.month),
              datasets: [{ data: monthlyTrend.map(m => m.amount || 0) }],
            }}
            width={screenWidth - 64}
            height={180}
            fromZero
            withInnerLines={false}
            bezier
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: () => colors.primary,
              labelColor: () => colors.textSecondary,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary,
              },
              propsForBackgroundLines: { strokeWidth: 0 },
            }}
            style={styles.chart}
          />
        </View>
      )}

      {smartTip && (
        <View style={[styles.tipCard, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="bulb" size={24} color={colors.primary} />
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: colors.primary }]}>Smart Tip</Text>
            <Text style={[styles.tipText, { color: colors.text }]}>{smartTip}</Text>
          </View>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function getSmartTip(breakdown, total) {
  if (breakdown.length === 0) return null;
  const top = breakdown[0];
  const pct = total > 0 ? Math.round((top.amount / total) * 100) : 0;
  const catName = getCategoryInfo(top.category).label;
  if (pct > 40) {
    return `Your ${catName.toLowerCase()} spending is ${pct}% of total expenses. Consider setting a budget limit for this category.`;
  }
  if (pct > 25) {
    return `${catName} is your biggest expense at ${pct}%. Track it closely to find saving opportunities.`;
  }
  return `Your spending is well distributed. ${catName} leads at ${pct}% — keep up the balanced approach!`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  screenTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  periodRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  periodChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  periodText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  topCatCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  topCatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCatIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCatInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topCatLabel: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  topCatName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  topCatAmount: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  compCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compItem: {
    flex: 1,
    alignItems: 'center',
  },
  compLabel: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  compAmount: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  compDivider: {
    width: 1,
    height: 40,
    marginHorizontal: spacing.md,
  },
  compBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  compBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  breakdownCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  breakdownName: {
    width: 70,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  breakdownBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E8F0',
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownPct: {
    width: 35,
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'right',
  },
  trendCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chart: {
    borderRadius: borderRadius.md,
    marginLeft: -16,
  },
  tipCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
