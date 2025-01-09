'use client';

import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'মাদরাসা পরিসংখ্যান',
      },
    },
  };

  const labels = ['২০১৯', '২০২০', '২০২১', '২০২২', '২০২৩', '২০২৪'];

  const data = {
    labels,
    datasets: [
      {
        label: 'নতুন নিবন্ধিত মাদরাসা',
        data: [150, 180, 220, 380, 780, 1020],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'পরীক্ষার্থী',
        data: [5550, 6080, 7800, 12096, 14500, 27000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="mt-8 md:mt-12 lg:mt-16 mx-6 mb-8">
      <div> <h1 className="text-xl md:text-2xl font-bold mb-8">ড্যাশবোর্ড</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8  gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">মোট মাদরাসা</h2>
          <p className="text-3xl font-bold text-[#52b788]">১২৫</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">মোট বালক মাদরাসা</h2>
          <p className="text-3xl font-bold text-[#52b788]">১৩৩৫</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">মোট বালিকা মাদরাসা</h2>
          <p className="text-3xl font-bold text-[#52b788]">৪৫৫</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">মোট কেন্দ্র</h2>
          <p className="text-3xl font-bold text-[#52b788]">৪৫৫</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">মোট মুমতাহিন</h2>
          <p className="text-3xl font-bold text-[#52b788]">৭৫</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">মোট নেগরান</h2>
          <p className="text-3xl font-bold text-[#52b788]">৭৫</p>
        </div>

      </div>
      <div className="bg-white p-6 rounded-lg shadow w-full ">
        <div className="h-[300px]">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
}