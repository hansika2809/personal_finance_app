import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { borderRadius, fontSize, spacing } from '../theme';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { settings, updateSettings, resetAll } = useApp();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(settings.userName);
  const [editBudget, setEditBudget] = useState(false);
  const [budget, setBudget] = useState(String(settings.monthlyBudget));

  const handleToggleDark = (val) => {
    updateSettings({ darkMode: val });
  };

  const handleSaveName = () => {
    updateSettings({ userName: name.trim() || 'User' });
    setEditName(false);
  };

  const handleSaveBudget = () => {
    const b = parseFloat(budget) || 0;
    updateSettings({ monthlyBudget: b });
    setEditBudget(false);
  };

  const handleCurrency = (code) => {
    updateSettings({ currency: code });
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your transactions, goals, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAll();
            setName('User');
            setBudget('30000');
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
      <View style={styles.topBar}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Profile</Text>
        <TouchableOpacity style={styles.row} onPress={() => setEditName(true)}>
          <View style={styles.rowLeft}>
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Name</Text>
          </View>
          {editName ? (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.editInput, { color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                autoFocus
                onBlur={handleSaveName}
                onSubmitEditing={handleSaveName}
              />
            </View>
          ) : (
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{settings.userName}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setEditBudget(true)}>
          <View style={styles.rowLeft}>
            <Ionicons name="cash" size={24} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Monthly Budget</Text>
          </View>
          {editBudget ? (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.editInput, { color: colors.text, borderColor: colors.border }]}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                autoFocus
                onBlur={handleSaveBudget}
                onSubmitEditing={handleSaveBudget}
              />
            </View>
          ) : (
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              ₹{settings.monthlyBudget.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleDark}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Currency</Text>
        {currencies.map(c => (
          <TouchableOpacity
            key={c.code}
            style={styles.row}
            onPress={() => handleCurrency(c.code)}
          >
            <View style={styles.rowLeft}>
              <Text style={[styles.currencySymbol, { color: colors.primary }]}>{c.symbol}</Text>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                {c.name} ({c.code})
              </Text>
            </View>
            {settings.currency === c.code && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Data</Text>
        <TouchableOpacity style={styles.row} onPress={handleReset}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash" size={24} color={colors.danger} />
            <Text style={[styles.rowLabel, { color: colors.danger }]}>Reset All Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.textTertiary }]}>
          Finance Companion v1.0.0
        </Text>
        <Text style={[styles.version, { color: colors.textTertiary }]}>
          Built with React Native + Expo
        </Text>
      </View>

      <View style={{ height: 100 }} />
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
  section: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rowLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: fontSize.md,
  },
  editRow: {
    flex: 0.5,
  },
  editInput: {
    fontSize: fontSize.md,
    borderBottomWidth: 1,
    paddingVertical: 4,
    textAlign: 'right',
  },
  currencySymbol: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    width: 24,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  version: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
});
