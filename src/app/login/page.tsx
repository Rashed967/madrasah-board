'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { setTokens, getDashboardRoute } from '@/services/authService';

import Image from 'next/image';
import { post } from '@/core/api/apiService';

interface LoginData {
  accessToken: string;
  user: {
    _id: string;
    username: string;
    role: string;
    madrasah: string | null;
    isDeleted: boolean;
    lastPasswordChangeTime: string;
    createdAt: string;
    updatedAt: string;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!username || !password) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await post<LoginData>('/users/login', { username, password });
      
      if (response.success) {
        // Set both localStorage and cookie tokens
        setTokens({
          accessToken: response.data.accessToken,
          user: response.data.user
        });
        
        toast.success('সফলভাবে লগইন হয়েছে');
        
        // Get appropriate dashboard route and redirect
        const dashboardRoute = getDashboardRoute();
        router.push(dashboardRoute);
        router.refresh(); // Force a refresh to update the navigation state
      } else {
        toast.error(response.message || 'ইউজারনেম অথবা পাসওয়ার্ড ভুল');
      }
    } catch (error) {
      toast.error('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Toaster position="top-right" />
        <div>
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto roudned-full"
          />
        </div>
        <div>
          <h1 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            লগইন করুন
          </h1>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#52b788] focus:border-[#52b788] focus:z-10 sm:text-sm"
                  placeholder="ইউজারনেম লিখুন"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#52b788] focus:border-[#52b788] focus:z-10 sm:text-sm"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-[#52b788] hover:text-[#40916c]">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#52b788] hover:bg-[#40916c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#52b788] disabled:opacity-50"
            >
              {isLoading ? 'লগইন হচ্ছে...' : 'লগইন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
