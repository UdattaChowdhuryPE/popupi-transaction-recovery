'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, UserNotification, generateMockTransactions, generateMockNotifications } from '@/lib/mock-data';

interface DataContextType {
  transactions: Transaction[];
  notifications: UserNotification[];
  totalFailures: number;
  autoRefunded: number;
  avgRefundTime: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage or generate mock data
    const stored = localStorage.getItem('popclub_transactions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(
          parsed.map((t: any) => ({
            ...t,
            requestedAt: new Date(t.requestedAt),
            failedAt: t.failedAt ? new Date(t.failedAt) : undefined,
            refundedAt: t.refundedAt ? new Date(t.refundedAt) : undefined,
            notifiedAt: t.notifiedAt ? new Date(t.notifiedAt) : undefined,
          }))
        );
      } catch (e) {
        const generated = generateMockTransactions();
        setTransactions(generated);
        localStorage.setItem('popclub_transactions', JSON.stringify(generated));
      }
    } else {
      const generated = generateMockTransactions();
      setTransactions(generated);
      localStorage.setItem('popclub_transactions', JSON.stringify(generated));
    }

    const storedNotif = localStorage.getItem('popclub_notifications');
    if (storedNotif) {
      try {
        const parsed = JSON.parse(storedNotif);
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            sentAt: new Date(n.sentAt),
            userActionAt: n.userActionAt ? new Date(n.userActionAt) : undefined,
          }))
        );
      } catch (e) {
        const generated = generateMockNotifications();
        setNotifications(generated);
        localStorage.setItem('popclub_notifications', JSON.stringify(generated));
      }
    } else {
      const generated = generateMockNotifications();
      setNotifications(generated);
      localStorage.setItem('popclub_notifications', JSON.stringify(generated));
    }

    setLoaded(true);
  }, []);

  const totalFailures = transactions.filter((t) => t.failureReason).length;
  const autoRefunded = transactions.filter((t) => t.status === 'refunded').length;
  const avgRefundTime = autoRefunded > 0 ? 28 : 0;

  return (
    <DataContext.Provider value={{ transactions, notifications, totalFailures, autoRefunded, avgRefundTime }}>
      {loaded && children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
