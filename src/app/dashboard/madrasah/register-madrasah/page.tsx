'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import BasicInfoForm from './components/MadrasahNameAndBio';
import ContactInfoForm from './components/ContactInfoForm';
import LocationForm from './components/LocationForm';
import StaffInfoForm from './components/MutawalliInfo';
import PhotoUpload from './components/PhotoUpload';
import MadrasahNameAndBio from './components/MadrasahNameAndBio';
import MadrasahBasicInfo from './components/MadrasahBasicInfo';
import MuhtamimInfo from './components/MuhtamimInfo';
import EducationSecretory from './components/EducationSecretory';
import MutawalliInfo from './components/MutawalliInfo';


/**
 * RegisterMadrasah Component
 * Main component for madrasah registration
 * Handles form state, validation, and submission
 */
export default function RegisterMadrasah() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    communicatorName: '',
    contactNo1: '',
    contactNo2: '',
    zone: '',
    email: '',
    nameInArabic: '',
    nameInBangla: '',
    nameInEnglish: '',
    description: '',
    highestMarhala: '',
    totalStudent: '',
    totalTeacherAndStaff: '',
    madrasahType: '',
    muhtamimName: '',
    muhtamimNID: '',
    muhtamimMobile: '',
    muhtamimEducation: '',
    year: '',
    district: '',
    subDistrict: '',
    division: '',
    holdingNumber: '',
    policeStation: '',
    postOffice: '',
    village: '',
    courierOption: '',
    madrasahIlhakimage: null as File | null,
    upazila: '',
    shikkhaSocheebName: '',
    shikkhaSocheebNID: '',
    shikkhaSocheebMobile: '',
    shikkhaSocheebEducation: '',
    mutawalliName: '',
    mutawalliDesignation: '',
    mutawalliNID: '',
    mutawalliMobile: ''
  
  });

  const handleChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
    
    // Validate required fields
    const requiredFields = {
      nameInBangla: 'মাদরাসার বাংলা নাম',
      communicatorName: 'যোগাযোগকারীর নাম',
      contactNo1: 'মোবাইল-১',
      contactNo2: 'মোবাইল-২',
      division: 'বিভাগ',
      district: 'জেলা',
      subDistrict: 'উপজেলা',
      village: 'গ্রাম/মহল্লা',
      zone: 'জোন'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`অনুগ্রহ করে নিম্নলিখিত তথ্য পূরণ করুন:\n${missingFields.join('\n')}`);
      return;
    }

    // Validate file sizes
    const validateFileSize = (file: File | null, fieldName: string): boolean => {
      if (file && file.size > 300 * 1024) {
        toast.error(`${fieldName} সাইজ ৩০০ কেবি এর বেশি হতে পারবে না`);
        return false;
      }
      return true;
    };

    const fileValidations = [
      { file: formData.madrasahIlhakimage, name: 'মাদরাসার ইলহাক ছবির' }
    ];

    for (const { file, name } of fileValidations) {
      if (!validateFileSize(file, name)) return;
    }

    setIsLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/madrasah/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': process.env.NEXT_PUBLIC_API_TOKEN as string,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setSuccessMessage(data.message);

      if (response.ok) {
        setShowSuccessModal(true);
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push('/dashboard/madrasah/register-madrasah');
        }, 3000);
      } else {
        toast.error(data.message || 'কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mt-12">
      <div className="w-full md:w-[85%] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">মাদরাসা নিবন্ধন</h1>
          <p className="mt-2 text-sm text-gray-600">নতুন মাদরাসা নিবন্ধনের জন্য তথ্য পূরণ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow">
          <MadrasahNameAndBio formData={formData} handleChange={handleChange} />
          <ContactInfoForm formData={formData} handleChange={handleChange} />
          <MadrasahBasicInfo formData={formData} handleChange={handleChange} />
          <LocationForm formData={formData} handleChange={handleChange} />
          <MuhtamimInfo formData={formData} handleChange={handleChange} />
          <EducationSecretory formData={formData} handleChange={handleChange} />
          <MutawalliInfo formData={formData} handleChange={handleChange} />
          
          <div className="space-y-4">
            <PhotoUpload
              label="মাদরাসা ইলহাকের ছবি আপলোড"
              value={formData.madrasahIlhakimage}
              onChange={handleChange}
              fieldName="madrasahIlhakimage"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 text-base font-medium text-white shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[600px]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <ClipLoader size={20} color="#ffffff" />
                  <span>প্রক্রিয়াজাত হচ্ছে...</span>
                </div>
              ) : (
                'জমা দিন'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title className="text-lg font-medium text-green-600 mb-4">
              সফল হয়েছে!
            </Dialog.Title>
            <p className="text-gray-700">{successMessage}</p>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
