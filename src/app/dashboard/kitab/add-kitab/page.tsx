'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdAdd } from 'react-icons/md';
import StatusDialog from '@/components/ui/StatusDialog';
import { createKitab } from '@/features/kitab/kitab.service';

export default function AddKitab() {
  const router = useRouter();
  const [bengaliName, setBengaliName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [fullMarks, setFullMarks] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bengaliName.trim()) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'বাংলা নাম দিন'
      });
      return;
    }

    if (!fullMarks || Number(fullMarks) < 1 || Number(fullMarks) > 100) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'ফুল মার্কস ১-১০০ এর মধ্যে দিন'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await createKitab({
        name: {
          bengaliName,
          arabicName: arabicName || undefined
        },
        fullMarks: Number(fullMarks)
      });

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: response.message
        });

        // Reset form
        setBengaliName('');
        setArabicName('');
        setFullMarks('');
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message
        });
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'কিছু একটা সমস্যা হয়েছে'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeStatusDialog = () => {
    setStatusDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-12 sm:mt-6">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md my-auto">
        <h2 className="text-lg font-bold mb-6 text-gray-800">নতুন কিতাব যোগ করুন</h2>
        
        {/* Bengali Name Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            বাংলা নাম
          </label>
          <input
            type="text"
            value={bengaliName}
            onChange={(e) => setBengaliName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52B788]/70 text-gray-700"
            placeholder="কিতাবের বাংলা নাম লিখুন"
            required
          />
        </div>

        {/* Arabic Name Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            আরবি নাম
          </label>
          <input
            type="text"
            value={arabicName}
            onChange={(e) => setArabicName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52B788]/70 text-gray-700"
            placeholder="কিতাবের আরবি নাম লিখুন"
          />
        </div>

        {/* Full Marks Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ফুল মার্কস
          </label>
          <input
            type="number"
            value={fullMarks}
            onChange={(e) => setFullMarks(e.target.value)}
            min="1"
            max="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52B788]/70 text-gray-700"
            placeholder="১-১০০ এর মধ্যে নাম্বার দিন"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#52B788]/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <MdAdd className="mr-2" />
            {isLoading ? 'লোড হচ্ছে...' : 'কিতাব যোগ করুন'}
          </button>
        </div>
      </form>

      {/* Status Dialog */}
      <StatusDialog
        isOpen={statusDialog.isOpen}
        type={statusDialog.type}
        title={statusDialog.title}
        message={statusDialog.message}
        onClose={closeStatusDialog}
      />
    </div>
  );
}
