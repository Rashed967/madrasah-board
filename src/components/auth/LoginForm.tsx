'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { setTokens, getDashboardRoute } from '@/services/authService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from './PasswordInput';
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

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await post<LoginData>('/users/login', { username, password });
      
      if (response.success) {
        setTokens({
          accessToken: response.data.accessToken,
          user: response.data.user
        });
        
        toast.success('সফলভাবে লগইন হয়েছে');
        
        const dashboardRoute = getDashboardRoute();
        router.push(dashboardRoute);
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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="ইউজারনেম লিখুন"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm">
          <a href="/forgot-password" className="font-medium text-[#52b788] hover:text-[#40916c]">
            পাসওয়ার্ড ভুলে গেছেন?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'লগইন হচ্ছে...' : 'লগইন'}
      </Button>
    </form>
  );
}
