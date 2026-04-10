import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/GoalCard';
import EmptyState from '../components/EmptyState';
import { getNoSpendDays, getCurrentStreak } from '../utils/calculations';
import { borderRadius, fontSize, spacing } from '../theme';

const goalIcons = [
  'shield-checkmark', 'laptop', 'car', 'home', 'airplane',
  'gift', 'school', 'fitness', 'heart', 'star',
];

const goalColors = [
  '#6C63FF', '#00C48C', '#FF6B6B', '#FFB347', '#4ECDC4',
  '#EC4899', '#3B82F6', '#8B5CF6', '#F59E0B', '#14B8A6',
];

export default function GoalsScreen() {
  const { colors } = useTheme();
  const { goals, transactions, settings, addGoal, updateGoal, deleteGoal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('shield-checkmark');
  const [selectedColor, setSelectedColor] = useState('#6C63FF');
  const [fundAmount, setFundAmount] = useState('');
  const [fundingGoalId, setFundingGoalId] = useState(null);

  const streak = getCurrentStreak(transactions);
  const noSpendDays = getNoSpendDays(transactions);
  const noSpendCount = noSpendDays.filter(d => d.noSpend).length;

  const openNewGoal = () => {
    setEditGoal(null);
    setTitle('');
    setTarget('');
    setSelectedIcon('shield-checkmark');
    setSelectedColor('#6C63FF');
    setShowModal(true);
  };

  const handleSaveGoal = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    if (!target || parseFloat(target) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    if (editGoal) {
      updateGoal({
        ...editGoal,
        title: title.trim(),
        targetAmount: parseFloat(target),
        icon: selectedIcon,
        color: selectedColor,
      });
    } else {
      addGoal({
        id: Date.now().toString(),
        title: title.trim(),
        targetAmount: parseFloat(target),
        currentAmount: 0,
        deadline: '',
        icon: selectedIcon,
        color: selectedColor,
        createdAt: new Date().toISOString(),
      });
    }
    setShowModal(false);
  };

  const handleGoalPress = (goal) => {
    Alert.alert(goal.title, 'What would you like to do?', [
      { text: 'Add Funds', onPress: () => setFundingGoalId(goal.id) },
      {
        text: 'Edit',
        onPress: () => {
          setEditGoal(goal);
          setTitle(goal.title);
          setTarget(String(goal.targetAmount));
          setSelectedIcon(goal.icon || 'shield-checkmark');
          setSelectedColor(goal.color || '#6C63FF');
          setShowModal(true);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteGoal(goal.id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAddFunds = () => {
    const amt = parseFloat(fundAmount);
    if (!amt || amt <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    const goal = goals.find(g => g.id === fundingGoalId);
    if (goal) {
      updateGoal({ ...goal, currentAmount: goal.currentAmount + amt });
    }
    setFundingGoalId(null);
    setFundAmount('');
  };

  const getStreakEmoji = () => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  const getStreakMessage = () => {
    if (streak >= 7) return 'Amazing streak! Keep it going!';
    if (streak >= 3) return 'Great progress! Stay strong!';
    if (streak >= 1) return 'Good start! One day at a time.';
    return 'Start your no-spend challenge today!';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Goals & Challenges</Text>
      </View>

      <View style={[styles.streakCard, { backgroundColor: colors.card }]}>
        <View style={styles.streakHeader}>
          <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
          <View style={styles.streakInfo}>
            <Text style={[styles.streakTitle, { color: colors.text }]}>No-Spend Streak</Text>
            <Text style={[styles.streakMessage, { color: colors.textSecondary }]}>
              {getStreakMessage()}
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: colors.streak + '20' }]}>
            <Text style={[styles.streakCount, { color: colors.streak }]}>{streak}</Text>
            <Text style={[styles.streakLabel, { color: colors.streak }]}>days</Text>
          </View>
        </View>

        <View style={styles.calendarGrid}>
          {noSpendDays.slice(-14).map((day, i) => (
            <View
              key={i}
              style={[
                styles.calendarDay,
                {
                  backgroundColor: day.noSpend ? colors.income + '30' : colors.expense + '30',
                },
              ]}
            >
              <Text style={[
                styles.calendarDayText,
                { color: day.noSpend ? colors.income : colors.expense },
              ]}>
                {day.day}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              No-spend ({noSpendCount} days)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Spent ({30 - noSpendCount} days)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.goalsSection}>
        <View style={styles.goalsSectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Savings Goals</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primaryLight }]}
            onPress={openNewGoal}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>New Goal</Text>
          </TouchableOpacity>
        </View>

        {goals.length === 0 ? (
          <EmptyState
            icon="flag-outline"
            title="No goals yet"
            subtitle="Create a savings goal to start tracking your progress"
          />
        ) : (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={settings.currency}
              onPress={handleGoalPress}
            />
          ))
        )}
      </View>

      <View style={{ height: 100 }} />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editGoal ? 'Edit Goal' : 'New Goal'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Emergency Fund"
              placeholderTextColor={colors.textTertiary}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Target Amount</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={target}
              onChangeText={setTarget}
              keyboardType="numeric"
              placeholder="e.g. 50000"
              placeholderTextColor={colors.textTertiary}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Icon</Text>
            <View style={styles.iconRow}>
              {goalIcons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    {
                      backgroundColor: selectedIcon === icon ? selectedColor + '20' : colors.card,
                      borderColor: selectedIcon === icon ? selectedColor : colors.border,
                      borderWidth: selectedIcon === icon ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons name={icon} size={22} color={selectedIcon === icon ? selectedColor : colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>
            <View style={styles.colorRow}>
              {goalColors.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: c,
                      borderWidth: selectedColor === c ? 3 : 0,
                      borderColor: '#FFF',
                    },
                  ]}
                  onPress={() => setSelectedColor(c)}
                >
                  {selectedColor === c && (
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSaveGoal}
            >
              <Text style={styles.saveBtnText}>{editGoal ? 'Update Goal' : 'Create Goal'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={fundingGoalId !== null} animationType="fade" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.fundModal, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Funds</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={fundAmount}
              onChangeText={setFundAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={colors.textTertiary}
            />
            <View style={styles.fundActions}>
              <TouchableOpacity
                style={[styles.fundCancel, { backgroundColor: colors.card }]}
                onPress={() => { setFundingGoalId(null); setFundAmount(''); }}
              >
                <Text style={[styles.fundCancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fundSave, { backgroundColor: colors.primary }]}
                onPress={handleAddFunds}
              >
                <Text style={styles.fundSaveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  screenTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  streakCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  streakEmoji: {
    fontSize: 36,
  },
  streakInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  streakMessage: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  streakBadge: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  streakCount: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  calendarDay: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: fontSize.xs,
  },
  goalsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  goalsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  addButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    borderWidth: 1,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  fundModal: {
    margin: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  fundActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  fundCancel: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  fundCancelText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  fundSave: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  fundSaveText: {
    color: '#FFF',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
