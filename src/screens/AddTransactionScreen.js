import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { expenseCategories, incomeCategories } from '../data/categories';
import { borderRadius, fontSize, spacing } from '../theme';
import { format } from 'date-fns';

export default function AddTransactionScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { addTransaction, updateTransaction, deleteTransaction } = useApp();
  const editing = route.params?.transaction;

  const [type, setType] = useState(editing?.type || 'expense');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState(editing?.category || '');
  const [note, setNote] = useState(editing?.note || '');
  const [date, setDate] = useState(editing?.date || new Date().toISOString());

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (!category) {
      Alert.alert('No Category', 'Please select a category');
      return;
    }

    const transaction = {
      id: editing?.id || Date.now().toString(),
      amount: parseFloat(amount),
      type,
      category,
      date,
      note: note.trim(),
      createdAt: editing?.createdAt || new Date().toISOString(),
    };

    if (editing) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(editing.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {editing ? 'Edit Transaction' : 'Add Transaction'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor: type === 'expense' ? colors.expenseLight : colors.card,
              borderColor: type === 'expense' ? colors.expense : colors.border,
              borderWidth: type === 'expense' ? 2 : 1,
            },
          ]}
          onPress={() => { setType('expense'); setCategory(''); }}
        >
          <Ionicons
            name="arrow-up-circle"
            size={22}
            color={type === 'expense' ? colors.expense : colors.textSecondary}
          />
          <Text style={[
            styles.typeText,
            { color: type === 'expense' ? colors.expense : colors.textSecondary },
          ]}>
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor: type === 'income' ? colors.incomeLight : colors.card,
              borderColor: type === 'income' ? colors.income : colors.border,
              borderWidth: type === 'income' ? 2 : 1,
            },
          ]}
          onPress={() => { setType('income'); setCategory(''); }}
        >
          <Ionicons
            name="arrow-down-circle"
            size={22}
            color={type === 'income' ? colors.income : colors.textSecondary}
          />
          <Text style={[
            styles.typeText,
            { color: type === 'income' ? colors.income : colors.textSecondary },
          ]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountSection}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
        <View style={[styles.amountBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.currencySymbol, { color: colors.primary }]}>₹</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryItem,
                {
                  backgroundColor: category === cat.key ? cat.color + '20' : colors.card,
                  borderColor: category === cat.key ? cat.color : colors.border,
                  borderWidth: category === cat.key ? 2 : 1,
                },
              ]}
              onPress={() => setCategory(cat.key)}
            >
              <Ionicons name={cat.icon} size={24} color={cat.color} />
              <Text style={[styles.categoryLabel, { color: colors.text }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
        <View style={[styles.dateBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {format(new Date(date), 'MMMM d, yyyy')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Note (optional)</Text>
        <TextInput
          style={[
            styles.noteInput,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a description..."
          placeholderTextColor={colors.textTertiary}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.saveText}>{editing ? 'Update' : 'Add Transaction'}</Text>
      </TouchableOpacity>

      {editing && (
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.expenseLight }]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash" size={20} color={colors.danger} />
          <Text style={[styles.deleteText, { color: colors.danger }]}>Delete Transaction</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  typeText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  amountSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    padding: 0,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  categoryLabel: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    borderWidth: 1,
  },
  dateText: {
    fontSize: fontSize.md,
  },
  noteInput: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  saveButton: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  deleteText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
