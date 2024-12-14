'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#edede9]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-1">
          {children}
        </main>
      </div>
    </div>
  );
}
