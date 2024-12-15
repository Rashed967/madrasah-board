'use client';

import React, { useState, useMemo } from 'react';
import { MdDelete, MdEdit, MdClose } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

// Dummy data for marhala list
const initialMarhalaList = [
  {
    id: 123456,
    name: 'আল-ফাতিহা মারহালা',
    category: 'হিফজ'
  },
  {
    id: 234567,
    name: 'আন-নাহউ মারহালা',
    category: 'দরসিয়াত'
  }
];

// Dummy data for marhala categories
const marhalaCategories = [
  { id: 1, name: 'হিফজ' },
  { id: 2, name: 'দরসিয়াত' }
];

export default function AllMarhalaPage() {
  const [marhalaList, setMarhalaList] = useState(initialMarhalaList);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMarhala, setEditingMarhala] = useState(null);
  const marhalaPerPage = 5;

  // Pagination Logic
  const paginatedMarhala = useMemo(() => {
    const startIndex = (currentPage - 1) * marhalaPerPage;
    return marhalaList.slice(startIndex, startIndex + marhalaPerPage);
  }, [marhalaList, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(marhalaList.length / marhalaPerPage), 
    [marhalaList]
  );

  // Pagination Handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Edit Marhala
  const handleEditMarhala = (marhala) => {
    setEditingMarhala({...marhala});
  };

  // Save Edited Marhala
  const handleSaveEdit = () => {
    if (!editingMarhala.name.trim() || !editingMarhala.category) {
      toast.error('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    // Update the marhala in the list
    const updatedList = marhalaList.map(m => 
      m.id === editingMarhala.id ? editingMarhala : m
    );

    setMarhalaList(updatedList);
    toast.success(`${editingMarhala.name} মারহালা আপডেট হয়েছে`);
    setEditingMarhala(null);
  };

  // Delete Marhala
  const handleDeleteMarhala = (marhalaToDelete) => {
    const updatedList = marhalaList.filter(m => m.id !== marhalaToDelete.id);
    setMarhalaList(updatedList);
    toast.success(`${marhalaToDelete.name} মারহালা মুছে ফেলা হয়েছে`);
  };

  return (
    <div className="p-8 mt-12 mx-6">
      <h1 className="text-2xl font-bold mb-8">সকল মারহালা</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#52b788] text-white">
            <tr>
              <th className="px-4 py-3 text-left">মারহালা আইডি</th>
              <th className="px-4 py-3 text-left">মারহালা নাম</th>
              <th className="px-4 py-3 text-left">মারহালা ক্যাটাগরি</th>
              <th className="px-4 py-3 text-left">ক্রিয়াকলাপ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMarhala.map((marhala) => (
              <tr key={marhala.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-600">{marhala.id}</td>
                <td className="px-4 py-4 text-sm font-semibold">{marhala.name}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{marhala.category}</td>
                <td className="px-4 py-4 text-sm text-gray-600 flex space-x-2">
                  <button 
                    className="text-[#52b788] hover:bg-[#52b788]/10 p-2 rounded-full"
                    onClick={() => handleEditMarhala(marhala)}
                    title="সম্পাদনা করুন"
                  >
                    <MdEdit className="text-lg" />
                  </button>
                  <button 
                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-full"
                    onClick={() => handleDeleteMarhala(marhala)}
                    title="মুছে ফেলুন"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          মোট মারহালা: {marhalaList.length}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePreviousPage}
            className="bg-[#52b788] text-white px-3 py-1.5 rounded text-sm hover:bg-[#52b788]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            পূর্ববর্তী
          </button>
          <span className="text-sm text-gray-600">
            পৃষ্ঠা {currentPage} / {totalPages}
          </span>
          <button 
            onClick={handleNextPage}
            className="bg-[#52b788] text-white px-3 py-1.5 rounded text-sm hover:bg-[#52b788]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            পরবর্তী
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingMarhala && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[400px] p-6">
            <div className="bg-[#52b788] text-white p-4 -m-6 mb-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">মারহালা সম্পাদনা</h2>
              <button 
                onClick={() => setEditingMarhala(null)}
                className="text-white hover:bg-[#52b788]/90 p-2 rounded-full"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="editMarhalaName" 
                  className="block text-gray-700 font-medium mb-2"
                >
                  মারহালা নাম <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  id="editMarhalaName"
                  value={editingMarhala.name}
                  onChange={(e) => setEditingMarhala({
                    ...editingMarhala, 
                    name: e.target.value
                  })}
                  placeholder="মারহালা নাম লিখুন"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="editMarhalaCategory" 
                  className="block text-gray-700 font-medium mb-2"
                >
                  মারহালা ক্যাটাগরি <span className="text-red-500">*</span>
                </label>
                <select
                  id="editMarhalaCategory"
                  value={editingMarhala.category}
                  onChange={(e) => setEditingMarhala({
                    ...editingMarhala, 
                    category: e.target.value
                  })}
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
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={() => setEditingMarhala(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                বাতিল
              </button>
              <button 
                onClick={handleSaveEdit}
                className="bg-[#52b788] text-white px-4 py-2 rounded hover:bg-[#52b788]/90"
              >
                সংরক্ষণ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
