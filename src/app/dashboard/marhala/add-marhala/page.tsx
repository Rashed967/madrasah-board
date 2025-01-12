'use client';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import React, { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

// Dummy data for marhala categories
const marhalaCategories = [
  { id: 1, name: 'হিফজ' },
  { id: 2, name: 'দরসিয়াত' }
];

export default function AddMarhalaPage() {
  const [marhalName, setMarhalName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedMarhala, setAddedMarhala] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!marhalName.trim() || !selectedCategory) {
      toast.error('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    // Generate a unique ID (in real app, this would come from backend)
    const newMarhalaId = Math.floor(100000 + Math.random() * 900000);

    // Prepare marhala object
    const newMarhala = {
      id: newMarhalaId,
      name: marhalName,
      category: selectedCategory
    };

    // In a real app, this would be an API call
    // For now, we'll just show success modal
    setAddedMarhala(newMarhala);
    setShowSuccessModal(true);

    // Reset form
    setMarhalName('');
    setSelectedCategory('');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAddedMarhala(null);
  };

  return (
    <div className="container mx-auto px-4 lg:px-0 mt-20">
      <div className="max-w-xl mx-auto ">
        <h1 className="text-2xl font-bold mb-8">নতুন মারহালা যুক্ত করুন</h1>

        <form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="mb-6">
            <label 
              htmlFor="marhalName" 
              className="block text-gray-700 font-medium mb-2"
            >
              মারহালা নাম <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="marhalName"
              value={marhalName}
              onChange={(e) => setMarhalName(e.target.value)}
              placeholder="মারহালা নাম লিখুন"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
              required
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="marhalaCategory" 
              className="block text-gray-700 font-medium mb-2"
            >
              মারহালা ক্যাটাগরি <span className="text-red-500">*</span>
            </label>
            <select
              id="marhalaCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
              required
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {marhalaCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-[#52b788] text-white px-6 py-2 rounded-md hover:bg-[#52b788]/90 transition-colors flex items-center"
            >
              <MdCheck className="mr-2" />
              মারহালা যুক্ত করুন
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccessModal && addedMarhala && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-[400px] p-6">
              <div className="bg-[#52b788] text-white p-4 -m-6 mb-4 rounded-t-lg flex justify-between items-center">
                <h2 className="text-lg font-bold">সফলভাবে যুক্ত হয়েছে</h2>
              </div>

              <div className="text-center py-6">
                <div className="bg-[#52b788]/10 rounded-full p-4 inline-block mb-4">
                  <MdCheck className="text-[#52b788] text-4xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">মারহালা যুক্ত হয়েছে</h3>
                <p className="text-gray-600 mb-4">
                  মারহালা: {addedMarhala.name}
                  <br />
                  ক্যাটাগরি: {addedMarhala.category}
                  <br />
                  আইডি: {addedMarhala.id}
                </p>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleCloseSuccessModal}
                  className="bg-[#52b788] text-white px-6 py-2 rounded-md hover:bg-[#52b788]/90"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
