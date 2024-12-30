'use client';

import React from 'react';


interface MuhtamimInfoProps {
  formData: {
    muhtamimName: string;
    muhtamimNID: string;
    muhtamimMobile: string;
    muhtamimEducation: string;
  };
  handleChange: (field: string, value: string | File | null) => void;
  errors?: Record<string, string>;
}

/**
 * StaffInfoForm Component
 * Handles the staff information section of the madrasah registration form
 * Including Muhtamim, Shikkha Socheeb, and Shovapoti details
 */
const MuhtamimInfo: React.FC<MuhtamimInfoProps> = ({ formData, handleChange, errors = {} }) => {
  return (
    <div className="space-y-8">
      {/* Muhtamim Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">মুহতামিমের তথ্য</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">নাম</label>
            <input
              type="text"
              placeholder="মুহতামিমের নাম লিখুন"
              value={formData.muhtamimName}
              onChange={(e) => handleChange('muhtamimName', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.muhtamimName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.muhtamimName && (
              <p className="mt-1 text-sm text-red-500">{errors.muhtamimName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">জাতীয় পরিচয়পত্র নম্বর</label>
            <input
              type="text"
              placeholder="জাতীয় পরিচয়পত্র নম্বর লিখুন"
              value={formData.muhtamimNID}
              onChange={(e) => handleChange('muhtamimNID', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.muhtamimNID ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.muhtamimNID && (
              <p className="mt-1 text-sm text-red-500">{errors.muhtamimNID}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.muhtamimMobile}
              onChange={(e) => handleChange('muhtamimMobile', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.muhtamimMobile ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.muhtamimMobile && (
              <p className="mt-1 text-sm text-red-500">{errors.muhtamimMobile}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">শিক্ষাগত যোগ্যতা</label>
            <input
              type="text"
              placeholder="শিক্ষাগত যোগ্যতা লিখুন"
              value={formData.muhtamimEducation}
              onChange={(e) => handleChange('muhtamimEducation', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.muhtamimEducation ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.muhtamimEducation && (
              <p className="mt-1 text-sm text-red-500">{errors.muhtamimEducation}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuhtamimInfo;
