'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdAdd, MdDelete } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Dummy districts data - replace with actual API call
const districts = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
  'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'ফরিদপুর', 'কিশোরগঞ্জ'
];

export default function AddZone() {
  const router = useRouter();
  const [zoneName, setZoneName] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDistrict = (district: string) => {
    if (!selectedDistricts.includes(district)) {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  const handleRemoveDistrict = (districtToRemove: string) => {
    setSelectedDistricts(selectedDistricts.filter(district => district !== districtToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zoneName.trim()) {
      toast.error('জোনের নাম দিন');
      return;
    }

    if (selectedDistricts.length === 0) {
      toast.error('কমপক্ষে একটি জেলা নির্বাচন করুন');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would typically send the data to your backend
      console.log({ zoneName, districts: selectedDistricts });
      toast.success('জোন সফলভাবে যুক্ত করা হয়েছে');
      router.push('/dashboard/zone/all-zones');
    } catch (error) {
      console.error('Error adding zone:', error);
      toast.error('একটি সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 mt-12 mx-6">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">নতুন জোন যুক্ত করুন</h1>
          <p className="mt-2 text-sm text-gray-600">জোনের তথ্য পূরণ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
          {/* Zone Name */}
          <div>
            <label htmlFor="zoneName" className="block text-sm font-medium text-gray-700 mb-1">
              জোনের নাম
            </label>
            <input
              id="zoneName"
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="জোনের নাম লিখুন"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#52b788] focus:border-[#52b788]"
            />
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              জেলা নির্বাচন করুন
            </label>
            <Select onValueChange={handleAddDistrict}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="জেলা নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem 
                    key={district} 
                    value={district}
                    disabled={selectedDistricts.includes(district)}
                  >
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Districts */}
          {selectedDistricts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                নির্বাচিত জেলাসমূহ
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedDistricts.map((district) => (
                  <div
                    key={district}
                    className="flex items-center gap-1 px-3 py-1 bg-[#52b788] text-white rounded-full text-sm"
                  >
                    <span>{district}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDistrict(district)}
                      className="p-1 hover:bg-[#429670] rounded-full"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#429670] focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdAdd className="w-5 h-5" />
              <span>জোন যুক্ত করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
