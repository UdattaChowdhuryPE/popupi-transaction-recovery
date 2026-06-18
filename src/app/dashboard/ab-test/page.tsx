'use client';

import { useData } from '@/context/DataContext';
import { useState } from 'react';

const variants = [
  {
    id: 'A',
    name: 'Simple',
    message: 'Payment didn\'t work. [Retry UPI] [Try Card]',
    impressions: 1200,
    retryRate: 42,
    cardRate: 15,
    successRate: 35,
    revenue: 0,
  },
  {
    id: 'B',
    name: 'Emotive',
    message: 'We\'ve refunded ₹350. Retry in 1 tap.',
    impressions: 1195,
    retryRate: 58,
    cardRate: 8,
    successRate: 47,
    revenue: 34,
  },
  {
    id: 'C',
    name: 'Urgency',
    message: 'Oops! We\'re refunding you. Retry now before we process the refund.',
    impressions: 1203,
    retryRate: 52,
    cardRate: 12,
    successRate: 41,
    revenue: 17,
  },
];

export default function ABTestPage() {
  const { notifications } = useData();
  const [showToast, setShowToast] = useState(false);
  const [winner, setWinner] = useState('B');

  const handleApply = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">A/B Test Results</h2>
        <p className="text-sm text-gray-400 mt-1">Retry messaging variants - last 24 hours</p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50">
          ✓ Variant B applied to 100% of traffic
        </div>
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-400 w-12">Variant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Message</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Impressions</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Retry Rate</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Card Rate</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Success Rate</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Revenue Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {variants.map((variant) => (
                <tr
                  key={variant.id}
                  className={`hover:bg-slate-700/50 ${
                    winner === variant.id ? 'bg-orange-950/30' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{variant.id}</span>
                      {winner === variant.id && (
                        <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded font-medium border border-orange-500/30">
                          Winner
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs max-w-sm">{variant.message}</td>
                  <td className="py-3 px-4 text-center text-gray-200 font-medium">{variant.impressions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="font-bold text-white">{variant.retryRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">{variant.cardRate}%</td>
                  <td className="py-3 px-4 text-center text-gray-400">{variant.successRate}%</td>
                  <td className="py-3 px-4 text-center">
                    {variant.revenue === 0 ? (
                      <span className="text-gray-500">baseline</span>
                    ) : (
                      <span className={`font-bold ${
                        variant.revenue > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {variant.revenue > 0 ? '+' : ''}{variant.revenue}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium text-sm"
        >
          Apply Variant B to 100% →
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className={`rounded-lg border p-4 ${
              winner === variant.id
                ? 'bg-orange-950/20 border-orange-500/40'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <h3 className="font-semibold text-white mb-2">Variant {variant.id}: {variant.name}</h3>
            <p className="text-sm text-gray-400 mb-4 italic">"{variant.message}"</p>
            <div className="space-y-1 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-500">Retry rate:</span> <span className="font-medium">{variant.retryRate}%</span>
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Success rate:</span> <span className="font-medium">{variant.successRate}%</span>
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Revenue:</span>{' '}
                <span className={`font-medium ${
                  variant.revenue > 0 ? 'text-green-400' : variant.revenue === 0 ? 'text-gray-300' : 'text-red-400'
                }`}>
                  {variant.revenue === 0 ? 'baseline' : `${variant.revenue > 0 ? '+' : ''}${variant.revenue}%`}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
