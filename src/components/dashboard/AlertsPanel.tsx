'use client';

export function AlertsPanel() {
  return (
    <div className="bg-slate-800 rounded-xl border-2 border-slate-700 p-8 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">System Alerts</h3>
      <div className="space-y-4">
        <div className="flex gap-3 p-4 bg-red-950 rounded-lg border border-red-800">
          <div className="text-2xl mt-1">🔴</div>
          <div>
            <div className="font-bold text-red-400">YES BANK Timeouts Elevated</div>
            <div className="text-sm text-red-300 mt-1">3pm-4pm daily (last 3 days) • High traffic correlation</div>
          </div>
        </div>
        
        <div className="flex gap-3 p-4 bg-green-950 rounded-lg border border-green-800">
          <div className="text-2xl mt-1">✅</div>
          <div>
            <div className="font-bold text-green-400">ICICI Processing Normally</div>
            <div className="text-sm text-green-300 mt-1">Avg refund: 25s • No delays detected</div>
          </div>
        </div>
        
        <div className="flex gap-3 p-4 bg-orange-950 rounded-lg border border-orange-800">
          <div className="text-2xl mt-1">⚠️</div>
          <div>
            <div className="font-bold text-orange-400">Manual Review Queue</div>
            <div className="text-sm text-orange-300 mt-1">8 transactions pending • Avg wait: 12 minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
