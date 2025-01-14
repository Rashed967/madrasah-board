'use client';

import { useDashboardStore } from '@/store/dashboardStore';

export default function StatsCards() {
  const { stats, isLoading } = useDashboardStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">মোট মাদরাসা</h2>
        <p className="text-3xl font-bold text-[#52b788]">
          {isLoading ? '...' : stats.totalMadrasahs.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">বালক মাদরাসা</h2>
        <p className="text-3xl font-bold text-[#52b788]">
          {isLoading ? '...' : stats.boysMadrasahs.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">বালিকা মাদরাসা</h2>
        <p className="text-3xl font-bold text-[#52b788]">
          {isLoading ? '...' : stats.girlsMadrasahs.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">মোট জোন</h2>
        <p className="text-3xl font-bold text-[#52b788]">
          {isLoading ? '...' : stats.totalZones.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">চলতি বছরের পরীক্ষার্থী</h2>
        <p className="text-3xl font-bold text-[#52b788]">
          {isLoading ? '...' : stats.currentYearExaminees.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">মোট নিবন্ধিত পরীক্ষার্থী</h2>
        <p className="text-3xl font-bold text-[#52b788]">
          {isLoading ? '...' : stats.totalRegisteredExaminees.toLocaleString('bn-BD')}
        </p>
      </div>
    </div>
  );
}
