'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Image from 'next/image';


// Dynamically import components
const LoginForm = dynamic(() => import('@/components/auth/LoginForm').then(mod => mod.LoginForm), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-md"></div>,
  ssr: false
});

const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), {
  ssr: false
});

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Toaster position="top-right" />
        <div>
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="mx-auto rounded-full"
            priority
          />
        </div>
        <div>
          <h1 className="mt-4 text-center text-base md:text-lg font-extrabold text-gray-900">
          জাতীয় দ্বীনি মাদরাসা শিক্ষা বোর্ড
          </h1>
        </div>
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-md"></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
