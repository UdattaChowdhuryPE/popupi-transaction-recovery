export const MERCHANTS = [
  'Nykaa', 'Sephora', 'Amazon', 'Flipkart', 'Myntra', 'Unacademy'
];

export const BANKS = [
  { name: 'YES BANK', weight: 0.55 },
  { name: 'ICICI', weight: 0.25 },
  { name: 'Axis', weight: 0.20 },
];

export const FAILURE_REASONS = [
  { reason: 'Bank timeout', weight: 0.45 },
  { reason: 'Declined', weight: 0.30 },
  { reason: 'Network error', weight: 0.15 },
  { reason: 'Insufficient funds', weight: 0.10 },
];

export const TRANSACTION_AMOUNTS = [250, 350, 450, 750, 1200, 2100, 3500, 5000];

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  merchantId: string;
  status: TransactionStatus;
  failureReason?: string;
  bankName: string;
  requestedAt: Date;
  failedAt?: Date;
  refundedAt?: Date;
  retryCount: number;
  notifiedAt?: Date;
}

export interface RefundRecord {
  id: string;
  transactionId: string;
  amount: number;
  status: 'pending' | 'processing' | 'confirmed' | 'failed_manual_review';
  bankResponseTimeMs?: number;
  initiatedAt: Date;
  confirmedAt?: Date;
}

export interface UserNotification {
  id: string;
  transactionId: string;
  userId: string;
  messageVariant: 'A' | 'B' | 'C';
  sentAt: Date;
  userAction?: 'tapped_retry' | 'tapped_card' | 'contacted_support';
  userActionAt?: Date;
}

export interface AnalyticsEvent {
  timestamp: Date;
  failureReason?: string;
  bankName?: string;
  failureCount: number;
  refundSuccessCount: number;
  avgRefundTimeMs: number;
  retryRate: number;
  successRatePostRetry: number;
}

// Generate mock data
export function generateMockTransactions(): Transaction[] {
  const now = new Date();
  const transactions: Transaction[] = [];
  
  // 487 transactions over 24h
  for (let i = 0; i < 487; i++) {
    const hoursAgo = Math.random() * 24;
    const requestTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    // Bias towards 3-5 PM (hours 15-17)
    const hour = requestTime.getHours();
    const isSpikeHour = hour >= 15 && hour <= 17;
    const shouldFail = isSpikeHour ? Math.random() < 0.35 : Math.random() < 0.20;
    
    const failureReasonData = FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
    const bank = BANKS[Math.floor(Math.random() * BANKS.length)].name;
    
    transactions.push({
      id: `TX-2026-06-18-${String(i).padStart(4, '0')}`,
      userId: `user_${Math.floor(Math.random() * 5000)}`,
      amount: TRANSACTION_AMOUNTS[Math.floor(Math.random() * TRANSACTION_AMOUNTS.length)],
      merchantId: MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)],
      status: shouldFail ? (Math.random() < 0.87 ? 'refunded' : 'pending') : 'success',
      failureReason: shouldFail ? failureReasonData.reason : undefined,
      bankName: bank,
      requestedAt: requestTime,
      failedAt: shouldFail ? new Date(requestTime.getTime() + 100) : undefined,
      refundedAt: shouldFail && Math.random() < 0.87 ? new Date(requestTime.getTime() + 28000) : undefined,
      retryCount: shouldFail && Math.random() < 0.73 ? 1 : 0,
      notifiedAt: shouldFail ? new Date(requestTime.getTime() + 3500) : undefined,
    });
  }
  
  return transactions;
}

export function generateMockNotifications(): UserNotification[] {
  const notifications: UserNotification[] = [];
  const variants = ['A', 'B', 'C'] as const;
  
  // 1,200 notifications per variant
  for (const variant of variants) {
    for (let i = 0; i < 1200; i++) {
      const now = new Date();
      const sentTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      
      // Variant B has 58% retry rate, A has 42%, C has 52%
      const retryRates: Record<string, number> = { A: 0.42, B: 0.58, C: 0.52 };
      const shouldRetry = Math.random() < retryRates[variant];
      
      notifications.push({
        id: `notif_${variant}_${i}`,
        transactionId: `TX-${variant}-${i}`,
        userId: `user_${i}`,
        messageVariant: variant,
        sentAt: sentTime,
        userAction: shouldRetry ? 'tapped_retry' : undefined,
        userActionAt: shouldRetry ? new Date(sentTime.getTime() + Math.random() * 60000) : undefined,
      });
    }
  }
  
  return notifications;
}

export function calculateAnalytics(transactions: Transaction[]): Record<string, AnalyticsEvent> {
  const events: Record<string, AnalyticsEvent> = {};
  
  // Group by hour
  const now = new Date();
  for (let hourOffset = 0; hourOffset < 24; hourOffset++) {
    const hourStart = new Date(now.getTime() - (24 - hourOffset) * 60 * 60 * 1000);
    hourStart.setMinutes(0, 0, 0);
    const hourKey = hourStart.toISOString();
    
    const hourTransactions = transactions.filter((t) => {
      const tTime = new Date(t.requestedAt);
      return tTime >= hourStart && tTime < new Date(hourStart.getTime() + 60 * 60 * 1000);
    });
    
    const failedCount = hourTransactions.filter((t) => t.status === 'refunded' || (t.status === 'pending' && t.failureReason)).length;
    const refundedCount = hourTransactions.filter((t) => t.status === 'refunded').length;
    const avgRefundTime = refundedCount > 0 ? 28000 : 0; // 28 seconds
    
    events[hourKey] = {
      timestamp: hourStart,
      failureCount: failedCount,
      refundSuccessCount: refundedCount,
      avgRefundTimeMs: avgRefundTime,
      retryRate: 0.73,
      successRatePostRetry: 0.47,
    };
  }
  
  return events;
}
