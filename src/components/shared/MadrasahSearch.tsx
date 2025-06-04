import React, { useState, useEffect, useRef, useCallback } from 'react';
// পূর্বের @/ alias ব্যবহার করা হয়েছে
import { useMadrasah } from '@/contexts/MadrasahSearchContext';
import { getAllMadrasahsForSearch } from '@/services/madrasahService';
// getAllExamsForSearch এই কোড স্নিপেটে ব্যবহার করা হয়নি, তাই এটি সরিয়ে দেওয়া হয়েছে।

interface Madrasah {
  _id: string;
  madrasahName: string;
  madrasahNames?: {
    bengaliName: string;
  };
  code?: string;
  [key: string]: any;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Madrasah[];
}

const MadrasahSearch: React.FC = () => {
  const { selectedMadrasah, setSelectedMadrasah } = useMadrasah();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [madrasahs, setMadrasahs] = useState<Madrasah[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const RESULTS_PER_PAGE = 10; // প্রতি পৃষ্ঠায় কতটি ফলাফল আনতে হবে তা নির্ধারণ করে

  // Function to fetch madrasahs with pagination
  const fetchMadrasahs = useCallback(async (term: string, page: number, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // searchTerm, page, এবং limit দিয়ে ক্যোয়ারি স্ট্রিং তৈরি করা হয়েছে
      const query = `searchTerm=${term}&page=${page}&limit=${RESULTS_PER_PAGE}`;
      const response: any = await getAllMadrasahsForSearch(query);

      if (response.success) {
        if (append) {
          setMadrasahs(prevMadrasahs => [...prevMadrasahs, ...response.data]);
        } else {
          setMadrasahs(response.data);
        }
        // মোট ফলাফল এবং বর্তমান লোড হওয়া সংখ্যার উপর ভিত্তি করে আরও ফলাফল আছে কিনা তা পরীক্ষা করা হয়েছে
        setHasMore(response.meta.total > (page * RESULTS_PER_PAGE));
      } else {
        throw new Error(response.message || 'মাদরাসা সার্চ করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      setError(err.message || 'মাদরাসা সার্চ করতে সমস্যা হয়েছে');
      console.error('Madrasah search error:', err);
      setHasMore(false); // ত্রুটি হলে আর কোনো ফলাফল নেই
    } finally {
      setIsLoading(false);
    }
  }, []); // ফাংশনটিকে মেমোরাইজ করার জন্য useCallback ব্যবহার করা হয়েছে

  // Initial load effect: Component মাউন্ট হওয়ার সময় মাদরাসা লোড করা হয়েছে
  useEffect(() => {
    // শুধুমাত্র যদি কোনো মাদরাসা আগে থেকে নির্বাচিত না থাকে তবেই প্রাথমিকভাবে ডেটা আনা হয়েছে
    if (!selectedMadrasah) {
      fetchMadrasahs('', 1, false); // খালি সার্চ টার্ম দিয়ে প্রথম পৃষ্ঠা আনা হয়েছে
    }
  }, [fetchMadrasahs, selectedMadrasah]);

  // যখন selectedMadrasah বাইরে থেকে পরিবর্তিত হয় তখন searchTerm সিঙ্ক করা হয়েছে
  useEffect(() => {
    if (selectedMadrasah) {
      const displayName = selectedMadrasah.madrasahNames?.bengaliName || selectedMadrasah.madrasahName;
      const displayText = selectedMadrasah.code
        ? `${displayName} (কোড: ${selectedMadrasah.code})`
        : displayName;
      setSearchTerm(displayText);
      setIsOpen(false); // একটি মাদরাসা নির্বাচিত হলে ড্রপডাউন বন্ধ করা হয়েছে
    } else {
      setSearchTerm('');
    }
  }, [selectedMadrasah]);

  // ব্যবহারকারীর ইনপুটের জন্য Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // শুধুমাত্র তখনই সার্চ করা হয়েছে যদি searchTerm খালি না হয় এবং কোনো মাদরাসা স্পষ্টভাবে নির্বাচিত না থাকে
      // অথবা যদি searchTerm খালি হয়, কিন্তু আমরা প্রাথমিক ফলাফল দেখাতে চাই (প্রাথমিক লোড প্রভাব দ্বারা পরিচালিত)
      if (searchTerm.trim() && !selectedMadrasah) {
        setCurrentPage(1); // নতুন সার্চের জন্য পৃষ্ঠা রিসেট করা হয়েছে
        setMadrasahs([]); // নতুন সার্চের জন্য পূর্বের ফলাফল মুছে ফেলা হয়েছে
        setHasMore(true); // নতুন সার্চের জন্য আরও ফলাফল থাকতে পারে বলে ধরে নেওয়া হয়েছে
        fetchMadrasahs(searchTerm, 1, false);
      } else if (!searchTerm.trim() && !selectedMadrasah) {
        // যদি সার্চ টার্ম খালি হয় এবং কোনো মাদরাসা নির্বাচিত না থাকে, তাহলে আবার প্রাথমিক ফলাফল দেখানো হয়েছে
        setCurrentPage(1);
        setMadrasahs([]);
        setHasMore(true);
        fetchMadrasahs('', 1, false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedMadrasah, fetchMadrasahs]);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করা হয়েছে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ইনফিনিট স্ক্রল লজিক
  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      // নিচে স্ক্রল করা হয়েছে কিনা তা পরীক্ষা করা হয়েছে
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      if (scrollHeight - scrollTop <= clientHeight + 1 && hasMore && !isLoading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMadrasahs(searchTerm, nextPage, true); // নতুন ফলাফল যুক্ত করা হয়েছে
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMore, isLoading, searchTerm, fetchMadrasahs]);

  const handleSelectMadrasah = (madrasah: Madrasah) => {
    setSelectedMadrasah(madrasah);
    // selectedMadrasah এর useEffect এর মাধ্যমে searchTerm আপডেট হবে
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // ব্যবহারকারী টাইপ করলে নির্বাচিত মাদরাসা মুছে ফেলা হয়েছে
    if (selectedMadrasah) {
      setSelectedMadrasah(null);
    }
    // টাইপ করার সময় ড্রপডাউন খোলা রাখা হয়েছে, এবং সম্ভাব্য নতুন সার্চ ট্রিগার করা হয়েছে
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true); // ফোকাসে সবসময় ড্রপডাউন খোলা রাখা হয়েছে
    // যদি সার্চ টার্ম খালি হয়, তাহলে প্রাথমিক ফলাফল পুনরায় আনা হয়েছে
    if (!searchTerm.trim() && madrasahs.length === 0 && !isLoading) {
      setCurrentPage(1);
      setHasMore(true);
      fetchMadrasahs('', 1, false);
    } else if (searchTerm.trim() && madrasahs.length === 0 && !isLoading) {
      // যদি সার্চ টার্ম থাকে কিন্তু কোনো ফলাফল না থাকে, তাহলে সার্চ পুনরায় চালানো হয়েছে
      setCurrentPage(1);
      setHasMore(true);
      fetchMadrasahs(searchTerm, 1, false);
    }
  };

  const handleClearInput = () => {
    setSearchTerm('');
    setSelectedMadrasah(null);
    setMadrasahs([]);
    setIsOpen(false);
    setError(null);
    setCurrentPage(1); // পেজিনেশন রিসেট করা হয়েছে
    setHasMore(true); // hasMore রিসেট করা হয়েছে
    fetchMadrasahs('', 1, false); // পরিষ্কার করার পর প্রাথমিক ডেটা আনা হয়েছে
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="মাদরাসা খুঁজুন..."
          className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchTerm && ( // শুধুমাত্র searchTerm এর মান থাকলে ক্লিয়ার বাটন দেখানো হয়েছে
            <button
              type="button"
              onClick={handleClearInput}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Clear"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute z-10 w-full mt-1 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {isOpen && madrasahs.length > 0 && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          ref={scrollContainerRef} // স্ক্রল লিসেনারের জন্য রেফ সংযুক্ত করা হয়েছে
        >
          {madrasahs.map((madrasah) => (
            <div
              key={madrasah._id}
              onClick={() => handleSelectMadrasah(madrasah)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {madrasah.madrasahNames?.bengaliName || madrasah.madrasahName}
              </div>
              {madrasah.code && (
                <div className="text-sm text-gray-500">কোড: {madrasah.code}</div>
              )}
            </div>
          ))}
          {isLoading && ( // ইনফিনিট স্ক্রলের সময় তালিকার নিচে লোডিং ইন্ডিকেটর দেখানো হয়েছে
            <div className="p-3 text-center text-gray-500">
              লোড হচ্ছে...
            </div>
          )}
          {!hasMore && madrasahs.length > 0 && (
            <div className="p-3 text-center text-gray-500 text-sm">
              আর কোনো মাদরাসা নেই
            </div>
          )}
        </div>
      )}

      {isOpen && madrasahs.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg text-gray-500 text-center">
          কোনো মাদরাসা পাওয়া যায়নি
        </div>
      )}
    </div>
  );
};

export default MadrasahSearch;
