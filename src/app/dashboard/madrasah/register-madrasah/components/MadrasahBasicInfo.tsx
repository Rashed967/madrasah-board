'use client';


import { madrasahTypes } from '@/data/madrasahTypes';
import marhalaNames from '@/data/marhala.names';
import { IMadrasahInformation } from '@/features/madrasah/interfaces';
import React from 'react';

interface Props {
  formData: {
    madrasah_information: IMadrasahInformation;
  };
  handleChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
}


/**
 * MadrasahBasicInfo Component
 * Handles the basic information section of the madrasah registration form
 * Including madrasah names, description, and general statistics
 */
const MadrasahBasicInfo: React.FC<Props> = ({ formData, handleChange, errors }) => {
  return (
    <div className=" p-6 ">
      <h2 className="text-base text-lg font-semibold mb-4 mt-4">মাদরাসার মৌলিক তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


      <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            সর্বোচ্চ মারহালা <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.madrasah_information.highestMarhala}
            onChange={(e) => handleChange('madrasah_information.highestMarhala', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasah_information.highestMarhala'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm md:text-base  focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">সর্বোচ্চ মারহালা নির্বাচন করুন</option>
            {marhalaNames.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors?.['madrasah_information.highestMarhala'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasah_information.highestMarhala']}</p>
          )}
        </div>

      <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            মাদরাসার ধরণ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.madrasah_information.madrasahType}
            onChange={(e) => handleChange('madrasah_information.madrasahType', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasah_information.madrasahType'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">মাদরাসার ধরণ নির্বাচন করুন</option>
            {madrasahTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors?.['madrasah_information.madrasahType'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasah_information.madrasahType']}</p>
          )}
        </div>



        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            মোট শিক্ষার্থী <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.madrasah_information.totalStudents}
            onChange={(e) => handleChange('madrasah_information.totalStudents', parseInt(e.target.value) || 0)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasah_information.totalStudents'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="মোট শিক্ষার্থীর সংখ্যা"
          />
          {errors?.['madrasah_information.totalStudents'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasah_information.totalStudents']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            মোট শিক্ষক ও কর্মচারী <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.madrasah_information.totalTeacherAndStuff}
            onChange={(e) => handleChange('madrasah_information.totalTeacherAndStuff', parseInt(e.target.value) || 0)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasah_information.totalTeacherAndStuff'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="মোট শিক্ষক ও কর্মচারীর সংখ্যা"
          />
          {errors?.['madrasah_information.totalTeacherAndStuff'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasah_information.totalTeacherAndStuff']}</p>
          )}
        </div>


      </div>
    </div>
  );
};

export default MadrasahBasicInfo;
