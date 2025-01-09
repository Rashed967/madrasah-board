'use client';

import { IMadrasahNames } from '@/features/madrasah/interfaces';
import React from 'react';

interface Props {
  formData: {
    madrasahNames: IMadrasahNames;
    description: string;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

/**
 * MadrasahNameAndBio Component
 * Handles the basic information section of the madrasah registration form
 * Including madrasah names, description, and general statistics
 */
export default function MadrasahNameAndBio({ formData, handleChange, errors }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6">মাদরাসার নাম ও পরিচিতি</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            মাদরাসার নাম (বাংলা) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.madrasahNames.bengaliName}
            onChange={(e) => handleChange('madrasahNames.bengaliName', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasahNames.bengaliName'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="বাংলায় মাদরাসার নাম"
          />
          {errors?.['madrasahNames.bengaliName'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasahNames.bengaliName']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            মাদরাসার নাম (আরবি) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.madrasahNames.arabicName}
            onChange={(e) => handleChange('madrasahNames.arabicName', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasahNames.arabicName'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-right text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="اسم المدرسة بالعربية"
          />
          {errors?.['madrasahNames.arabicName'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasahNames.arabicName']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            মাদরাসার নাম (ইংরেজি) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.madrasahNames.englishName}
            onChange={(e) => handleChange('madrasahNames.englishName', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['madrasahNames.englishName'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="ইংরেজিতে মাদরাসার নাম"
          />
          {errors?.['madrasahNames.englishName'] && (
            <p className="text-red-500 text-xs italic">{errors['madrasahNames.englishName']}</p>
          )}
        </div>

      </div>
      <div className="col-span-3 mt-4">
        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
          মাদরাসার সংক্ষিপ্ত পরিচিতি <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`mt-1 block w-full rounded-md border h-32 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          placeholder="মাদরাসার সংক্ষিপ্ত পরিচিতি লিখুন"
        />
        {errors?.['description'] && (
          <p className="text-red-500 text-xs italic">{errors['description']}</p>
        )}
      </div>
    </div>
  );
}
