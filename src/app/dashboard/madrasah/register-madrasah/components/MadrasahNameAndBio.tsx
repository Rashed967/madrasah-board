'use client';

import React from 'react';

interface MadrasahNameAndBioProps {
  formData: {
    nameInBangla: string;
    nameInArabic: string;
    nameInEnglish: string;
    description: string;
  };
  handleChange: (field: string, value: string) => void;
}

/**
 * MadrasahNameAndBio Component
 * Handles the basic information section of the madrasah registration form
 * Including madrasah names, description, and general statistics
 */
const MadrasahNameAndBio: React.FC<MadrasahNameAndBioProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      {/* Madrasah Names */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">মাদরাসার নাম</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">বাংলা নাম</label>
            <input
              type="text"
              placeholder="বাংলা নাম লিখুন"
              value={formData.nameInBangla}
              onChange={(e) => handleChange('nameInBangla', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">আরবি নাম</label>
            <input
              type="text"
              placeholder="আরবি নাম লিখুন"
              value={formData.nameInArabic}
              onChange={(e) => handleChange('nameInArabic', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ইংরেজি নাম </label>
            <input
              type="text"
              placeholder="ইংরেজি নাম লিখুন"
              value={formData.nameInEnglish}
              onChange={(e) => handleChange('nameInEnglish', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">বর্ণনা</label>
          <textarea
            rows={4}
            placeholder="মাদরাসার বর্ণনা লিখুন"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
      </div>


    </div>
  );
};

export default MadrasahNameAndBio;
