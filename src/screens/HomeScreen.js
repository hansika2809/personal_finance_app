import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import BalanceCard from '../components/BalanceCard';
import SummaryCards from '../components/SummaryCards';
import SpendingChart from '../components/SpendingChart';
import TransactionItem from '../components/TransactionItem';
import { fontSize, spacing } from '../theme';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { transactions, goals, settings, loading } = useApp();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const topGoal = goals[0];
  const greeting = getGreeting();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting}</Text>
          <Text style={[styles.name, { color: colors.text }]}>{settings.userName} 👋</Text>
        </View>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {format(new Date(), 'MMM d, yyyy')}
        </Text>
      </View>

      <BalanceCard />
      <SummaryCards />
      <SpendingChart />

      {topGoal && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Goal</Text>
          <TouchableOpacity
            style={[styles.goalMini, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Goals')}
            activeOpacity={0.7}
          >
            <View style={[styles.goalIcon, { backgroundColor: topGoal.color + '20' }]}>
              <Ionicons name={topGoal.icon || 'flag'} size={24} color={topGoal.color} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>{topGoal.title}</Text>
              <View style={[styles.goalProgress, { backgroundColor: colors.cardAlt }]}>
                <View
                  style={[
                    styles.goalProgressFill,
                    {
                      width: `${Math.min((topGoal.currentAmount / topGoal.targetAmount) * 100, 100)}%`,
                      backgroundColor: topGoal.color,
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={[styles.goalPercent, { color: topGoal.color }]}>
              {Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100)}%
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No transactions yet
          </Text>
        ) : (
          recentTransactions.map(t => (
            <TransactionItem
              key={t.id}
              transaction={t}
              currency={settings.currency}
              onPress={() => navigation.navigate('Transactions', {
                screen: 'TransactionsList',
                params: { editTransaction: t },
              })}
            />
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  greeting: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: 2,
  },
  date: {
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: spacing.xl,
    fontSize: fontSize.sm,
  },
  goalMini: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  goalTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  goalProgress: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalPercent: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginLeft: spacing.md,
  },
});
