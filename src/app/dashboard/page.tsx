'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/store/dashboardStore';
import { getMadrasahStats } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import type  {DashboardStats}  from '@/store/dashboardStore';

// Lazy load components
const StatsCards = dynamic(() => import('@/components/dashboard/StatsCards'), {
  loading: () => <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
});

const StatsChart = dynamic(() => import('@/components/dashboard/StatsChart'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[300px] bg-gray-100 rounded-lg" />
});

export default function DashboardPage() {
  const { setStats, setIsLoading } = useDashboardStore();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getMadrasahStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    if (stats) {
      setStats(stats as DashboardStats);
    }
    setIsLoading(isLoading);
  }, [stats, isLoading, setStats, setIsLoading]);

  return (
    <div className="mt-8 md:mt-12 lg:mt-16 mx-6 mb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-8">ড্যাশবোর্ড</h1>
      </div>
      
      <Suspense fallback={<div className="animate-pulse h-32 bg-gray-100 rounded-lg" />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<div className="animate-pulse h-[300px] bg-gray-100 rounded-lg" />}>
        <StatsChart />
      </Suspense>
    </div>
  );
}