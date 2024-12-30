'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { isAuthenticated } from '@/services/authService';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

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