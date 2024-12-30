'use client';

import { useState, useEffect, useRef } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { getCurrentUser, logout } from '@/services/authService';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUsername(user.username);
      setUserRole(user.role);
    }
  }, []);

  // Close menu when clicking outside
  useClickOutside(menuRef, () => {
    if (showProfileMenu) {
      setShowProfileMenu(false);
    }
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-[#52b788] shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <img 
              src="/logo.jpg" 
              alt="মাদরাসা ম্যানেজমেন্ট লোগো" 
              width={70} 
              height={70} 
              className="rounded-full shadow-md"
            />
            <span className="text-white text-xl font-bold ml-4">জাতীয় দ্বীনি মাদরাসা শিক্ষা বোর্ড</span>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{username}</p>
                <p className="text-xs text-white/80">{userRole}</p>
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                লগআউট
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
