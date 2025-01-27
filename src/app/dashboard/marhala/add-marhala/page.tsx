'use client';

import { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { MultiSelect } from '@/components/ui/multi-select';
import { createMarhala } from '@/features/marhala/marhala.service';
import { getAllKitabs } from '@/features/kitab/kitab.service';
import type { IKitab } from '@/features/kitab/kitab.interface';
import type { IMarhalaName, MarhalaCategory, CreateMarhalaData } from '@/features/marhala/marhala.interface';

// Type for displaying marhala in the success modal
type DisplayMarhala = {
  name: IMarhalaName;
  listOfKitabs: string[];
  marhalaType: 'boys' | 'girls';
  marhalaCategory: MarhalaCategory;
};

export default function AddMarhalaPage() {
  const [bengaliName, setBengaliName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [kitabs, setKitabs] = useState<IKitab[]>([]);
  const [selectedKitabs, setSelectedKitabs] = useState<string[]>([]);
  const [type, setType] = useState<'boys' | 'girls'>('boys');
  const [category, setCategory] = useState<'hifz' | 'darsiyat'>('darsiyat');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKitabs = async () => {
      try {
        const response = await getAllKitabs(1, 100);
        if (response.success) {
          setKitabs(response.data);
        } else {
          toast.error('কিতাব লোড করতে সমস্যা হয়েছে');
        }
      } catch (error) {
        console.error('Error fetching kitabs:', error);
        toast.error('কিতাব লোড করতে সমস্যা হয়েছে');
      }
    };
    fetchKitabs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bengaliName.trim()) {
      toast.error('বাংলা নাম দিন');
      return;
    }

    if (selectedKitabs.length === 0) {
      toast.error('অন্তত একটি কিতাব নির্বাচন করুন');
      return;
    }

    try {
      setIsLoading(true);
      
      const marhalaData: CreateMarhalaData = {
        name: {
          bengaliName,
          arabicName: arabicName || undefined
        },
        listOfKitabs: selectedKitabs,
        marhalaType: type,
        marhalaCategory: category
      };

      const response = await createMarhala(marhalaData);

      if (response.success) {
        toast.success(response.message);
        // Reset form
        setBengaliName('');
        setArabicName('');
        setSelectedKitabs([]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('কিছু একটা সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-0 mt-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-lg font-bold mb-8">নতুন মারহালা যুক্ত করুন</h1>

        <form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-lg shadow-md p-8 md:grid md:grid-cols-2 gap-4"
        >
          <div className="mb-6">
            <label 
              htmlFor="bengaliName" 
              className="block text-gray-700 font-medium mb-2"
            >
              মারহালার বাংলা নাম <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="bengaliName"
              value={bengaliName}
              onChange={(e) => setBengaliName(e.target.value)}
              placeholder="মারহালার বাংলা নাম লিখুন"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
              required
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="arabicName" 
              className="block text-gray-700 font-medium mb-2"
            >
              মারহালার আরবি নাম
            </label>
            <input 
              type="text" 
              id="arabicName"
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              placeholder="মারহালার আরবি নাম লিখুন"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="type" 
              className="block text-gray-700 font-medium mb-2"
            >
              মারহালার ধরণ <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'boys' | 'girls')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
              required
            >
              <option value="boys">বালক</option>
              <option value="girls">বালিকা</option>
            </select>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="category" 
              className="block text-gray-700 font-medium mb-2"
            >
              মারহালার ক্যাটাগরি <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'hifz' | 'darsiyat')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
              required
            >
              <option value="darsiyat">দারসিয়াত</option>
              <option value="hifz">হিফজ</option>
            </select>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="kitabs" 
              className="block text-gray-700 font-medium mb-2"
            >
              কিতাব নির্বাচন করুন <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              options={kitabs.map(kitab => ({
                value: String(kitab._id),
                label: kitab.name.bengaliName
              }))}
              selected={selectedKitabs}
              setSelected={setSelectedKitabs}
              className="w-full"
              placeholder="কিতাব নির্বাচন করুন"
            />
          </div>
          <div className='hidden md:block'></div>
          <div className='hidden md:block'></div>

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-[#52b788] text-white px-6 py-2 rounded-md hover:bg-[#52b788]/90 transition-colors flex items-center disabled:opacity-50"
            >
              <MdCheck className="mr-2" />
              {isLoading ? 'অপেক্ষা করুন...' : 'মারহালা যুক্ত করুন'}
            </button>
          </div>
        </form>

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
