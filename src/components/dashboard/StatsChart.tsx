'use client';

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

export default function StatsChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full">
      <div className="h-[300px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
