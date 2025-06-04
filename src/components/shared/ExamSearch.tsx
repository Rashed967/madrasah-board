import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExam } from '@/contexts/ExamSearchContext';
import { getAllExamsForSearch } from '@/services/examService';

interface Exam {
  _id: string;
  examName: string;
  [key: string]: any;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: Exam[];
}

const ExamSearch: React.FC = () => {
  const { selectedExam, setSelectedExam } = useExam();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const RESULTS_PER_PAGE = 10; // প্রতি পৃষ্ঠায় কতটি ফলাফল আনতে হবে তা নির্ধারণ করে

  // Function to fetch exams with pagination
  const fetchExams = useCallback(async (term: string, page: number, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // searchTerm, page, এবং limit দিয়ে ক্যোয়ারি স্ট্রিং তৈরি করা হয়েছে
      const query = `searchTerm=${term}&page=${page}&limit=${RESULTS_PER_PAGE}`;
      const response: any = await getAllExamsForSearch(query);
      console.log('Exam search response:', response);

      if (response.success) {
        if (append) {
          setExams(prevExams => [...prevExams, ...response.data]);
        } else {
          setExams(response.data);
        }
        // মোট ফলাফল এবং বর্তমান লোড হওয়া সংখ্যার উপর ভিত্তি করে আরও ফলাফল আছে কিনা তা পরীক্ষা করা হয়েছে
        if (response.meta) {
          setHasMore(response.meta.total > (page * RESULTS_PER_PAGE));
        } else {
          // যদি meta অবজেক্ট না থাকে, তাহলে বর্তমান পেজে যতগুলো ফলাফল আছে তার উপর ভিত্তি করে আরও ফলাফল আছে কিনা তা পরীক্ষা করা হয়েছে
          setHasMore(response.data.length === RESULTS_PER_PAGE);
        }
      } else {
        throw new Error(response.message || 'পরীক্ষা সার্চ করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error('Exam search error:', err);
      setHasMore(false); // ত্রুটি হলে আর কোনো ফলাফল নেই
    } finally {
      setIsLoading(false);
    }
  }, []); // ফাংশনটিকে মেমোরাইজ করার জন্য useCallback ব্যবহার করা হয়েছে

  // Initial load effect: Component মাউন্ট হওয়ার সময় পরীক্ষা লোড করা হয়েছে
  useEffect(() => {
    // শুধুমাত্র যদি কোনো পরীক্ষা আগে থেকে নির্বাচিত না থাকে তবেই প্রাথমিকভাবে ডেটা আনা হয়েছে
    if (!selectedExam) {
      fetchExams('', 1, false); // খালি সার্চ টার্ম দিয়ে প্রথম পৃষ্ঠা আনা হয়েছে
    }
  }, [fetchExams, selectedExam]);

  // যখন selectedExam বাইরে থেকে পরিবর্তিত হয় তখন searchTerm সিঙ্ক করা হয়েছে
  useEffect(() => {
    if (selectedExam) {
      setSearchTerm(selectedExam.examName);
      setIsOpen(false); // একটি পরীক্ষা নির্বাচিত হলে ড্রপডাউন বন্ধ করা হয়েছে
    } else {
      setSearchTerm('');
    }
  }, [selectedExam]);

  // ব্যবহারকারীর ইনপুটের জন্য Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // শুধুমাত্র তখনই সার্চ করা হয়েছে যদি searchTerm খালি না হয় এবং কোনো পরীক্ষা স্পষ্টভাবে নির্বাচিত না থাকে
      // অথবা যদি searchTerm খালি হয়, কিন্তু আমরা প্রাথমিক ফলাফল দেখাতে চাই (প্রাথমিক লোড প্রভাব দ্বারা পরিচালিত)
      if (searchTerm.trim() && !selectedExam) {
        setCurrentPage(1); // নতুন সার্চের জন্য পৃষ্ঠা রিসেট করা হয়েছে
        setExams([]); // নতুন সার্চের জন্য পূর্বের ফলাফল মুছে ফেলা হয়েছে
        setHasMore(true); // নতুন সার্চের জন্য আরও ফলাফল থাকতে পারে বলে ধরে নেওয়া হয়েছে
        fetchExams(searchTerm, 1, false);
      } else if (!searchTerm.trim() && !selectedExam) {
        // যদি সার্চ টার্ম খালি হয় এবং কোনো পরীক্ষা নির্বাচিত না থাকে, তাহলে আবার প্রাথমিক ফলাফল দেখানো হয়েছে
        setCurrentPage(1);
        setExams([]);
        setHasMore(true);
        fetchExams('', 1, false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedExam, fetchExams]);

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
        fetchExams(searchTerm, nextPage, true); // নতুন ফলাফল যুক্ত করা হয়েছে
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMore, isLoading, searchTerm, fetchExams]);

  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    // selectedExam এর useEffect এর মাধ্যমে searchTerm আপডেট হবে
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // ব্যবহারকারী টাইপ করলে নির্বাচিত পরীক্ষা মুছে ফেলা হয়েছে
    if (selectedExam) {
      setSelectedExam(null);
    }
    // টাইপ করার সময় ড্রপডাউন খোলা রাখা হয়েছে, এবং সম্ভাব্য নতুন সার্চ ট্রিগার করা হয়েছে
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true); // ফোকাসে সবসময় ড্রপডাউন খোলা রাখা হয়েছে
    // যদি সার্চ টার্ম খালি হয়, তাহলে প্রাথমিক ফলাফল পুনরায় আনা হয়েছে
    if (!searchTerm.trim() && exams.length === 0 && !isLoading) {
      setCurrentPage(1);
      setHasMore(true);
      fetchExams('', 1, false);
    } else if (searchTerm.trim() && exams.length === 0 && !isLoading) {
      // যদি সার্চ টার্ম থাকে কিন্তু কোনো ফলাফল না থাকে, তাহলে সার্চ পুনরায় চালানো হয়েছে
      setCurrentPage(1);
      setHasMore(true);
      fetchExams(searchTerm, 1, false);
    }
  };

  const handleClearInput = () => {
    setSearchTerm('');
    setSelectedExam(null);
    setExams([]);
    setIsOpen(false);
    setError(null);
    setCurrentPage(1); // পেজিনেশন রিসেট করা হয়েছে
    setHasMore(true); // hasMore রিসেট করা হয়েছে
    fetchExams('', 1, false); // পরিষ্কার করার পর প্রাথমিক ডেটা আনা হয়েছে
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="পরীক্ষা খুঁজুন..."
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

      {isOpen && exams.length > 0 && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          ref={scrollContainerRef} // স্ক্রল লিসেনারের জন্য রেফ সংযুক্ত করা হয়েছে
        >
          {exams.map((exam) => (
            <div
              key={exam._id}
              onClick={() => handleSelectExam(exam)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {exam.examName}
              </div>
            </div>
          ))}
          {isLoading && ( // ইনফিনিট স্ক্রলের সময় তালিকার নিচে লোডিং ইন্ডিকেটর দেখানো হয়েছে
            <div className="p-3 text-center text-gray-500">
              লোড হচ্ছে...
            </div>
          )}
          {!hasMore && exams.length > 0 && (
            <div className="p-3 text-center text-gray-500 text-sm">
              আর কোনো পরীক্ষা নেই
            </div>
          )}
        </div>
      )}

      {isOpen && exams.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg text-gray-500 text-center">
          কোনো পরীক্ষা পাওয়া যায়নি
        </div>
      )}
    </div>
  );
};

export default ExamSearch;