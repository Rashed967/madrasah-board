'use client';

import { useDashboardStore } from '@/store/dashboardStore';

export default function StatsCards() {
  const { stats, isLoading } = useDashboardStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8 gap-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">মোট মাদরাসা</h2>
        <p className="text-2xl sm:text-3xl font-bold text-[#52b788] antialiased">
          {isLoading ? '...' : stats.totalMadrasahs.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">বালক মাদরাসা</h2>
        <p className="text-2xl sm:text-3xl font-bold text-[#52b788] antialiased">
          {isLoading ? '...' : stats.boysMadrasahs.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">বালিকা মাদরাসা</h2>
        <p className="text-2xl sm:text-3xl font-bold text-[#52b788] antialiased">
          {isLoading ? '...' : stats.girlsMadrasahs.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">মোট জোন</h2>
        <p className="text-2xl sm:text-3xl font-bold text-[#52b788] antialiased">
          {isLoading ? '...' : stats.totalZones.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">চলতি বছরের পরীক্ষার্থী</h2>
        <p className="text-2xl sm:text-3xl font-bold text-[#52b788] antialiased">
          {isLoading ? '...' : stats.currentYearExaminees.toLocaleString('bn-BD')}
        </p>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">মোট নিবন্ধিত পরীক্ষার্থী</h2>
        <p className="text-2xl sm:text-3xl font-bold text-[#52b788] antialiased">
          {isLoading ? '...' : stats.totalRegisteredExaminees.toLocaleString('bn-BD')}
        </p>
      </div>
    </div>
  );
}
