'use client';

import { useData } from '@/context/DataContext';

export function FailureBreakdownPie() {
  const { transactions } = useData();
  
  const failureBreakdown: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.failureReason) {
      failureBreakdown[t.failureReason] = (failureBreakdown[t.failureReason] || 0) + 1;
    }
  });
  
  const total = Object.values(failureBreakdown).reduce((a, b) => a + b, 0);
  const colors = [
    { bg: 'bg-blue-500', light: 'bg-blue-900', text: 'text-blue-300' },
    { bg: 'bg-orange-500', light: 'bg-orange-900', text: 'text-orange-300' },
    { bg: 'bg-red-500', light: 'bg-red-900', text: 'text-red-300' },
    { bg: 'bg-yellow-500', light: 'bg-yellow-900', text: 'text-yellow-300' },
  ];
  
  return (
    <div className="space-y-4">
      {Object.entries(failureBreakdown).map(([reason, count], idx) => {
        const percentage = Math.round((count / total) * 100);
        const color = colors[idx % colors.length];
        return (
          <div key={reason}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-200">{reason}</span>
              <span className={`${color.text} font-bold`}>{percentage}% ({count})</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`${color.bg} h-3 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
