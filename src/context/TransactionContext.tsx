import React, { createContext, useContext, useState } from "react";

export type Category =
  | "🍛 খাবার"
  | "🚌 যাতায়াত"
  | "🏠 বাড়িভাড়া"
  | "📱 মোবাইল"
  | "💊 ওষুধ"
  | "📚 পড়াশোনা"
  | "🛍️ কেনাকাটা"
  | "💰 বেতন"
  | "🎁 অন্যান্য";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id" | "date">) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

const SEED: Transaction[] = [
  {
    id: "1",
    description: "মাসিক বেতন",
    amount: 25000,
    category: "💰 বেতন",
    type: "income",
    date: "2026-05-01",
  },
  {
    id: "2",
    description: "বাড়ি ভাড়া",
    amount: 8000,
    category: "🏠 বাড়িভাড়া",
    type: "expense",
    date: "2026-05-02",
  },
  {
    id: "3",
    description: "সকালের নাস্তা",
    amount: 120,
    category: "🍛 খাবার",
    type: "expense",
    date: "2026-05-10",
  },
  {
    id: "4",
    description: "রিকশা ভাড়া",
    amount: 60,
    category: "🚌 যাতায়াত",
    type: "expense",
    date: "2026-05-12",
  },
];

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED);

  const addTransaction = (t: Omit<Transaction, "id" | "date">) => {
    const newT: Transaction = {
      ...t,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions((prev) => [newT, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransactions must be used inside TransactionProvider");
  return ctx;
}
