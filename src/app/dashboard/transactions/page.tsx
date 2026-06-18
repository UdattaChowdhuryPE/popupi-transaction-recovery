'use client';

import { useData } from '@/context/DataContext';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const PAGE_SIZE = 20;

export default function TransactionsPage() {
  const { transactions } = useData();
  const [filterReason, setFilterReason] = useState<string>('');
  const [filterBank, setFilterBank] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);

  const failureReasons = Array.from(
    new Set(transactions.filter((t) => t.failureReason).map((t) => t.failureReason!))
  );
  const banks = Array.from(new Set(transactions.map((t) => t.bankName)));

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => t.failureReason);
    if (filterReason) result = result.filter((t) => t.failureReason === filterReason);
    if (filterBank) result = result.filter((t) => t.bankName === filterBank);
    return result;
  }, [transactions, filterReason, filterBank]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Failing Transactions</h2>
        <p className="text-sm text-gray-400 mt-1">All failed transactions in the last 24 hours</p>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Failure Reason</label>
            <select
              value={filterReason}
              onChange={(e) => {
                setFilterReason(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full bg-slate-700 border border-slate-600 text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">All Reasons</option>
              {failureReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bank</label>
            <select
              value={filterBank}
              onChange={(e) => {
                setFilterBank(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full bg-slate-700 border border-slate-600 text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="">All Banks</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-400">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Merchant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Failure</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Bank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {pageItems.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-gray-400">{tx.userId.split('_')[1]}</td>
                  <td className="py-3 px-4 font-medium text-orange-400">₹{tx.amount}</td>
                  <td className="py-3 px-4 text-gray-300">{tx.merchantId}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{tx.failureReason}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{tx.bankName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        tx.status === 'refunded'
                          ? 'bg-green-900/60 text-green-400'
                          : 'bg-yellow-900/60 text-yellow-400'
                      }`}
                    >
                      {tx.status === 'refunded' ? 'Refunded' : 'Processing'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/dashboard/transactions/${tx.id}`}
                      className="text-orange-400 hover:text-orange-300 hover:underline text-xs font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border-t border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {start + 1}-{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm border border-slate-600 text-gray-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 text-sm border border-slate-600 text-gray-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
