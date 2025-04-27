
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, CategorySummary, ALL_CATEGORIES } from '../types';
import { toast } from 'sonner';
import { parseISO } from 'date-fns';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  budgets: Budget[];
  setBudget: (category: Category, limit: number) => void;
  categoryTotals: CategorySummary[];
  monthlyData: { month: string; amount: number }[];
  totalExpenses: number;
  sortedTransactions: Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Sample data for demonstration
const generateSampleData = (): Transaction[] => {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  
  return [
    {
      id: "1",
      amount: 42.99,
      date: new Date(today.setDate(today.getDate() - 2)),
      description: "Grocery shopping",
      category: "food"
    },
    {
      id: "2",
      amount: 129.50,
      date: new Date(today.setDate(today.getDate() - 5)),
      description: "Electricity bill",
      category: "utilities"
    },
    {
      id: "3",
      amount: 35.00,
      date: new Date(today.setDate(today.getDate() - 8)),
      description: "Gas station",
      category: "transport"
    },
    {
      id: "4",
      amount: 19.99,
      date: new Date(lastMonth.setDate(lastMonth.getDate() - 15)),
      description: "Movie tickets",
      category: "entertainment"
    },
    {
      id: "5",
      amount: 85.75,
      date: new Date(lastMonth.setDate(lastMonth.getDate() - 18)),
      description: "New shoes",
      category: "shopping"
    }
  ];
};

// Create a provider component
export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        // Parse the dates from strings to Date objects
        return JSON.parse(savedTransactions, (key, value) => {
          if (key === 'date') {
            return parseISO(value);
          }
          return value;
        });
      } catch (error) {
        console.error('Failed to parse saved transactions', error);
        return generateSampleData();
      }
    }
    return generateSampleData();
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      try {
        return JSON.parse(savedBudgets);
      } catch (error) {
        console.error('Failed to parse saved budgets', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Save transactions to localStorage, converting Date objects to ISO strings
    localStorage.setItem('transactions', JSON.stringify(transactions, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
  }, [transactions]);

  useEffect(() => {
    // Save budgets to localStorage
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    toast.success("Transaction added successfully");
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
    toast.success("Transaction updated successfully");
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    toast.success("Transaction deleted successfully");
  };

  const setBudget = (category: Category, limit: number) => {
    setBudgets((prev) => {
      const existingIndex = prev.findIndex(budget => budget.category === category);
      if (existingIndex >= 0) {
        const newBudgets = [...prev];
        newBudgets[existingIndex] = { category, limit };
        return newBudgets;
      } else {
        return [...prev, { category, limit }];
      }
    });
    toast.success(`Budget for ${category} set successfully`);
  };

  const calculateCategoryTotals = (): CategorySummary[] => {
    const totals: Record<Category, number> = {} as Record<Category, number>;
    let grandTotal = 0;

    // Initialize all categories to zero
    ALL_CATEGORIES.forEach(category => {
      totals[category] = 0;
    });

    // Sum up totals for each category
    transactions.forEach(transaction => {
      totals[transaction.category] += transaction.amount;
      grandTotal += transaction.amount;
    });

    // Create the summary objects with percentages
    return ALL_CATEGORIES
      .map(category => ({
        category,
        total: totals[category],
        percentage: grandTotal > 0 ? (totals[category] / grandTotal) * 100 : 0
      }))
      .filter(summary => summary.total > 0) // Only include categories with transactions
      .sort((a, b) => b.total - a.total); // Sort by highest total
  };

  const calculateMonthlyData = () => {
    const months: Record<string, number> = {};
    const today = new Date();
    
    // Initialize the past 6 months with zero values
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[monthKey] = 0;
    }

    // Sum up transactions by month
    transactions.forEach(transaction => {
      const monthKey = transaction.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (months[monthKey] !== undefined) {
        months[monthKey] += transaction.amount;
      }
    });

    return Object.entries(months).map(([month, amount]) => ({ month, amount }));
  };

  const getTotalExpenses = (): number => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getSortedTransactions = (): Transaction[] => {
    return [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const categoryTotals = calculateCategoryTotals();
  const monthlyData = calculateMonthlyData();
  const totalExpenses = getTotalExpenses();
  const sortedTransactions = getSortedTransactions();

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets,
        setBudget,
        categoryTotals,
        monthlyData,
        totalExpenses,
        sortedTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
