'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
  const pathname = usePathname();
  
  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  
  return (
    <nav className="bg-slate-950 border-b-4 border-orange-500 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">PopClub</h1>
            <p className="text-xs text-orange-400 font-semibold">Transaction Control</p>
          </div>
        </div>
        
        <div className="flex gap-8">
          <Link
            href="/dashboard"
            className={`text-sm font-semibold transition-colors ${
              pathname === '/dashboard'
                ? 'text-orange-400 border-b-2 border-orange-400 pb-1'
                : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/transactions"
            className={`text-sm font-semibold transition-colors ${
              pathname === '/dashboard/transactions' || pathname.includes('/transactions/')
                ? 'text-orange-400 border-b-2 border-orange-400 pb-1'
                : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            Transactions
          </Link>
          <Link
            href="/dashboard/ab-test"
            className={`text-sm font-semibold transition-colors ${
              isActive('/dashboard/ab-test')
                ? 'text-orange-400 border-b-2 border-orange-400 pb-1'
                : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            A/B Tests
          </Link>
          <Link
            href="/user"
            className={`text-sm font-semibold transition-colors ${
              isActive('/user')
                ? 'text-orange-400 border-b-2 border-orange-400 pb-1'
                : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            User View
          </Link>
        </div>
      </div>
    </nav>
  );
}
