'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasRole } from '@/services/authService';

export default function TeacherDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has teacher role
    if (!hasRole('teacher')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">শিক্ষক ড্যাশবোর্ড</h1>
      <p className="text-gray-600">স্বাগতম! আপনার শিক্ষক ড্যাশবোর্ডে</p>
      
      {/* Add your teacher dashboard content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">আমার ক্লাস</h2>
          <p className="text-3xl font-bold text-[#52b788]">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">মোট ছাত্র</h2>
          <p className="text-3xl font-bold text-[#52b788]">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">উপস্থিতি</h2>
          <p className="text-3xl font-bold text-[#52b788]">0%</p>
        </div>
      </div>
    </div>
  );
}
