'use client';

import React, { useCallback, useState } from 'react';
import { uploadToCloudinary } from '../utils/imageUpload';
import { toast } from 'react-hot-toast';

interface PdfUploadProps {
  label: string;
  value?: string;
  onChange: (field: string, value: string) => void;
  fieldName: string;
  onPdfUpload?: (url: string) => void;
  error?: string;
}

const PdfUpload: React.FC<PdfUploadProps> = ({
  label,
  value,
  onChange,
  fieldName,
  onPdfUpload,
  error
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePdfChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setErrorMessage('শুধুমাত্র PDF ফাইল আপলোড করা যাবে');
      return;
    }

    // Validate file size
    const maxSizeKB = 300;
    const fileSizeKB = Math.round(file.size / 1024);
    if (fileSizeKB > maxSizeKB) {
      setErrorMessage(`ফাইলের সাইজ ${maxSizeKB}KB এর বেশি হতে পারবে না (বর্তমান সাইজ: ${fileSizeKB}KB)`);
      return;
    }
    setErrorMessage('');

    try {
      setIsUploading(true);
      setFileName(file.name);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);
      
      if (!result.success || !result.url) {
        setErrorMessage(result.error || 'PDF আপলোড করতে সমস্যা হয়েছে');
        setFileName('');
        return;
      }

      onChange(fieldName, result.url);
      if (onPdfUpload) {
        onPdfUpload(result.url);
      }
      toast.success('PDF সফলভাবে আপলোড হয়েছে');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setErrorMessage('PDF আপলোড করতে সমস্যা হয়েছে');
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  }, [onChange, fieldName, onPdfUpload]);

  const resetFile = () => {
    setFileName('');
    onChange(fieldName, '');
    setErrorMessage('');
  };

  return (
    <div className="space-y-4 p-6 w-full md:w-1/2">
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
            {fileName ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-500 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p className="text-sm text-gray-500">{fileName}</p>
                <button
                  onClick={resetFile}
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
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">PDF ফাইল আপলোড করুন</span>
                </p>
                <p className="text-xs text-gray-500">সর্বোচ্চ 300KB</p>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handlePdfChange}
            accept="application/pdf"
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
          PDF আপলোড হচ্ছে...
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
