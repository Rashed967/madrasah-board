'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#EDEDE9] flex items-center justify-center">
      <div className="text-center">
        Redirecting to login...
      </div>
    </div>
  );
}