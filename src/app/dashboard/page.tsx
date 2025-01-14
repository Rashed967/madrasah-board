'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/store/dashboardStore';
import { getMadrasahStats } from '@/services/dashboardService';

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

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const stats = await getMadrasahStats() as any;
        console.log('Fetched Stats:', stats);
        if (!stats) {
          setStats({
            totalMadrasahs: 0,
            boysMadrasahs: 0,
            girlsMadrasahs: 0,
            totalZones: 0,
            currentYearExaminees: 0,
            totalRegisteredExaminees: 0
          });
          return;
        }
        setStats({
          totalMadrasahs: stats?.totalMadrasahs || 0,
          boysMadrasahs: stats?.boysMadrasahs || 0,
          girlsMadrasahs: stats?.girlsMadrasahs || 0,
          totalZones: stats?.totalZones || 0,
          currentYearExaminees: stats?.currentYearExaminees || 0,
          totalRegisteredExaminees: stats?.totalRegisteredExaminees || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [setStats, setIsLoading]);

  return (
    <div className="mt-8 md:mt-12 lg:mt-16 mx-6 mb-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-8">ড্যাশবোর্ড</h1>
      </div>
      
      <StatsCards />
      <StatsChart />
    </div>
  );
}