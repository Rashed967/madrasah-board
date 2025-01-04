'use client';

import { IEducationalSecretary } from '@/features/madrasah/interfaces';
import React from 'react';

/**
 * EducationSecretoryProps interface
 * Defines the props for the EducationSecretory component
 */
interface EducationSecretoryProps {
  formData: {
    educational_secretory: Pick<IEducationalSecretary, 'name' | 'contactNo' | 'nidNumber' | 'highestEducationalQualification'>;
  };
  handleChange: (field: string, value: string | null) => void;
  errors?: Record<string, string>;
}

/**
 * EducationSecretory Component
 * Handles the education secretary information section of the madrasah registration form
 */
const EducationSecretory: React.FC<EducationSecretoryProps> = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-8">


      {/* Shikkha Socheeb Information */}
      <div className="p-6 space-y-4">
        <div><h2 className="text-base text-lg  font-semibold ">শিক্ষা সচিবের তথ্য</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">নাম</label>
            <input
              type="text"
              placeholder="শিক্ষা সচিবের নাম লিখুন"
              value={formData.educational_secretory.name}
              onChange={(e) => handleChange('educational_secretory.name', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors?.['educational_secretory.name'] ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors?.['educational_secretory.name'] && (
              <p className="text-red-500 text-xs italic">{errors['educational_secretory.name']}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">জাতীয় পরিচয়পত্র নম্বর</label>
            <input
              type="text"
              placeholder="জাতীয় পরিচয়পত্র নম্বর লিখুন"
              value={formData.educational_secretory.nidNumber}
              onChange={(e) => handleChange('educational_secretory.nidNumber', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors?.['educational_secretory.nidNumber'] ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors?.['educational_secretory.nidNumber'] && (
              <p className="text-red-500 text-xs italic">{errors['educational_secretory.nidNumber']}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.educational_secretory.contactNo}
              onChange={(e) => handleChange('educational_secretory.contactNo', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors?.['educational_secretory.contactNo'] ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors?.['educational_secretory.contactNo'] && (
              <p className="text-red-500 text-xs italic">{errors['educational_secretory.contactNo']}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">শিক্ষাগত যোগ্যতা</label>
            <input
              type="text"
              placeholder="শিক্ষাগত যোগ্যতা লিখুন"
              value={formData.educational_secretory.highestEducationalQualification}
              onChange={(e) => handleChange('educational_secretory.highestEducationalQualification', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors?.['educational_secretory.highestEducationalQualification'] ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors?.['educational_secretory.highestEducationalQualification'] && (
              <p className="text-red-500 text-xs italic">{errors['educational_secretory.highestEducationalQualification']}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSecretory;
