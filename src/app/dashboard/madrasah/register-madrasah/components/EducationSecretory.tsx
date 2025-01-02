'use client';

import { IEducationalSecretary } from '@/features/madrasah/interfaces';
import React from 'react';


interface EducationSecretoryProps {
  formData: {
    educational_secretory: Pick<IEducationalSecretary, 'name' | 'contactNo' | 'nidNumber' | 'highestEducationalQualification'>;
  };
  handleChange: (field: string, value: string | null) => void;
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
        <h2 className="text-xl font-semibold text-gray-900 mt-2">শিক্ষা সচিবের তথ্য</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">নাম</label>
            <input
              type="text"
              placeholder="শিক্ষা সচিবের নাম লিখুন"
              value={formData.educational_secretory.name}
              onChange={(e) => handleChange('educational_secretory.name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">জাতীয় পরিচয়পত্র নম্বর</label>
            <input
              type="text"
              placeholder="জাতীয় পরিচয়পত্র নম্বর লিখুন"
              value={formData.educational_secretory.nidNumber}
              onChange={(e) => handleChange('educational_secretory.nidNumber', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.educational_secretory.contactNo}
              onChange={(e) => handleChange('educational_secretory.contactNo', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">শিক্ষাগত যোগ্যতা</label>
            <input
              type="text"
              placeholder="শিক্ষাগত যোগ্যতা লিখুন"
              value={formData.educational_secretory.highestEducationalQualification}
              onChange={(e) => handleChange('educational_secretory.highestEducationalQualification', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default EducationSecretory;
