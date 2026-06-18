'use client';

import { useData } from '@/context/DataContext';
import Link from 'next/link';
import { useState } from 'react';

export function TransactionTable() {
  const { transactions } = useData();
  const [filterReason, setFilterReason] = useState<string>('');
  
  const filtered = filterReason
    ? transactions.filter((t) => t.failureReason === filterReason)
    : transactions.filter((t) => t.failureReason);
  
  const failureReasons = Array.from(new Set(transactions.filter((t) => t.failureReason).map((t) => t.failureReason)));
  
  const statusColor = (status: string) => {
    if (status === 'refunded') return 'bg-green-900 text-green-300 border-l-4 border-green-500';
    return 'bg-yellow-900 text-yellow-300 border-l-4 border-yellow-500';
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-400">Showing {filtered.length} failures • Filter by reason:</p>
        <select
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
          className="bg-slate-700 border-2 border-slate-600 text-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:border-orange-500 focus:outline-none"
        >
          <option value="">All Reasons</option>
          {failureReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-700 bg-slate-900">
              <th className="text-left py-4 px-4 font-bold text-gray-300">User</th>
              <th className="text-left py-4 px-4 font-bold text-gray-300">Amount</th>
              <th className="text-left py-4 px-4 font-bold text-gray-300">Merchant</th>
              <th className="text-left py-4 px-4 font-bold text-gray-300">Failure Reason</th>
              <th className="text-left py-4 px-4 font-bold text-gray-300">Status</th>
              <th className="text-left py-4 px-4 font-bold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 8).map((tx) => (
              <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="py-4 px-4 font-semibold text-gray-200">User {tx.userId.split('_')[1]}</td>
                <td className="py-4 px-4 font-bold text-orange-400">₹{tx.amount}</td>
                <td className="py-4 px-4 text-gray-300 font-medium">{tx.merchantId}</td>
                <td className="py-4 px-4 text-gray-400">{tx.failureReason}</td>
                <td className="py-4 px-4">
                  <span className={`text-xs px-3 py-2 rounded-full font-bold ${statusColor(tx.status)}`}>
                    {tx.status === 'refunded' ? '✓ Refunded' : '⏳ Processing'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Link
                    href={`/dashboard/transactions/${tx.id}`}
                    className="text-orange-400 hover:text-orange-300 font-bold hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
