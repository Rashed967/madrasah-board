'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      try {
        await router.push('/login');
      } catch (error) {
        return 
      } finally {
        setIsLoading(false);
      }
    };
    redirect();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EDEDE9] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto"></div>
          <div className="text-center text-gray-600">
            আপনাকে লগইন পেজে নিয়ে যাওয়া হচ্ছে...
          </div>
        </div>
      </div>
    );
  }

  return null;
}