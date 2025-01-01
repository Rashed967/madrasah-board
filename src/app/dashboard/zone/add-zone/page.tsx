'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdAdd } from 'react-icons/md';
import toast from 'react-hot-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { divisions } from '@/data/divisions';
import { createZone } from '@/services/zoneService';
import { StatusDialog } from '@/components/ui/status-dialog';

// Get all unique districts from divisions
const allDistricts = Object.values(divisions).reduce((acc, divisionDistricts) => {
  return [...acc, ...Object.keys(divisionDistricts)];
}, [] as string[]);

// Remove duplicates and sort
const districts = [...new Set(allDistricts)].sort();

export default function AddZone() {
  const router = useRouter();
  const [zoneName, setZoneName] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const handleAddDistrict = (district: string) => {
    if (!selectedDistricts.includes(district)) {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  const handleRemoveDistrict = (district: string) => {
    setSelectedDistricts(selectedDistricts.filter(d => d !== district));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zoneName.trim()) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'জোনের নাম দিন'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await createZone({
        name: zoneName,
        allDistricts: selectedDistricts
      });

  
      // ‍ুshow dialog based on response
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফলভাবে তৈরি হয়েছে',
          message: 'জোন তৈরি করা হয়েছে'
        });
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'জোন তৈরি করতে সমস্যা হয়েছে'
        });
      }
    

      // Clear form
      setZoneName('');
      setSelectedDistricts([]);
      
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'জোন তৈরি করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeStatusDialog = () => {
    setStatusDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Auto close success dialog after 3 seconds
  if (statusDialog.isOpen && statusDialog.type === 'success') {
    setTimeout(closeStatusDialog, 3000);
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-28">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">নতুন জোন যোগ করুন</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              জোনের নাম
            </label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52B788]/70"
              placeholder="জোনের নাম লিখুন"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              জেলা নির্বাচন করুন
            </label>
            <Select onValueChange={handleAddDistrict}>
              <SelectTrigger className='ring-1 ring-[#52B788]/70'>
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

            {selectedDistricts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">নির্বাচিত জেলাসমূহ:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDistricts.map((district) => (
                    <span
                      key={district}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#52B788]/80 text-white"
                    >
                      {district}
                      <button
                        type="button"
                        onClick={() => handleRemoveDistrict(district)}
                        className="ml-2 text-white hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#52B788]/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <MdAdd className="mr-2" />
              {isLoading ? 'লোড হচ্ছে...' : 'জোন যোগ করুন'}
            </button>
          </div>
        </form>
      </div>

      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={closeStatusDialog}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
    </div>
  );
}
