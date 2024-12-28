'use client';

import React from 'react';

interface ContactInfoFormProps {
  formData: {
    communicatorName: string;
    contactNo1: string;
    contactNo2: string;
    email: string;
  };
  handleChange: (field: string, value: string) => void;
}

/**
 * ContactInfoForm Component
 * Handles the contact information section of the madrasah registration form
 * Including communicator details, zone selection, and email
 */
const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">যোগাযোগের তথ্য</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">যোগাযোগকারীর নাম</label>
          <input
            type="text"
            placeholder="যোগাযোগকারীর নাম লিখুন"
            value={formData.communicatorName}
            onChange={(e) => handleChange('communicatorName', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">মোবাইল-১</label>
          <input
            type="tel"
            placeholder="মোবাইল নম্বর লিখুন"
            value={formData.contactNo1}
            onChange={(e) => handleChange('contactNo1', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">মোবাইল-২</label>
          <input
            type="tel"
            placeholder="বিকল্প মোবাইল নম্বর লিখুন"
            value={formData.contactNo2}
            onChange={(e) => handleChange('contactNo2', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ইমেইল</label>
          <input
            type="email"
            placeholder="ইমেইল লিখুন"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

      </div>
    </div>
  );
};

export default ContactInfoForm;
