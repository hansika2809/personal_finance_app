import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { getWeeklySpending } from '../utils/calculations';
import { borderRadius, fontSize, spacing } from '../theme';

const screenWidth = Dimensions.get('window').width;

export default function SpendingChart() {
  const { colors, isDark } = useTheme();
  const { transactions } = useApp();
  const weeklyData = getWeeklySpending(transactions);

  const chartData = {
    labels: weeklyData.map(d => d.day),
    datasets: [{ data: weeklyData.map(d => d.amount || 0) }],
  };

  const hasData = weeklyData.some(d => d.amount > 0);

  if (!hasData) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Weekly Spending</Text>
        <Text style={[styles.empty, { color: colors.textSecondary }]}>No spending data this week</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Weekly Spending</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 64}
        height={180}
        fromZero
        showValuesOnTopOfBars={false}
        withInnerLines={false}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 0,
          color: () => colors.primary,
          labelColor: () => colors.textSecondary,
          barPercentage: 0.5,
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: borderRadius.md,
    marginLeft: -16,
  },
  empty: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: 40,
  },
});
