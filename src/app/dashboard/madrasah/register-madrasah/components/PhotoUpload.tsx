'use client';

import React from 'react';

interface PhotoUploadProps {
  label: string;
  value: File | null;
  onChange: (field: string, file: File | null) => void;
  fieldName: string;
  required?: boolean;
}

/**
 * PhotoUpload Component
 * A reusable component for handling photo uploads
 * Includes file size validation and preview functionality
 */
const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  value,
  onChange,
  fieldName,
  required = false,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(fieldName, file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {value && (
          <div className="relative h-16 w-16">
            <img
              src={URL.createObjectURL(value)}
              alt={`${label} preview`}
              className="h-full w-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => onChange(fieldName, null)}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        ফাইল সাইজ সর্বোচ্চ ৩০০ কেবি হতে হবে
      </p>
    </div>
  );
};

export default PhotoUpload;
