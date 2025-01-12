'use client';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};



import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import Link from 'next/link';

export default function MadrasahDashboard() {
  const stats = [
    { label: 'মোট মাদরাসা', value: '১২৫' },
    { label: 'নতুন মাদরাসা', value: '১২' },
    { label: 'মোট বাতিল মাদরাসা', value: '৭৫' },
    { label: 'মোট বাকিনা মাদরাসা', value: '৭৫' },
    { label: 'মোট দেখা', value: '৭৫' },
    { label: 'মোট দেনদার', value: '৭৫' },
    { label: 'মোট মুহতামিম', value: '৭৫' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium text-gray-800">ড্যাশবোর্ড</h1>
        <Link
          href="/dashboard/madrasah/register-madrasah"
          className="inline-flex items-center px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#40a873] transition-colors gap-2"
        >
          <MdAdd className="w-5 h-5" />
          নতুন মাদরাসা যোগ করুন
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6"
          >
            <div className="text-4xl font-semibold text-[#52B788]">{stat.value}</div>
            <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="mt-8 bg-white rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">মাদরাসা পরিসংখ্যান</h2>
        <div className="h-[400px]">
          {/* Add your graph component here */}
        </div>
      </div>
    </div>
  );
}
