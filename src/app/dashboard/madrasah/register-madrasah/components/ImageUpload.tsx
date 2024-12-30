'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { validateImageSize, uploadToCloudinary } from '../utils/imageUpload';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (field: string, value: string) => void;
  fieldName: string;
  onImageUpload?: (url: string) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  fieldName,
  onImageUpload,
  error
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('শুধুমাত্র ছবি আপলোড করা যাবে');
      return;
    }

    // Validate file size
    const maxSizeKB = 300;
    const fileSizeKB = Math.round(file.size / 1024);
    if (fileSizeKB > maxSizeKB) {
      setErrorMessage(`ছবির সাইজ ${maxSizeKB}KB এর বেশি হতে পারবে না (বর্তমান সাইজ: ${fileSizeKB}KB)`);
      return;
    }
    setErrorMessage('');

    try {
      setIsUploading(true);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);
      
      if (!result.success || !result.url) {
        setErrorMessage(result.error || 'ছবি আপলোড করতে সমস্যা হয়েছে');
        setPreviewUrl('');
        return;
      }

      onChange(fieldName, result.url);
      if (onImageUpload) {
        onImageUpload(result.url);
      }
      toast.success('ছবি সফলভাবে আপলোড হয়েছে');
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('ছবি আপলোড করতে সমস্যা হয়েছে');
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  }, [onChange, fieldName, onImageUpload]);

  const resetImage = () => {
    setPreviewUrl('');
    onChange(fieldName, '');
    setErrorMessage('');
  };

  return (
    <div className="space-y-4 w-2/6">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 ${error ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="object-contain"
                />
                <button
                  onClick={resetImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">ছবি আপলোড করুন</span>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (সর্বোচ্চ 300KB)</p>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
            disabled={isUploading}
          />
        </label>
      </div>
      {(errorMessage || error) && (
        <p className="mt-1 text-sm text-red-500">
          {errorMessage || error}
        </p>
      )}
      {isUploading && (
        <div className="text-center text-sm text-gray-500">
          ছবি আপলোড হচ্ছে...
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
