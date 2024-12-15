'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MdEdit, MdDelete, MdSearch, MdFilterList } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

// Dummy data - in a real application, this would come from an API
const dummyMadrasahs = [
  {
    id: 1,
    logoUrl: '/madrasah-logo-1.png', // Placeholder logo
    nameInBangla: 'দারুল উলূম মাদরাসা',
    address: 'নাসিরাবাদ, ফুলবাড়িয়া, ময়মনসিংহ',
    type: 'দাখিল',
    email: 'info@darululoom.edu.bd',
    mobile: '০১৭১২৩৪৫৬৭৮',
    location: {
      division: 'ঢাকা',
      district: 'ময়মনসিংহ',
      thana: 'ফুলবাড়িয়া',
      village: 'নাসিরাবাদ'
    },
    holdingNumber: '১২৩',
    highestClass: '১০ম',
    totalStudents: '১০০০',
    totalStaff: '৫০',
    communicatorName: 'মোঃ আবু সাঈদ',
    communicatorMobile: '০১৭১২৩৪৫৬৭৮',
    muhtamimName: 'মোঃ আবু সাঈদ',
    muhtamimNID: '১৯৮৫১২৩৪৫৬৭৮'
  },
  {
    id: 2,
    logoUrl: '/iqra-bangladesh.webp', // Placeholder logo
    nameInBangla: 'আল-আমিন মাদরাসা',
    address: 'পাইকপাড়া, গাজীপুর, ঢাকা',
    type: 'আলিম',
    email: 'contact@alameen.edu.bd',
    mobile: '০১৮১২৩৪৫৬৭৮',
    location: {
      division: 'ঢাকা',
      district: 'গাজীপুর',
      thana: 'গাজীপুর সদর',
      village: 'পাইকপাড়া'
    },
    holdingNumber: '১২৩',
    highestClass: '১০ম',
    totalStudents: '১০০০',
    totalStaff: '৫০',
    communicatorName: 'মোঃ আবু সাঈদ',
    communicatorMobile: '০১৭১২৩৪৫৬৭৮',
    muhtamimName: 'মোঃ আবু সাঈদ',
    muhtamimNID: '১৯৮৫১২৩৪৫৬৭৮'
  },
  {
    id: 3,
    logoUrl: '/nurul-islam.webp', // Placeholder logo
    nameInBangla: 'নুরুল ইসলাম মাদরাসা',
    address: 'চৌমুহনী, নোয়াখালী',
    type: 'ফাজিল',
    email: 'info@nurulislam.edu.bd',
    mobile: '০১৮৮৭৬৫৪৩২১',
    location: {
      division: 'চট্টগ্রাম',
      district: 'নোয়াখালী',
      thana: 'সোনাইমুড়ী',
      village: 'চৌমুহনী'
    },
    holdingNumber: '৪৫৬',
    highestClass: '১২শ',
    totalStudents: '৮৫০',
    totalStaff: '৪০',
    communicatorName: 'মোঃ রফিকুল ইসলাম',
    communicatorMobile: '০১৭৯৮৭৬৫৪৩২১',
    muhtamimName: 'মোঃ জাফর ইকবাল',
    muhtamimNID: '১৯৮০৯৮৭৬৫৪৩২১'
  },
  {
    id: 4,
    logoUrl: '/rahmania.webp', // Placeholder logo
    nameInBangla: 'রহমানিয়া দারুল উলুম মাদরাসা',
    address: 'ফুলবাড়িয়া, ময়মনসিংহ',
    type: 'কামিল',
    email: 'admin@rahmania.edu.bd',
    mobile: '০১৮৫৪৩২১০৯৮',
    location: {
      division: 'ময়মনসিংহ',
      district: 'ময়মনসিংহ',
      thana: 'ফুলবাড়িয়া',
      village: 'শতখিলা'
    },
    holdingNumber: '৭৮৯',
    highestClass: 'মাস্টার্স',
    totalStudents: '১২০০',
    totalStaff: '৬৫',
    communicatorName: 'মাওলানা শামসুল হক',
    communicatorMobile: '০১৭১১১২২৩৩৪৪',
    muhtamimName: 'মাওলানা কাসেম আলী',
    muhtamimNID: '১৯৭৬৫৪৩২১০৯৮'
  },
  {
    id: 5,
    logoUrl: '/darul-falah.webp', // Placeholder logo
    nameInBangla: 'দারুল ফালাহ ইসলামিক একাডেমি',
    address: 'খুলশী, চট্টগ্রাম',
    type: 'দাখিল',
    email: 'info@darulfalah.edu.bd',
    mobile: '০১৮৯৮৭৬৫৪৩২১',
    location: {
      division: 'চট্টগ্রাম',
      district: 'চট্টগ্রাম',
      thana: 'খুলশী',
      village: 'পাহাড়তলী'
    },
    holdingNumber: '৯৮৭',
    highestClass: '৮ম',
    totalStudents: '৬০০',
    totalStaff: '২৫',
    communicatorName: 'মাওলানা আব্দুল হাই',
    communicatorMobile: '০১৭২২৩৩৪৪৫৫৬',
    muhtamimName: 'মাওলানা আব্দুল হাই',
    muhtamimNID: '১৯৭৯৮৭৬৫৪৩২১'
  },
  {
    id: 6,
    logoUrl: '/hidaya.webp', // Placeholder logo
    nameInBangla: 'জামিয়া হিদায়া ইসলামিয়া',
    address: 'বড়বাজার, সিলেট',
    type: 'মক্তব',
    email: 'contact@hidaya.edu.bd',
    mobile: '০১৬১২৩৪৫৬৭৮৯',
    location: {
      division: 'সিলেট',
      district: 'সিলেট',
      thana: 'কোতোয়ালি',
      village: 'দক্ষিণ সুরমা'
    },
    holdingNumber: '৬৫৪',
    highestClass: '৫ম',
    totalStudents: '৪৫০',
    totalStaff: '২০',
    communicatorName: 'মাওলানা আব্দুল মতিন',
    communicatorMobile: '০১৭৪৪৫৫৬৬৭৭৮',
    muhtamimName: 'মাওলানা আব্দুল মতিন',
    muhtamimNID: '১৯৮৭৬৫৪৩২১০৯'
  },
  {
    id: 7,
    logoUrl: '/ashraful-uloom.webp', // Placeholder logo
    nameInBangla: 'আশরাফুল উলুম মাদরাসা',
    address: 'শিবগঞ্জ, বগুড়া',
    type: 'আলিম',
    email: 'contact@ashrafululoom.edu.bd',
    mobile: '০১৬৭৮৯০১২৩৪',
    location: {
      division: 'রাজশাহী',
      district: 'বগুড়া',
      thana: 'শিবগঞ্জ',
      village: 'হরিপুর'
    },
    holdingNumber: '৪৩২',
    highestClass: '১০ম',
    totalStudents: '৯০০',
    totalStaff: '৪৫',
    communicatorName: 'মাওলানা রাশেদুল হাসান',
    communicatorMobile: '০১৭৮৯০১২৩৪৫৬',
    muhtamimName: 'মাওলানা আব্দুল আজিজ',
    muhtamimNID: '১৯৮২৭৬৫৪৩২১০'
  },
  {
    id: 8,
    logoUrl: '/jamia-siddiquia.webp', // Placeholder logo
    nameInBangla: 'জামিয়া সিদ্দিকিয়া মাদরাসা',
    address: 'শাহবাগ, ঢাকা',
    type: 'কামিল',
    email: 'info@jamiasiddiquia.edu.bd',
    mobile: '০১৭৬৫৪৩২১০৯৮',
    location: {
      division: 'ঢাকা',
      district: 'ঢাকা',
      thana: 'শাহবাগ',
      village: 'ময়লাপোতা'
    },
    holdingNumber: '৭৬৫',
    highestClass: 'মাস্টার্স',
    totalStudents: '১১০০',
    totalStaff: '৬০',
    communicatorName: 'মাওলানা মুজাহিদুল ইসলাম',
    communicatorMobile: '০১৬৫৪৩২১০৯৮৭',
    muhtamimName: 'মাওলানা মুজাহিদুল ইসলাম',
    muhtamimNID: '১৯৮০৯৮৭৬৫৪৩২'
  },
  {
    id: 9,
    logoUrl: '/darul-huda.webp', // Placeholder logo
    nameInBangla: 'দারুল হুদা ইসলামিক মাদরাসা',
    address: 'পীরগঞ্জ, ঠাকুরগাঁও',
    type: 'দাখিল',
    email: 'admin@darulhuda.edu.bd',
    mobile: '০১৭২২৩৩৪৪৫৬৭',
    location: {
      division: 'রংপুর',
      district: 'ঠাকুরগাঁও',
      thana: 'পীরগঞ্জ',
      village: 'বিরল'
    },
    holdingNumber: '৯৮৭',
    highestClass: '৮ম',
    totalStudents: '৫৫০',
    totalStaff: '২২',
    communicatorName: 'মাওলানা আবু তাহের',
    communicatorMobile: '০১৭৮৭৬৫৪৩২১০',
    muhtamimName: 'মাওলানা আবু তাহের',
    muhtamimNID: '১৯৭৮৬৫৪৩২১০৯'
  },
  {
    id: 10,
    logoUrl: '/iqra-bangladesh.webp', // Placeholder logo
    nameInBangla: 'আল-আমিন মাদরাসা',
    address: 'পাইকপাড়া, গাজীপুর, ঢাকা',
    type: 'আলিম',
    email: 'contact@alameen.edu.bd',
    mobile: '০১৮১২৩৪৫৬৭৮',
    location: {
      division: 'ঢাকা',
      district: 'গাজীপুর',
      thana: 'গাজীপুর সদর',
      village: 'পাইকপাড়া'
    },
    holdingNumber: '১২৩',
    highestClass: '১০ম',
    totalStudents: '১০০০',
    totalStaff: '৪৫',
    communicatorName: 'মাওলানা আবু তাহের',
    communicatorMobile: '০১৭৮৭৬৫৪৩২১০',
    muhtamimName: 'মাওলানা আবু তাহের',
    muhtamimNID: '১৯৭৮৬৫৪৩২১০৯'
  },
  
  {
    id: 11,
    logoUrl: '/iqra-bangladesh.webp', // Placeholder logo
    nameInBangla: 'আল-আমিন মাদরাসা',
    address: 'পাইকপাড়া, গাজীপুর, ঢাকা',
    type: 'আলিম',
    email: 'contact@alameen.edu.bd',
    mobile: '০১৮১২৩৪৫৬৭৮',
    location: {
      division: 'ঢাকা',
      district: 'গাজীপুর',
      thana: 'গাজীপুর সদর',
      village: 'পাইকপাড়া'
    },
    holdingNumber: '১২৩',
    highestClass: '১০ম',
    totalStudents: '১০০০',
    totalStaff: '৪৫',
    communicatorName: 'মাওলানা আবু তাহের',
    communicatorMobile: '০১৭৮৭৬৫৪৩২১০',
    muhtamimName: 'মাওলানা আবু তাহের',
    muhtamimNID: '১৯৭৮৬৫৪৩২১০৯'
  }
  
  
  
  
  
  
  
  // Add more dummy madrasahs as needed
];

export default function AllMadrasahPage() {
  const [madrasahs, setMadrasahs] = useState(dummyMadrasahs);
  const [selectedMadrasah, setSelectedMadrasah] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [madrasahToDelete, setMadrasahToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of madrasahs per page

  // Filter States
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Unique Divisions and Types
  const divisions = useMemo(() => 
    [...new Set(dummyMadrasahs.map(m => m.location.division))], 
    [dummyMadrasahs]
  );

  const types = useMemo(() => 
    [...new Set(dummyMadrasahs.map(m => m.type))], 
    [dummyMadrasahs]
  );

  // Districts based on selected division
  const districts = useMemo(() => {
    if (!selectedDivision) {
      // If no division selected, return all unique districts
      return [...new Set(dummyMadrasahs.map(m => m.location.district))];
    }
    // If a division is selected, return districts for that division
    return [...new Set(
      dummyMadrasahs
        .filter(m => m.location.division === selectedDivision)
        .map(m => m.location.district)
    )];
  }, [selectedDivision, dummyMadrasahs]);

  // Filtered Madrasahs
  const filteredMadrasahs = useMemo(() => {
    return madrasahs.filter(madrasah => {
      const matchesDivision = !selectedDivision || 
        madrasah.location.division === selectedDivision;
      
      const matchesDistrict = !selectedDistrict || 
        (selectedDivision && districts.includes(madrasah.location.district)) || 
        madrasah.location.district === selectedDistrict;
      
      const matchesType = !selectedType || 
        madrasah.type === selectedType;
      
      const matchesSearch = !searchQuery || 
        madrasah.nameInBangla.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDivision && matchesDistrict && matchesType && matchesSearch;
    });
  }, [madrasahs, selectedDivision, selectedDistrict, selectedType, searchQuery, districts]);

  // Paginated Madrasahs
  const paginatedMadrasahs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMadrasahs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMadrasahs, currentPage, itemsPerPage]);

  // Total Pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredMadrasahs.length / itemsPerPage), 
    [filteredMadrasahs, itemsPerPage]
  );

  // Pagination Change Handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDivision, selectedDistrict, selectedType, searchQuery]);

  // Delete Madrasah Functionality
  const handleDeleteConfirmation = (madrasah) => {
    setMadrasahToDelete(madrasah);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (madrasahToDelete) {
      const updatedMadrasahs = madrasahs.filter(m => m.id !== madrasahToDelete.id);
      setMadrasahs(updatedMadrasahs);
      setIsDeleteConfirmOpen(false);
      toast.success('মাদরাসা সফলভাবে মোছা হয়েছে');
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setMadrasahToDelete(null);
  };

  // Edit Madrasah Functionality
  const handleEditMadrasah = (madrasah) => {
    setEditFormData({...madrasah});
    setIsEditModalOpen(true);
  };

  const handleEditChange = (section, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const handleUpdateMadrasah = () => {
    // Update logic
    const updatedMadrasahs = madrasahs.map(m => 
      m.id === editFormData.id ? editFormData : m
    );
    
    setMadrasahs(updatedMadrasahs);
    setIsEditModalOpen(false);
    toast.success('মাদরাসা সফলভাবে আপডেট করা হয়েছে');
  };

  return (
    <div className="p-8 mt-12 mx-6">
      <h1 className="text-2xl font-bold mb-8">সকল মাদরাসা</h1>
      
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Division Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdFilterList className="inline-block mr-1 text-[#52b788]" />
              বিভাগ
            </label>
            <select 
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict(''); // Reset district when division changes
              }}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">সকল বিভাগ</option>
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdFilterList className="inline-block mr-1 text-[#52b788]" />
              জেলা
            </label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedDivision}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">সকল জেলা</option>
              {districts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdFilterList className="inline-block mr-1 text-[#52b788]" />
              মাদরাসার ধরণ
            </label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">সকল ধরণ</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MdSearch className="inline-block mr-1 text-[#52b788]" />
              মাদরাসার নাম
            </label>
            <input 
              type="text"
              placeholder="মাদরাসা খুঁজুন"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm pr-8"
            />
            <MdSearch className="absolute right-2 top-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Madrasah List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#52b788] text-white">
            <tr>
              <th className="px-4 py-3 text-left">মাদরাসার লোগো ও নাম</th>
              <th className="px-4 py-3 text-left">ঠিকানা</th>
              <th className="px-4 py-3 text-left">মাদরাসার ধরণ</th>
              <th className="px-4 py-3 text-left">ইমেইল</th>
              <th className="px-4 py-3 text-left">মোবাইল</th>
              <th className="px-4 py-3 text-left">ক্রিয়াকলাপ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMadrasahs.map((madrasah) => (
              <tr key={madrasah.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 flex items-center space-x-3">
                  <div className="w-12 h-12 relative">
                    <Image 
                      src={madrasah.logoUrl} 
                      alt={`${madrasah.nameInBangla} লোগো`} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <span className="font-semibold">{madrasah.nameInBangla}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{madrasah.address}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{madrasah.type}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{madrasah.email}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{madrasah.mobile}</td>
                <td className="px-4 py-4 text-sm text-gray-600 flex space-x-2">
                  <button 
                    className="bg-[#52b788] text-white px-2 py-1 rounded"
                    onClick={() => handleEditMadrasah(madrasah)}
                  >
                    <MdEdit className="text-lg" />
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteConfirmation(madrasah)}
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
          মোট মাদরাসা: {filteredMadrasahs.length} / {madrasahs.length}
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

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">মাদরাসা মুছে ফেলুন</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              আপনি কি নিশ্চিত যে আপনি {madrasahToDelete.nameInBangla} মাদরাসাটি মুছে ফেলতে চান?
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

      {/* Edit Madrasah Modal */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">মাদরাসা সম্পাদনা</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Logo and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">মাদরাসার লোগো</label>
                  <input 
                    type="file" 
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#52b788]/10 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-[#52b788]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">মাদরাসার নাম (বাংলা)</label>
                  <input 
                    type="text" 
                    value={editFormData.nameInBangla}
                    onChange={(e) => handleEditChange('nameInBangla', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">মাদরাসার ধরণ</label>
                  <select 
                    value={editFormData.type}
                    onChange={(e) => handleEditChange('type', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="বালক">বালক</option>
                    <option value="বালিকা">বালিকা</option>
                    <option value="উভয়">উভয়</option>
                  </select>
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">বিভাগ</label>
                  <input 
                    type="text" 
                    value={editFormData.location.division}
                    onChange={(e) => handleEditChange('location', 'division', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">জেলা</label>
                  <input 
                    type="text" 
                    value={editFormData.location.district}
                    onChange={(e) => handleEditChange('location', 'district', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">থানা</label>
                  <input 
                    type="text" 
                    value={editFormData.location.thana}
                    onChange={(e) => handleEditChange('location', 'thana', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">গ্রাম</label>
                  <input 
                    type="text" 
                    value={editFormData.location.village}
                    onChange={(e) => handleEditChange('location', 'village', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">হোল্ডিং নাম্বার</label>
                  <input 
                    type="text" 
                    value={editFormData.holdingNumber}
                    onChange={(e) => handleEditChange('holdingNumber', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">সর্বোচ্চ শ্রেণী</label>
                  <input 
                    type="text" 
                    value={editFormData.highestClass}
                    onChange={(e) => handleEditChange('highestClass', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ইমেইল</label>
                  <input 
                    type="email" 
                    value={editFormData.email}
                    onChange={(e) => handleEditChange('email', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Contact and Staff Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">মোবাইল</label>
                  <input 
                    type="text" 
                    value={editFormData.mobile}
                    onChange={(e) => handleEditChange('mobile', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">মোট শিক্ষার্থী</label>
                  <input 
                    type="text" 
                    value={editFormData.totalStudents}
                    onChange={(e) => handleEditChange('totalStudents', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">মোট শিক্ষক ও স্টাফ</label>
                  <input 
                    type="text" 
                    value={editFormData.totalStaff}
                    onChange={(e) => handleEditChange('totalStaff', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Communicator Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">সার্বিক যোগাযোগকারীর নাম</label>
                  <input 
                    type="text" 
                    value={editFormData.communicatorName}
                    onChange={(e) => handleEditChange('communicatorName', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">সার্বিক যোগাযোগকারীর মোবাইল</label>
                  <input 
                    type="text" 
                    value={editFormData.communicatorMobile}
                    onChange={(e) => handleEditChange('communicatorMobile', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Muhtamim Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">মুহতামিমের নাম</label>
                  <input 
                    type="text" 
                    value={editFormData.muhtamimName}
                    onChange={(e) => handleEditChange('muhtamimName', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">মুহতামিমের এনআইডি নাম্বার</label>
                  <input 
                    type="text" 
                    value={editFormData.muhtamimNID}
                    onChange={(e) => handleEditChange('muhtamimNID', '', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleUpdateMadrasah}
                  className="bg-[#52b788] text-white px-6 py-2 rounded hover:bg-[#52b788]/90"
                >
                  আপডেট করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
