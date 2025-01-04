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
    <div className="p-6">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold mb-6">যোগাযোগের তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
              যোগাযোগকারীর নাম
            </label>
            <input
              type="text"
              placeholder="যোগাযোগকারীর নাম লিখুন"
              value={formData.communicatorName}
              onChange={(e) => handleChange('communicatorName', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.communicatorName ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.communicatorName && (
              <p className="text-red-500 text-xs italic">{errors.communicatorName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
              মোবাইল নম্বর
            </label>
            <input
              type="tel"
              placeholder="মোবাইল নম্বর লিখুন"
              value={formData.contactNo1}
              onChange={(e) => handleChange('contactNo1', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.contactNo1 ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.contactNo1 && (
              <p className="text-red-500 text-xs italic">{errors.contactNo1}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
              বিকল্প মোবাইল নম্বর
            </label>
            <input
              type="tel"
              placeholder="বিকল্প মোবাইল নম্বর লিখুন"
              value={formData.contactNo2}
              onChange={(e) => handleChange('contactNo2', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.contactNo2 ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.contactNo2 && (
              <p className="text-red-500 text-xs italic">{errors.contactNo2}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
              ইমেইল
            </label>
            <input
              type="email"
              placeholder="ইমেইল লিখুন"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
