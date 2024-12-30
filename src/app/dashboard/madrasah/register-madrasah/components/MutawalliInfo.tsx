'use client';

import React from 'react';


interface MutawalliInfoProps {
  formData: {
    mutawalliName: string;
    mutawalliDesignation: string;
    mutawalliNID: string;
    mutawalliMobile: string;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}


// mutawalli designations
const mutawalliDesignations = ["সভাপতি", "মুতাওয়াল্লি", "সেক্রেটারি"];

/**
 * MutawalliInfo Component
 * Handles the mutawalli information section of the madrasah registration form
 * Including mutawalli details
 */
const MutawalliInfo: React.FC<MutawalliInfoProps> = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-8">

      {/* mutawalli Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">সভাপতি/মুতাওয়াল্লির তথ্য</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">নাম</label>
            <input
              type="text"
              placeholder="সভাপতি/মুতাওয়াল্লির নাম লিখুন"
              value={formData.mutawalliName}
              onChange={(e) => handleChange('mutawalliName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

                          {/* currier options  */}
        <div>
          <label className="block text-sm font-medium text-gray-700">পদবী</label>
          <select
            value={formData?.mutawalliDesignation}
            onChange={(e) => handleChange('mutawalliDesignation', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            {mutawalliDesignations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">জাতীয় পরিচয়পত্র নম্বর</label>
            <input
              type="text"
              placeholder="জাতীয় পরিচয়পত্র নম্বর লিখুন"
              value={formData.mutawalliNID}
              onChange={(e) => handleChange('mutawalliNID', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.mutawalliMobile}
              onChange={(e) => handleChange('mutawalliMobile', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default MutawalliInfo;
