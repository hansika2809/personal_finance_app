import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { loadData, saveData, clearAll } from '../utils/storage';
import { seedTransactions, seedGoals, defaultSettings } from '../data/seedData';
import { useTheme } from './ThemeContext';

const AppContext = createContext();

const KEYS = {
  TRANSACTIONS: '@finance_transactions',
  GOALS: '@finance_goals',
  SETTINGS: '@finance_settings',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'RESET_ALL':
      return {
        transactions: seedTransactions,
        goals: seedGoals,
        settings: defaultSettings,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const { setDarkMode } = useTheme();

  const [state, dispatch] = useReducer(appReducer, {
    transactions: [],
    goals: [],
    settings: defaultSettings,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData(KEYS.TRANSACTIONS, state.transactions);
    }
  }, [state.transactions, loading]);

  useEffect(() => {
    if (!loading) {
      saveData(KEYS.GOALS, state.goals);
    }
  }, [state.goals, loading]);

  useEffect(() => {
    if (!loading) {
      saveData(KEYS.SETTINGS, state.settings);
      setDarkMode(state.settings.darkMode);
    }
  }, [state.settings, loading]);

  const loadAllData = async () => {
    try {
      const [transactions, goals, settings] = await Promise.all([
        loadData(KEYS.TRANSACTIONS),
        loadData(KEYS.GOALS),
        loadData(KEYS.SETTINGS),
      ]);

      dispatch({
        type: 'SET_TRANSACTIONS',
        payload: transactions || seedTransactions,
      });
      dispatch({
        type: 'SET_GOALS',
        payload: goals || seedGoals,
      });

      const loadedSettings = settings || defaultSettings;
      dispatch({ type: 'SET_SETTINGS', payload: loadedSettings });
      setDarkMode(loadedSettings.darkMode);
    } catch (e) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: seedTransactions });
      dispatch({ type: 'SET_GOALS', payload: seedGoals });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addGoal = (goal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const updateGoal = (goal) => {
    dispatch({ type: 'UPDATE_GOAL', payload: goal });
  };

  const deleteGoal = (id) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...newSettings } });
  };

  const resetAll = async () => {
    await clearAll();
    dispatch({ type: 'RESET_ALL' });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        updateSettings,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
