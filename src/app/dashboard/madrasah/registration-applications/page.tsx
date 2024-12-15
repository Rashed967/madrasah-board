'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { MdCheck, MdClose, MdInfo } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

// Simplified dummy data for madrasah registration applications
const madrasahRegistrationApplications = [
  {
    id: 1,
    nameInBangla: 'নূরুল ইসলাম মাদরাসা',
    location: {
      division: 'খুলনা',
      district: 'বাগেরহাট',
      thana: 'বাগেরহাট সদর',
      village: 'চরপাড়া'
    },
    type: 'বালক',
    highestClass: '৮ম',
    muhtamimName: 'মাওলানা আব্দুল হামিদ',
    muhtamimNID: '১৯৮৫৬৭৮৯০১২',
    mobile: '০১৭৫৫৬৬৭৭৮৮',
    email: 'contact@nurulislam.edu.bd',
    logoUrl: '/nurul-islam-reg.webp'
  },
  {
    id: 2,
    nameInBangla: 'দারুল আরকাম মাদরাসা',
    location: {
      division: 'রাজশাহী',
      district: 'রাজশাহী',
      thana: 'রাজশাহী সদর',
      village: 'কাশিয়াবাদ'
    },
    type: 'বালিকা',
    highestClass: '১০ম',
    muhtamimName: 'মাওলানা মোহাম্মদ আলী',
    muhtamimNID: '১৯৮৫৬৭৮৯০১৩',
    mobile: '০১৭৫৫৬৬৭৭৮৯',
    email: 'contact@darularkam.edu.bd',
    logoUrl: '/darul-arkam-reg.webp'
  },
  {
    id: 3,
    nameInBangla: 'হিদায়া ইসলামিয়া মাদরাসা',
    location: {
      division: 'সিলেট',
      district: 'সিলেট',
      thana: 'সিলেট সদর',
      village: 'পশ্চিম গোয়াইনঘাট'
    },
    type: 'উভয়',
    highestClass: 'দাখিল',
    muhtamimName: 'মাওলানা আবুল কালাম',
    muhtamimNID: '১৯৮৫৬৭৮৯০১৪',
    mobile: '০১৭৫৫৬৬৭৭৯০',
    email: 'contact@hidaya.edu.bd',
    logoUrl: '/hidaya-reg.webp'
  }
];

export default function MadrasahRegistrationApplications() {
  const [applications, setApplications] = useState(madrasahRegistrationApplications);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const applicationsPerPage = 5;

  // Pagination Logic
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * applicationsPerPage;
    return applications.slice(startIndex, startIndex + applicationsPerPage);
  }, [applications, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(applications.length / applicationsPerPage), 
    [applications]
  );

  // Approve and Reject Handlers
  const handleApproveApplication = (application) => {
    const updatedApplications = applications.filter(app => app.id !== application.id);
    setApplications(updatedApplications);
    toast.success(`${application.nameInBangla} মাদরাসা সফলভাবে অনুমোদিত হয়েছে`);
  };

  const handleRejectApplication = (application) => {
    const updatedApplications = applications.filter(app => app.id !== application.id);
    setApplications(updatedApplications);
    toast.error(`${application.nameInBangla} মাদরাসা বাতিল করা হয়েছে`);
  };

  // Pagination Handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="p-8 mt-12 mx-6">
      <h1 className="text-2xl font-bold mb-8">মাদরাসা নিবন্ধন আবেদন</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#52b788] text-white">
            <tr>
              <th className="px-4 py-3 text-left">মাদরাসার নাম</th>
              <th className="px-4 py-3 text-left">ঠিকানা</th>
              <th className="px-4 py-3 text-left">মাদরাসার ধরণ</th>
              <th className="px-4 py-3 text-left">সর্বোচ্চ শ্রেণী</th>
              <th className="px-4 py-3 text-left">মুহতামিমের নাম</th>
              <th className="px-4 py-3 text-left">ক্রিয়াকলাপ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplications.map((application) => (
              <tr key={application.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 flex items-center space-x-3">
                  <div className="w-12 h-12 relative">
                    <Image 
                      src={application.logoUrl} 
                      alt={`${application.nameInBangla} লোগো`} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <span className="font-semibold">{application.nameInBangla}</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {application.location.division}, {application.location.district}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{application.type}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{application.highestClass}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{application.muhtamimName}</td>
                <td className="px-4 py-4 text-sm text-gray-600 flex space-x-4">
                  <button 
                    className="text-blue-400 hover:underline hover:text-blue-500 transition-colors duration-200 flex items-center space-x-1 group"
                    onClick={() => setSelectedApplication(application)}
                    title="বিস্তারিত তথ্য"
                  >
                    <MdInfo className="text-lg group-hover:text-blue-300" />
                    <span className="text-base">বিস্তারিত</span>
                  </button>
                  <button 
                    className="text-[#52b788] hover:underline hover:text-[#52b788]/90 transition-colors duration-200 flex items-center space-x-1 group"
                    onClick={() => handleApproveApplication(application)}
                    title="অনুমোদন করুন"
                  >
                    <MdCheck className="text-lg group-hover:text-[#52b788]/90" />
                    <span className="text-base">অনুমোদন</span>
                  </button>
                  <button 
                    className="text-red-600 hover:underline hover:text-red-800 transition-colors duration-200 flex items-center space-x-1 group"
                    onClick={() => handleRejectApplication(application)}
                    title="বাতিল করুন"
                  >
                    <MdClose className="text-lg group-hover:text-red-800" />
                    <span className="text-base">বাতিল</span>
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
          মোট আবেদন: {applications.length}
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

      {/* Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#52b788] text-white p-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-lg font-bold">{selectedApplication.nameInBangla} - বিস্তারিত তথ্য</h2>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="text-white hover:bg-[#52b788]/90 p-2 rounded-full"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Logo and Basic Info */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <div className="w-20 h-20 relative">
                  <Image 
                    src={selectedApplication.logoUrl} 
                    alt={`${selectedApplication.nameInBangla} লোগো`} 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplication.nameInBangla}</h3>
                  <p className="text-sm text-gray-600">{selectedApplication.email}</p>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">ঠিকানা</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">বিভাগ</p>
                    <p className="text-gray-800">{selectedApplication.location.division}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">জেলা</p>
                    <p className="text-gray-800">{selectedApplication.location.district}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">থানা</p>
                    <p className="text-gray-800">{selectedApplication.location.thana}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">গ্রাম</p>
                    <p className="text-gray-800">{selectedApplication.location.village}</p>
                  </div>
                </div>
              </div>

              {/* Madrasah Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">মাদরাসার তথ্য</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">মাদরাসার ধরণ</p>
                    <p className="text-gray-800">{selectedApplication.type}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">সর্বোচ্চ শ্রেণী</p>
                    <p className="text-gray-800">{selectedApplication.highestClass}</p>
                  </div>
                </div>
              </div>

              {/* Muhtamim Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">মুহতামিমের তথ্য</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">নাম</p>
                    <p className="text-gray-800">{selectedApplication.muhtamimName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">জাতীয় পরিচয়পত্র</p>
                    <p className="text-gray-800">{selectedApplication.muhtamimNID}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-3">যোগাযোগ তথ্য</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">মোবাইল নম্বর</p>
                    <p className="text-gray-800">{selectedApplication.mobile}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">ইমেইল</p>
                    <p className="text-gray-800">{selectedApplication.email}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 pt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  বন্ধ করুন
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
