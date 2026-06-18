'use client';

import { useData } from '@/context/DataContext';
import { useState } from 'react';

export default function UserPage() {
  const { transactions } = useData();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const failedTx = transactions.find((t) => t.failureReason && t.status === 'refunded');
  const successTx = transactions.find((t) => t.status === 'success');
  const recentTxs = transactions.slice(0, 5);

  const handleRetryClick = (variant: 'retry' | 'card') => {
    setToastMessage(
      variant === 'retry'
        ? '🔄 Retrying payment... Your transaction will process in seconds.'
        : '📃 Card payment method selected. Proceed with checkout?'
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">My Transactions</h2>
        <p className="text-sm text-gray-400 mt-1">View your recent PopClub purchases and rewards</p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50">
          {toastMessage}
        </div>
      )}

      {/* Success Transaction Card */}
      {successTx && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">✓ Payment Successful</h3>
              <p className="text-sm text-gray-400 mt-1">{successTx.merchantId} • Just now</p>
            </div>
            <div className="text-2xl font-bold text-green-400">₹{successTx.amount}</div>
          </div>
          <div className="bg-green-950/40 border border-green-800/50 rounded p-4 mb-4">
            <p className="text-sm font-medium text-green-400">✓ Payment confirmed</p>
            <p className="text-sm text-green-500 mt-1">You earned {Math.round(successTx.amount * 0.02)} POPcoins (2%)</p>
            <p className="text-xs text-green-600 mt-2">Redeemable at 250+ brands</p>
          </div>
        </div>
      )}

      {/* Failed Transaction Card */}
      {failedTx && (
        <div className="bg-slate-800 rounded-lg border border-orange-500/40 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">❌ Payment couldn't go through</h3>
              <p className="text-sm text-gray-400 mt-1">{failedTx.merchantId} • 2 hours ago</p>
            </div>
            <div className="text-2xl font-bold text-orange-400">₹{failedTx.amount}</div>
          </div>
          <div className="bg-orange-950/40 border border-orange-800/50 rounded p-4 mb-6">
            <p className="text-sm font-medium text-orange-400">✓ We've refunded ₹{failedTx.amount}</p>
            <p className="text-xs text-orange-500 mt-1">Refund processing (usually 30 seconds)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleRetryClick('retry')}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium text-sm"
            >
              Retry UPI
            </button>
            <button
              onClick={() => handleRetryClick('card')}
              className="flex-1 px-4 py-2 bg-slate-700 text-gray-200 rounded hover:bg-slate-600 font-medium text-sm"
            >
              Try Card
            </button>
            <button className="px-4 py-2 border border-slate-600 text-gray-400 rounded hover:bg-slate-700 font-medium text-sm">
              Need help?
            </button>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTxs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded border border-slate-700">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-200">{tx.merchantId}</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-orange-400">₹{tx.amount}</p>
                <span className={`text-xs font-medium ${
                  tx.status === 'success' ? 'text-green-400' : tx.status === 'refunded' ? 'text-orange-400' : 'text-gray-500'
                }`}>
                  {tx.status === 'success' ? '✓ Success' : tx.status === 'refunded' ? '↻ Refunded' : 'Processing'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
