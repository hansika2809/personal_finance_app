import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { getGroupKey } from '../utils/formatters';
import { borderRadius, fontSize, spacing } from '../theme';

export default function TransactionsScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { transactions, settings, deleteTransaction } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  React.useEffect(() => {
    if (route.params?.editTransaction) {
      navigation.navigate('AddTransaction', { transaction: route.params.editTransaction });
      navigation.setParams({ editTransaction: undefined });
    }
  }, [route.params?.editTransaction]);

  const filteredData = useMemo(() => {
    let data = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filter !== 'all') {
      data = data.filter(t => t.type === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        (t.note && t.note.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }

    const grouped = [];
    let lastGroup = '';
    data.forEach(t => {
      const group = getGroupKey(t.date);
      if (group !== lastGroup) {
        grouped.push({ type: 'header', title: group, id: 'h_' + group });
        lastGroup = group;
      }
      grouped.push({ type: 'item', ...t });
    });

    return grouped;
  }, [transactions, filter, search]);

  const handlePress = (transaction) => {
    navigation.navigate('AddTransaction', { transaction });
  };

  const handleLongPress = (transaction) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <Text style={[styles.groupHeader, { color: colors.textSecondary }]}>
          {item.title}
        </Text>
      );
    }
    return (
      <TransactionItem
        transaction={item}
        currency={settings.currency}
        onPress={handlePress}
        onLongPress={() => handleLongPress(item)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
      </View>

      <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search transactions..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f.key ? '#FFF' : colors.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredData.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No transactions found"
            subtitle={search ? 'Try a different search term' : 'Tap + to add your first transaction'}
          />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 100,
    paddingTop: spacing.sm,
  },
  emptyList: {
    flex: 1,
  },
  groupHeader: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
