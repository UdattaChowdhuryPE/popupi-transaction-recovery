'use client';

import { useData } from '@/context/DataContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TransactionDetailPage() {
  const params = useParams();
  const { transactions } = useData();
  const transactionId = params.id as string;
  
  const transaction = transactions.find((t) => t.id === transactionId);
  
  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Transaction not found</p>
        <Link href="/dashboard/transactions" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to transactions
        </Link>
      </div>
    );
  }
  
  const events = [
    { time: new Date(transaction.requestedAt), label: 'Payment requested', type: 'info' },
    transaction.failedAt && { time: new Date(transaction.failedAt), label: `${transaction.failureReason} (timeout 12s)`, type: 'error' },
    transaction.failedAt && { time: new Date(transaction.failedAt.getTime() + 100), label: 'Automatic refund triggered', type: 'action' },
    transaction.refundedAt && { time: new Date(transaction.refundedAt), label: 'Refund confirmed', type: 'success' },
    transaction.notifiedAt && { time: new Date(transaction.notifiedAt), label: 'User notified via push', type: 'info' },
    transaction.retryCount > 0 && { time: new Date(transaction.notifiedAt!.getTime() + 60000), label: 'User tapped Retry', type: 'action' },
    transaction.retryCount > 0 && { time: new Date(transaction.notifiedAt!.getTime() + 65000), label: 'Payment retry successful', type: 'success' },
    transaction.status === 'success' && { time: new Date(transaction.requestedAt.getTime() + 200000), label: 'Order placed', type: 'success' },
  ].filter(Boolean) as any[];

  return (
    <div>
      <Link href="/dashboard/transactions" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Back to transactions
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{transaction.id}</h2>
            <p className="text-gray-600 mt-1">User: {transaction.userId} | Merchant: {transaction.merchantId}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">₹{transaction.amount}</div>
            <span className={`text-xs px-2 py-1 rounded font-medium inline-block mt-2 ${
              transaction.status === 'refunded'
                ? 'bg-green-100 text-green-800'
                : transaction.status === 'success'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {events.map((event, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'error' ? 'bg-red-500' : event.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                {idx < events.length - 1 && <div className="w-0.5 h-12 bg-gray-300 mt-1" />}
              </div>
              <div className="py-1">
                <p className="text-sm font-medium text-gray-900">{event.label}</p>
                <p className="text-xs text-gray-500 mt-1">{event.time.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Root Cause</h3>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-700">
              {transaction.failureReason === 'Bank timeout'
                ? `${transaction.bankName} response timeout (12s, exceeded 10s threshold). Common 3-5 PM. Related issue: Bank reported network maintenance 3-4 PM.`
                : transaction.failureReason === 'Declined'
                ? `Payment declined by issuer. Retry with different payment method recommended.`
                : transaction.failureReason === 'Network error'
                ? `Network connectivity issue on user's device. Auto-retry recommended.`
                : `Insufficient funds in user's account. Retry after funds available.`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Refund Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Refund Amount:</span>
              <span className="font-medium text-gray-900">₹{transaction.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Refund Time:</span>
              <span className="font-medium text-gray-900">28 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank:</span>
              <span className="font-medium text-gray-900">{transaction.bankName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
