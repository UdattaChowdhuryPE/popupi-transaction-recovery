'use client';

import { useData } from '@/context/DataContext';

export function KpiCards() {
  const { totalFailures, autoRefunded, avgRefundTime } = useData();
  const refundRate = totalFailures > 0 ? Math.round((autoRefunded / totalFailures) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-red-500 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Failures</div>
          <div className="text-2xl">⚠️</div>
        </div>
        <div className="text-4xl font-bold text-red-500">{totalFailures}</div>
        <div className="text-xs text-red-400 mt-2 font-semibold">+18% from yesterday</div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-orange-500 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">Auto-Refunded</div>
          <div className="text-2xl">✅</div>
        </div>
        <div className="text-4xl font-bold text-orange-500">{autoRefunded}</div>
        <div className="text-xs text-orange-400 mt-2 font-semibold">{refundRate}% success rate</div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-yellow-500 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">Avg Refund Time</div>
          <div className="text-2xl">⚡</div>
        </div>
        <div className="text-4xl font-bold text-yellow-500">{avgRefundTime}s</div>
        <div className="text-xs text-yellow-400 mt-2 font-semibold">250x faster than baseline</div>
      </div>
    </div>
  );
}
