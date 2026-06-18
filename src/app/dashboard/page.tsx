'use client';

import { KpiCards } from '@/components/dashboard/KpiCards';
import { FailureTimeline } from '@/components/dashboard/FailureTimeline';
import { FailureBreakdownPie } from '@/components/dashboard/FailureBreakdownPie';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Transaction Monitor</h1>
        <p className="text-gray-400 mt-2 text-lg">Real-time failure detection & instant refund processing • Last 24 hours</p>
      </div>

      <KpiCards />

      <div className="bg-slate-800 rounded-xl border-2 border-slate-700 p-8 mb-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Failure Pattern (24h)</h2>
        <FailureTimeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 rounded-xl border-2 border-slate-700 p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Failure Breakdown</h2>
          <FailureBreakdownPie />
        </div>
        <AlertsPanel />
      </div>

      <div className="mb-8 flex gap-4">
        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold shadow-lg"
        >
          View All Failing Transactions
          <span>→</span>
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border-2 border-slate-700 p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Latest Failures</h2>
        <TransactionTable />
      </div>
    </div>
  );
}
