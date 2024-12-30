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
    </div>
  );
}
