import React from 'react';

interface ContactInfoProps {
  formData: {
    communicatorName: string;
    contactNo1: string;
    contactNo2: string;
    email: string;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ formData, handleChange, errors = {} }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">যোগাযোগের তথ্য</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              যোগাযোগকারীর নাম
            </label>
            <input
              type="text"
              placeholder="যোগাযোগকারীর নাম লিখুন"
              value={formData.communicatorName}
              onChange={(e) => handleChange('communicatorName', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.communicatorName ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.communicatorName && (
              <p className="mt-1 text-sm text-red-500">{errors.communicatorName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              মোবাইল নম্বর
            </label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.contactNo1}
              onChange={(e) => handleChange('contactNo1', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.contactNo1 ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.contactNo1 && (
              <p className="mt-1 text-sm text-red-500">{errors.contactNo1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              বিকল্প মোবাইল নম্বর
            </label>
            <input
              type="tel"
              placeholder="বিকল্প মোবাইল নম্বর লিখুন"
              value={formData.contactNo2}
              onChange={(e) => handleChange('contactNo2', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.contactNo2 ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.contactNo2 && (
              <p className="mt-1 text-sm text-red-500">{errors.contactNo2}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ইমেইল
            </label>
            <input
              type="email"
              placeholder="ইমেইল লিখুন"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
