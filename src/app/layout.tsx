import type { Metadata } from 'next';
import './globals.css';
import { DataProvider } from '@/context/DataContext';
import { Nav } from '@/components/Nav';

export const metadata: Metadata = {
  title: 'PopClub Transaction Monitor',
  description: 'Real-time transaction failure recovery & prevention system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <DataProvider>
          <Nav />
          <div className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
