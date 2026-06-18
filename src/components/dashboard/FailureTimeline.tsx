'use client';

import { useData } from '@/context/DataContext';

export function FailureTimeline() {
  const { transactions } = useData();
  
  // Count failures by hour
  const hourCounts: Record<number, number> = {};
  transactions.forEach((t) => {
    const hour = new Date(t.requestedAt).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + (t.failureReason ? 1 : 0);
  });
  
  const max = Math.max(...Object.values(hourCounts), 1);
  
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-1 h-64">
        {Array.from({ length: 24 }, (_, i) => {
          const count = hourCounts[i] || 0;
          const height = (count / max) * 100;
          const isPeakHour = i >= 15 && i <= 17;
          
          return (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full flex flex-col items-center">
                <div className="text-xs font-semibold text-gray-400 mb-2">{count}</div>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    isPeakHour
                      ? 'bg-gradient-to-t from-orange-500 to-orange-400 shadow-lg'
                      : 'bg-gradient-to-t from-blue-500 to-blue-400'
                  }`}
                  style={{ height: `${Math.max(height, 8)}px`, minHeight: '8px' }}
                  title={`${i}:00 - ${count} failures`}
                />
              </div>
              <span className="text-xs font-semibold text-gray-400">{i}h</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
          <span className="text-gray-300">Normal Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-orange-400 rounded"></div>
          <span className="text-gray-300">Peak Hours (3-5 PM)</span>
        </div>
      </div>
    </div>
  );
}
