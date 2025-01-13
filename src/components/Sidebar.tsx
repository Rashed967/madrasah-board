'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MdDashboard, 
  MdSchool, 
  MdPerson, 
  MdLocationCity,
  MdAssignment,
  MdNotifications,
  MdSettings,
  MdAdd,
  MdSavedSearch,
  MdPeople,
  MdLibraryBooks,
  MdList,
  MdLocationOn
} from 'react-icons/md';

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    { name: 'ড্যাশবোর্ড', href: '/dashboard', icon: MdDashboard },
    { 
      name: 'মাদরাসা', 
      href: '/madrasah', 
      icon: MdSchool,
      submenu: [
        { name: 'মাদরাসা নিবন্ধন', href: '/dashboard/madrasah/register-madrasah', icon: MdAdd },
        { 
          name: 'সকল মাদরাসা', 
          href: '/dashboard/madrasah/all-madrasah', 
          icon: MdSavedSearch
        },
      ]
    },
    { 
      name: 'জোন', 
      href: '#', 
      icon: MdLocationOn,
      submenu: [
        { name: 'নতুন জোন যুক্ত করুন', href: '/dashboard/zone/add-zone', icon: MdAdd },
        { name: 'সকল জোন', href: '/dashboard/zone/all-zones', icon: MdList }
      ]
    },
    { 
      name: 'পরীক্ষা বিভাগ', 
      href: '/exam', 
      icon: MdAssignment,
      submenu: [
        { name: 'পরীক্ষা ক্রিয়েট', href: '/dashboard/exam/create-exam', icon: MdAdd },
        { name: 'প্রাক নিবন্ধন', href: '/dashboard/exam/pre-examinee-registration', icon: MdAdd },
        { name: 'পরীক্ষার্থী নিবন্ধন', href: '/dashboard/exam/examine-registration', icon: MdAdd },
        { name: 'সকল পরীক্ষার্থী', href: '/dashboard/exam/all-examinees', icon: MdSavedSearch },
      ]
    },
    { 
      name: 'নিবন্ধন আবেদন', 
      href: '#', 
      icon: MdNotifications,
      submenu: [
        { 
          name: 'মাদরাসা নিবন্ধন আবেদন', 
          href: '/dashboard/madrasah/registration-applications', 
          icon: MdSchool
        },
        { 
          name: 'মুমতাহিন নিবন্ধন আবেদন', 
          href: '/dashboard/mumtahin/registration-applications', 
          icon: MdPeople
        }
      ]
    },
    { 
      name: 'মারহালা', 
      href: '#', 
      icon: MdLibraryBooks,
      submenu: [
        {
          name: 'নতুন মারহালা যুক্ত করুন',
          href: '/dashboard/marhala/add-marhala',
          icon: MdAdd
        },
        {
          name: 'সকল মারহালা',
          href: '/dashboard/marhala/all-marhala',
          icon: MdList
        }
      ]
    },
    { name: 'মুমতাহিন', href: '/muhtamim', icon: MdPerson },
    { name: 'মারকায', href: '/markaz', icon: MdLocationCity },
    { name: 'নোটিফিকেশন', href: '/notifications', icon: MdNotifications },
    { name: 'সেটিংস', href: '/settings', icon: MdSettings },
  ];

  const pendingMadrasahs = []; // replace with actual data

  const handleMenuClick = (href: string, hasSubmenu: boolean) => {
    if (!hasSubmenu) {
      router.push(href);
      setIsOpen(false);
    }
  };

  const handleSubmenuClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-blue-500 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen w-56 transition-transform duration-300 ease-in-out bg-[#e0e1dd]`}
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const hasSubmenu = !!item.submenu;

              return (
                <div key={item.href}>
                  <div
                    className={`flex items-center p-2 rounded-lg cursor-pointer ${
                      isActive
                        ? 'bg-[#52b788] text-white'
                        : 'text-gray-800 hover:bg-white/70'
                    }`}
                    onClick={() => {
                      if (hasSubmenu) {
                        setExpandedMenu(expandedMenu === item.name ? null : item.name);
                      } else {
                        handleMenuClick(item.href, hasSubmenu);
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{item.name}</span>
                    {hasSubmenu && (
                      <svg
                        className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${
                          expandedMenu === item.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}

                  </div>
                  {hasSubmenu && expandedMenu === item.name && (
                    <div className="ml-3 mt-1 space-y-1">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = pathname === subItem.href;
                        
                        return (
                          <div
                            key={subItem.href}
                            className={`flex items-center p-2 rounded-lg cursor-pointer ${
                              isSubActive
                                ? 'bg-[#52b788] text-white'
                                : 'text-gray-800 hover:bg-white/70'
                            }`}
                            onClick={() => handleSubmenuClick(subItem.href)}
                          >
                            <SubIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{subItem.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
