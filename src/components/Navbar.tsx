'use client';

import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
            <span className="text-white text-2xl font-bold ml-4">জাতীয় দ্বীনি মাদরাসা শিক্ষা বোর্ড</span>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">আব্দুল্লাহ</p>
                <p className="text-xs text-white/80">সুপার অ্যাডমিন</p>
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                প্রোফাইল
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                সেটিংস
              </a>
              <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                লগ আউট
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
