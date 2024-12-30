'use client';

import React from 'react';


interface EducationSecretoryProps {
  formData: {
    shikkhaSocheebName: string;
    shikkhaSocheebNID: string;
    shikkhaSocheebMobile: string;
    shikkhaSocheebEducation: string;
  };
  handleChange: (field: string, value: string | File | null) => void;
  errors?: Record<string, string>;
}

/**
 * StaffInfoForm Component
 * Handles the staff information section of the madrasah registration form
 * Including Muhtamim, Shikkha Socheeb, and Shovapoti details
 */
const EducationSecretory: React.FC<EducationSecretoryProps> = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-8">


      {/* Shikkha Socheeb Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">শিক্ষা সচিবের তথ্য</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">নাম</label>
            <input
              type="text"
              placeholder="শিক্ষা সচিবের নাম লিখুন"
              value={formData.shikkhaSocheebName}
              onChange={(e) => handleChange('shikkhaSocheebName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">জাতীয় পরিচয়পত্র নম্বর</label>
            <input
              type="text"
              placeholder="জাতীয় পরিচয়পত্র নম্বর লিখুন"
              value={formData.shikkhaSocheebNID}
              onChange={(e) => handleChange('shikkhaSocheebNID', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.shikkhaSocheebMobile}
              onChange={(e) => handleChange('shikkhaSocheebMobile', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">শিক্ষাগত যোগ্যতা</label>
            <input
              type="text"
              placeholder="শিক্ষাগত যোগ্যতা লিখুন"
              value={formData.shikkhaSocheebEducation}
              onChange={(e) => handleChange('shikkhaSocheebEducation', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default EducationSecretory;
