'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { MdSearch, MdFilterList } from 'react-icons/md';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Mock data - replace with actual data fetching
const MOCK_EXAMINEES = [
  {
    id: 1,
    registrationNumber: '15847855',
    name: 'মোঃ আবদুল কালাম',
    photo: '/student.jpeg',
    marhala: 'দাখিল',
    madrasah: 'দারুল উলূম মাদরাসা',
    nationalId: '1234567890'
  },
  {
    id: 2,
    registrationNumber: '25698741',
    name: 'আলী আহমদ',
    photo: '/placeholder-profile.jpg',
    marhala: 'আলিম',
    madrasah: 'আল-আজহার মাদরাসা',
    nationalId: '9876543210'
  },
  {
    id: 3,
    registrationNumber: '25698741',
    name: 'জাকের মুহাম্মদ',
    photo: '/placeholder-profile.jpg',
    marhala: 'ফাযিল',
    madrasah: 'আল-আজহার মাদরাসা',
    nationalId: '54564874842'
  },
  {
    id: 4,
    registrationNumber: '25698741',
    name: 'মোঃ আবদুল কালাম',
    photo: '/student.jpeg',
    marhala: 'দাখিল',
    madrasah: 'দারুল উলূম মাদরাসা',
    nationalId: '1234567890'
  },{
    id: 5,
    registrationNumber: '25698741',
    name: 'মোঃ আবদুল কালাম',
    photo: '/student.jpeg',
    marhala: 'দাখিল',
    madrasah: 'দারুল উলূম মাদরাসা',
    nationalId: '1234567890'
  },
  {
    id: 6,
    registrationNumber: '25698741',
    name: 'মোঃ আবদুল কালাম',
    photo: '/student.jpeg',
    marhala: 'দাখিল',
    madrasah: 'দারুল উলূম মাদরাসা',
    nationalId: '1234567890'
  },
  {
    id: 7,
    registrationNumber: '25698741',
    name: 'মোঃ আবদুল কালাম',
    photo: '/student.jpeg',
    marhala: 'দাখিল',
    madrasah: 'দারুল উলূম মাদরাসা',
    nationalId: '1234567890'
  }
  // Add more mock examinees as needed
];

export default function AllExamineesPage() {
  const [examinees, setExaminees] = useState(MOCK_EXAMINEES);
  const [selectedExaminee, setSelectedExaminee] = useState<any>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [examineeToDelete, setExamineeToDelete] = useState(null);

  // Filter States
  const [selectedMarhala, setSelectedMarhala] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedExamineeType, setSelectedExamineeType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Unique Marhala and Exam Types
  const uniqueMarhala = useMemo(() => 
    [...new Set(MOCK_EXAMINEES.map(e => e.marhala))], 
    [MOCK_EXAMINEES]
  );

  const examOptions = [
    { value: 'দাখিল', label: 'দাখিল' },
    { value: 'আলিম', label: 'আলিম' },
    { value: 'কামিল', label: 'কামিল' },
  ];

  const examineeTypeOptions = [
    { value: 'নিয়মিত', label: 'নিয়মিত' },
    { value: 'বহিঃস্থ', label: 'বহিঃস্থ' },
  ];

  // Filtered Examinees
  const filteredExaminees = useMemo(() => {
    return MOCK_EXAMINEES.filter(examinee => {
      const matchesMarhala = !selectedMarhala || 
        examinee.marhala === selectedMarhala;
      
      const matchesExam = !selectedExam || 
        examinee.marhala === selectedExam;
      
      const matchesExamineeType = !selectedExamineeType;
      
      const matchesSearch = !searchQuery || 
        examinee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        examinee.nationalId.includes(searchQuery);
      
      return matchesMarhala && matchesExam && 
             matchesExamineeType && matchesSearch;
    });
  }, [MOCK_EXAMINEES, selectedMarhala, selectedExam, 
      selectedExamineeType, searchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of examinees per page

  // Paginated Examinees
  const paginatedExaminees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExaminees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExaminees, currentPage, itemsPerPage]);

  // Total Pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredExaminees.length / itemsPerPage), 
    [filteredExaminees, itemsPerPage]
  );

  // Pagination Change Handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Handle Delete Confirmation
  const handleDeleteConfirmation = (examinee) => {
    setExamineeToDelete(examinee);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (!examineeToDelete) return;

    // Remove the examinee from the list
    const updatedExaminees = MOCK_EXAMINEES.filter(
      (examinee) => examinee.id !== examineeToDelete.id
    );

    // Update state to reflect deleted examinee
    // Note: In a real app, you'd call an API here
    MOCK_EXAMINEES.splice(
      MOCK_EXAMINEES.findIndex((e) => e.id === examineeToDelete.id),
      1
    );

    // Show success toast
    toast.success('পরীক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে', {
      duration: 2000,
      position: 'top-center',
      style: {
        backgroundColor: '#52b788',
        opacity: 0.5,
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '80px',
      },
      icon: '🗑️',
    });

    // Close the confirmation modal
    setIsDeleteConfirmOpen(false);
    setExamineeToDelete(null);
  };

  // Cancel Delete
  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setExamineeToDelete(null);
  };

  // Handle Edit Button Click
  const handleEditClick = (examinee) => {
    // Set selected examinee for both modal types
    setSelectedExaminee(examinee);
    
    // Set edit form data and open edit modal
    setEditFormData(examinee);
    setIsEditModalOpen(true);
  };

  // Handle Edit Form Submit
  const handleEditSubmit = () => {
    setExaminees(prev => 
      prev.map(examinee => 
        examinee.id === selectedExaminee.id ? selectedExaminee : examinee
      )
    );
    setSelectedExaminee(null);
  };

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMarhala, selectedExam, selectedExamineeType, searchQuery]);

  // Edit Examinee Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  // Exam Options
  const examOptionsEdit = [
    { value: 'দাখিল', label: 'দাখিল' },
    { value: 'আলিম', label: 'আলিম' },
    { value: 'কামিল', label: 'কামিল' },
    { value: 'হিফজ', label: 'হিফজ' }
  ];

  // Examinee Type Options
  const examineeTypeOptionsEdit = [
    { value: 'নিয়মিত', label: 'নিয়মিত' },
    { value: 'অনিয়মিত', label: 'অনিয়মিত' }
  ];

  // Marhala Options
  const uniqueMarhalaEdit = [
    'প্রাথমিক', 
    'মাধ্যমিক', 
    'উচ্চ মাধ্যমিক'
  ];

  // Madrasah Search Function
  const [madrasahOptions, setMadrasahOptions] = useState([]);
  const handleMadrasahSearch = (query) => {
    // Simulated madrasah search - replace with actual API call
    const allMadrasahs = [
      'দারুল উলূম মাদরাসা',
      'জামিয়া হিদায়া ইসলামিয়া',
      'আল-আমিন মাদরাসা'
    ];
    const filteredMadrasahs = allMadrasahs.filter(m => 
      m.toLowerCase().includes(query.toLowerCase())
    );
    setMadrasahOptions(filteredMadrasahs);
  };

  // Handle Edit Form Submit
  const handleEditSubmitEdit = (e) => {
    e.preventDefault();
    // TODO: Implement actual update logic
    
    // Simulated update success
    const updatedExaminees = paginatedExaminees.map(examinee => 
      examinee.id === editFormData.id ? editFormData : examinee
    );

    // Show success toast
    toast.success('পরীক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে', {
      duration: 2000,
      position: 'top-center',
      style: {
        backgroundColor: '#52b788',
        opacity: 0.5,
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '80px', // Adjust this value to position just below the navbar
      },
      icon: '✅',
    });

    setIsEditModalOpen(false);
  };

  // Render Edit Modal
  const renderEditModal = () => {
    if (!isEditModalOpen || !editFormData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">পরীক্ষার্থী সম্পাদনা</h2>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleEditSubmitEdit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Exam Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পরীক্ষা নির্ধারণ *
                </label>
                <select 
                  value={editFormData.exam}
                  onChange={(e) => setEditFormData({...editFormData, exam: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                  required
                >
                  <option value="">পরীক্ষা নির্বাচন করুন</option>
                  {examOptionsEdit.map(option => (
                    <option  key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Madrasah Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  মাদরাসা নির্ধারণ *
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="মাদরাসা খুঁজুন"
                    value={editFormData.madrasah}
                    onChange={(e) => {
                      setEditFormData({...editFormData, madrasah: e.target.value});
                      handleMadrasahSearch(e.target.value);
                    }}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                    required
                  />
                  {madrasahOptions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      {madrasahOptions.map(madrasah => (
                        <div 
                          key={madrasah}
                          onClick={() => {
                            setEditFormData({...editFormData, madrasah});
                            setMadrasahOptions([]);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {madrasah}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Marhala Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  মারহালা নির্ধারণ *
                </label>
                <select 
                  value={editFormData.marhala}
                  onChange={(e) => setEditFormData({...editFormData, marhala: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                  required
                >
                  <option value="">মারহালা নির্বাচন করুন</option>
                  {uniqueMarhalaEdit.map(marhala => (
                    <option key={marhala} value={marhala}>{marhala}</option>
                  ))}
                </select>
              </div>

              {/* Examinee Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পরীক্ষার্থীর ধরণ
                </label>
                <select 
                  value={editFormData.examineeType}
                  onChange={(e) => setEditFormData({...editFormData, examineeType: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                >
                  <option value="">ধরণ নির্বাচন করুন</option>
                  {examineeTypeOptionsEdit.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Examinee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পরীক্ষার্থীর নাম *
                </label>
                <input 
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                  placeholder="পরীক্ষার্থীর নাম লিখুন"
                  required
                />
              </div>

              {/* Father's Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পিতার নাম *
                </label>
                <input 
                  type="text"
                  value={editFormData.fatherName}
                  onChange={(e) => setEditFormData({...editFormData, fatherName: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                  placeholder="পিতার নাম লিখুন"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  জন্ম তারিখ *
                </label>
                <input 
                  type="date"
                  value={editFormData.dateOfBirth}
                  onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                  required
                />
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  জন্ম নিবন্ধন / জাতীয় পরিচয় পত্র *
                </label>
                <input 
                  type="text"
                  value={editFormData.nationalId}
                  onChange={(e) => setEditFormData({...editFormData, nationalId: e.target.value})}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
                  placeholder="জাতীয় পরিচয় পত্র নাম্বার"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ছবি
                </label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditFormData({...editFormData, photo: file});
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#52b788] file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#52b788]/90"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                বাতিল
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#52b788] text-white rounded hover:bg-[#52b788]/90"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 mt-16 space-y-6 w-5/6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">সকল পরীক্ষার্থী</h1>
        <p className="text-gray-500">আপনার সকল পরীক্ষার্থীর তালিকা এখানে রয়েছে</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Marhala Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdFilterList className="inline-block mr-1 text-[#52b788]" />
              মারহালা
            </label>
            <select 
              value={selectedMarhala}
              onChange={(e) => setSelectedMarhala(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">সকল মারহালা</option>
              {uniqueMarhala.map(marhala => (
                <option key={marhala} value={marhala}>{marhala}</option>
              ))}
            </select>
          </div>

          {/* Exam Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdFilterList className="inline-block mr-1 text-[#52b788]" />
              পরীক্ষা নির্ধারণ
            </label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">সকল পরীক্ষা</option>
              {examOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Examinee Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdFilterList className="inline-block mr-1 text-[#52b788]" />
              পরীক্ষার্থীর ধরণ
            </label>
            <select 
              value={selectedExamineeType}
              onChange={(e) => setSelectedExamineeType(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">সকল ধরণ</option>
              {examineeTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdSearch className="inline-block mr-1 text-[#52b788]" />
              পরীক্ষার্থীর নাম / জাতীয় পরিচয়পত্র
            </label>
            <input 
              type="text"
              placeholder="পরীক্ষার্থী খুঁজুন"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm pr-8"
            />
            <MdSearch className="absolute right-2 top-8 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-[#52B788] text-white rounded-t-lg">
            <TableRow>
              <TableHead className="p-4">ছবি</TableHead>
              <TableHead className="p-4">নাম</TableHead>
              <TableHead className="p-4">রেজিস্ট্রেশন নাম্বার</TableHead>
              <TableHead className="p-4">মারহালা</TableHead>
              <TableHead className="p-4">মাদরাসা</TableHead>
              <TableHead className="p-4">জাতীয় পরিচয় পত্র</TableHead>
              <TableHead className="p-4 ">ক্রিয়া</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExaminees.map((examinee) => (
              <TableRow key={examinee.id}>
                <TableCell className="p-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image 
                      src={examinee.photo} 
                      alt={examinee.name} 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="p-4">{examinee.name}</TableCell>
                <TableCell className="p-4">{examinee.registrationNumber}</TableCell>
                <TableCell className="p-4">{examinee.marhala}</TableCell>
                <TableCell className="p-4">{examinee.madrasah}</TableCell>
                <TableCell className="p-4">{examinee.nationalId}</TableCell>
                <TableCell className="p-4 text-right">
                  <div className="flex  items-center space-x-8">
                    <div className="flex items-center space-x-1 group">
                      <span 
                        className="text-sm text-blue-600 cursor-pointer mr-1 group-hover:underline group-hover:text-blue-800 transition-colors duration-200" 
                        onClick={() => handleEditClick(examinee)}
                      >
                        সম্পাদনা করুন
                      </span>
                      <Edit2 
                        className="h-4 w-4 text-blue-500 group-hover:text-blue-700 cursor-pointer transition-colors duration-200" 
                        onClick={() => handleEditClick(examinee)}
                      />
                    </div>
                    <div className="flex items-center space-x-1 group">
                      <span 
                        className="text-sm text-red-600 cursor-pointer mr-1 group-hover:underline group-hover:text-red-800 transition-colors duration-200" 
                        onClick={() => handleDeleteConfirmation(examinee)}
                      >
                        মুছে ফেলুন
                      </span>
                      <Trash2 
                        className="h-4 w-4 text-red-500 group-hover:text-red-700 cursor-pointer transition-colors duration-200" 
                        onClick={() => handleDeleteConfirmation(examinee)}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {paginatedExaminees.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            কোনো পরীক্ষার্থী পাওয়া যায়নি
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          মোট পরীক্ষার্থী: {filteredExaminees.length}
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

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              আপনি কি নিশ্চিত?
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              {`${examineeToDelete.name} এর তথ্য permanently মুছে ফেলা হবে। এই ক্রিয়াটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।`}
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                বাতিল
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {renderEditModal()}
      <Toaster />
    </div>
  );
}
