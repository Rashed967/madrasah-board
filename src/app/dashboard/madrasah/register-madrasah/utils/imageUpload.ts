// imageUpload.ts
import { toast } from 'react-hot-toast';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const validateImageSize = (file: File): boolean => {
  const maxSizeKB = 300;
  const fileSizeKB = Math.round(file.size / 1024);
  
  if (fileSizeKB > maxSizeKB) {
    toast.error(`ছবির সাইজ ${maxSizeKB}KB এর বেশি হতে পারবে না (বর্তমান সাইজ: ${fileSizeKB}KB)`);
    return false;
  }
  return true;
};

export const uploadToCloudinary = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'madrasah_images');

    const cloudName = 'dpes1dyqb';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Image upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error) {
    return {
      success: false,
      error: 'ছবি আপলোড করতে সমস্যা হয়েছে',
    };
  }
};
