'use client';

import React from 'react';

interface MadrasahBasicInfoProps {
  formData: {
    highestMarhala: string;
    totalStudent: string;
    totalTeacherAndStaff: string;
    madrasahType: string;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

/**
 * MadrasahBasicInfo Component
 * Handles the basic information section of the madrasah registration form
 * Including madrasah names, description, and general statistics
 */
const MadrasahBasicInfo: React.FC<MadrasahBasicInfoProps> = ({ formData, handleChange, errors = {} }) => {
  return (
    <div className="space-y-6">

      {/* General Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">মাদ্রাসার সার্বিক তথ্য</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">সর্বোচ্চ মারহালা</label>
            <select
              value={formData.highestMarhala}
              onChange={(e) => handleChange('highestMarhala', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.highestMarhala ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            >
              <option value="">মারহালা নির্বাচন করুন</option>
              <option value="ইফতা">ইফতা</option>
              <option value="তাকমীল/দাওরায়ে হাদীস">তাকমীল/দাওরায়ে হাদীস</option>
              <option value="ফযীলত (স্নাতক)">ফযীলত (স্নাতক)</option>
              <option value="সানাবিয়্যাহ উলইয়া">সানাবিয়্যাহ উলইয়া</option>
              <option value="কাফিয়া (১০ শ্রেনী)">কাফিয়া (১০ শ্রেনী)</option>
              <option value="মুতাওয়াসসিতাহ (৮ম শ্রেনী)">মুতাওয়াসসিতাহ (৮ম শ্রেনী)</option>
              <option value="ইবতেদাইয়্যাহ (৫ম শ্রেনী)">ইবতেদাইয়্যাহ (৫ম শ্রেনী)</option>
            </select>
            {errors.highestMarhala && (
              <p className="mt-1 text-sm text-red-500">{errors.highestMarhala}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মাদরাসার ধরণ</label>
            <select
              value={formData.madrasahType}
              onChange={(e) => handleChange('madrasahType', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.madrasahType ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            >
              <option value="">মাদরাসার ধরণ নির্বাচন করুন</option>
              <option value="বালক">বালক</option>
              <option value="বালিকা">বালিকা</option>
            </select>
            {errors.madrasahType && (
              <p className="mt-1 text-sm text-red-500">{errors.madrasahType}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">মোট শিক্ষার্থী</label>
            <input
              type="number"
              placeholder="মোট শিক্ষার্থী সংখ্যা লিখুন"
              value={formData.totalStudent}
              onChange={(e) => handleChange('totalStudent', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.totalStudent ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.totalStudent && (
              <p className="mt-1 text-sm text-red-500">{errors.totalStudent}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোট শিক্ষক/শিক্ষিকা</label>
            <input
              type="number"
              placeholder="মোট শিক্ষক/শিক্ষিকা সংখ্যা"
              value={formData.totalTeacherAndStaff}
              onChange={(e) => handleChange('totalTeacherAndStaff', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${errors.totalTeacherAndStaff ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.totalTeacherAndStaff && (
              <p className="mt-1 text-sm text-red-500">{errors.totalTeacherAndStaff}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MadrasahBasicInfo;
