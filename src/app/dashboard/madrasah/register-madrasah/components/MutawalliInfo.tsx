'use client';

import { IMutawalli } from '@/features/madrasah/interfaces';
import React from 'react';



interface MutawalliInfoProps {
  formData: {
    chairman_mutawalli: IMutawalli;
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
    <div className="">

      {/* mutawalli Information */}
      <div className="p-6 space-y-4">
        <div>
        <h2 className="text-lg font-semibold text-gray-900">সভাপতি/মুতাওয়াল্লির তথ্য</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">নাম</label>
            <input
              type="text"
              placeholder="সভাপতি/মুতাওয়াল্লির নাম লিখুন"
              value={formData.chairman_mutawalli.name}
              onChange={(e) => handleChange('chairman_mutawalli.name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

                          {/* currier options  */}
        <div>
          <label className="block text-sm font-medium text-gray-700">পদবী</label>
          <select
            value={formData?.chairman_mutawalli?.designation}
            onChange={(e) => handleChange('chairman_mutawalli.designation', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option key="default" value="">পদবী নির্বাচন করুন</option>
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
              value={formData.chairman_mutawalli.nidNumber}
              onChange={(e) => handleChange('chairman_mutawalli.nidNumber', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.chairman_mutawalli.contactNo}
              onChange={(e) => handleChange('chairman_mutawalli.contactNo', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default MutawalliInfo;
