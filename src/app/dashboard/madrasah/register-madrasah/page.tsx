'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { registerMadrasah } from '@/services/madrasahService';
import MadrasahNameAndBio from './components/MadrasahNameAndBio';
import ContactInfo from './components/ContactInfo';
import MadrasahBasicInfo from './components/MadrasahBasicInfo';
import LocationForm from './components/LocationForm';
import MuhtamimInfo from './components/MuhtamimInfo';
import EducationSecretory from './components/EducationSecretory';
import MutawalliInfo from './components/MutawalliInfo';
import ImageUpload from './components/ImageUpload';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import {SuccessDialog} from '@/components/ui/success-dialog';

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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
    district: '',
    subDistrict: '',
    division: '',
    holdingNumber: '',
    policeStation: '',
    village: '',
    courierAddress: '',
    madrasahIlhakimage: '',
    shikkhaSocheebName: '',
    shikkhaSocheebNID: '',
    shikkhaSocheebMobile: '',
    shikkhaSocheebEducation: '',
    mutawalliName: '',
    mutawalliDesignation: '',
    mutawalliNID: '',
    mutawalliMobile: ''
  
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    console.log('Form submitted with data:', formData);

    // Required fields validation
    const requiredFields = {
      // Contact Info (All required)
      communicatorName: 'যোগাযোগকারীর নাম',
      contactNo1: 'মোবাইল নম্বর',
      contactNo2: 'বিকল্প মোবাইল নম্বর',
      email: 'ইমেইল',
      
      // Basic Info
      highestMarhala: 'সর্বোচ্চ মারহালা',
      madrasahType: 'মাদ্রাসার ধরণ',
      
      // Location Info
      zone: 'জোন',
      courierAddress: 'চিঠি প্রেরণের মাধ্যম',
      division: 'বিভাগ',
      district: 'জেলা',
      subDistrict: 'উপজেলা',
      policeStation: 'থানা',
      village: 'গ্রাম',
      
      // Madrasah Names (All required)
      nameInBangla: 'বাংলা নাম',
      nameInArabic: 'আরবি নাম',
      
      // Required Image
      madrasahIlhakimage: 'মাদরাসা ইলহাকের ছবি'
    };

    const errors: Record<string, string> = {};
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        errors[field] = `${label} আবশ্যক`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('সকল প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      // Filter out empty fields but include optional fields even if empty
      const filteredData = {
        ...formData,
        // Include optional fields with empty values
        muhtamimName: formData.muhtamimName || '',
        muhtamimNID: formData.muhtamimNID || '',
        muhtamimMobile: formData.muhtamimMobile || '',
        muhtamimEducation: formData.muhtamimEducation || '',
        shikkhaSocheebName: formData.shikkhaSocheebName || '',
        shikkhaSocheebNID: formData.shikkhaSocheebNID || '',
        shikkhaSocheebMobile: formData.shikkhaSocheebMobile || '',
        shikkhaSocheebEducation: formData.shikkhaSocheebEducation || '',
        mutawalliName: formData.mutawalliName || '',
        mutawalliDesignation: formData.mutawalliDesignation || '',
        mutawalliNID: formData.mutawalliNID || '',
        mutawalliMobile: formData.mutawalliMobile || ''
      };

      console.log('Filtered data:', filteredData);
      const response = await registerMadrasah(filteredData);
      console.log('Registration response:', response);
      
      if (response.success) {
        setSuccessMessage(response.message || 'মাদরাসা নিবন্ধন সফলভাবে সম্পন্ন হয়েছে');
        setShowSuccessModal(true);
        // Reset form data
        setFormData({
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
          district: '',
          subDistrict: '',
          division: '',
          holdingNumber: '',
          policeStation: '',
          village: '',
          courierAddress: '',
          madrasahIlhakimage: '',
          shikkhaSocheebName: '',
          shikkhaSocheebNID: '',
          shikkhaSocheebMobile: '',
          shikkhaSocheebEducation: '',
          mutawalliName: '',
          mutawalliDesignation: '',
          mutawalliNID: '',
          mutawalliMobile: ''
        });
      } else {
        toast.error(response.message || 'কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 mx-16 my-16">
      <div className="mb-6 px-6 text-center">
        <h1 className="text-3xl font-semibold text-gray-800">মাদরাসা নিবন্ধন</h1>
        <p className="text-base text-gray-600 mt-1">নতুন মাদরাসা নিবন্ধনের জন্য তথ্য পূরণ করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 rounded-lg shadow-md p-12">
        <MadrasahNameAndBio 
          formData={formData} 
          handleChange={handleChange} 
          errors={validationErrors}
        />
        <ContactInfo
          formData={formData}
          handleChange={handleChange}
          errors={validationErrors}
        />
        <MadrasahBasicInfo 
          formData={formData} 
          handleChange={handleChange} 
          errors={validationErrors}
        />
        <LocationForm 
          formData={formData} 
          handleChange={handleChange} 
          errors={validationErrors}
        />
        <MuhtamimInfo 
          formData={formData} 
          handleChange={handleChange} 
          errors={validationErrors}
        />
        <EducationSecretory 
          formData={formData} 
          handleChange={handleChange} 
          errors={validationErrors}
        />
        <MutawalliInfo 
          formData={formData} 
          handleChange={handleChange} 
          errors={validationErrors}
        />

        <ImageUpload 
          label="মাদরাসা ইলহাকের ছবি" 
          value={formData.madrasahIlhakimage} 
          onChange={handleChange} 
          fieldName="madrasahIlhakimage"
          onImageUpload={(url) => handleChange('madrasahIlhakimage', url)}
          error={validationErrors.madrasahIlhakimage}
        />

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-[#45B39D] hover:bg-[#3B9C85] text-white font-medium rounded-md shadow-sm transition-colors duration-200 gap-2"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            {isLoading ? (
              <span className="flex items-center">
                <ClipLoader size={20} color="white" className="mr-2" />
                প্রক্রিয়াকরণ হচ্ছে...
              </span>
            ) : (
              'নিবন্ধন করুন'
            )}
          </button>
        </div>
      </form>

      <SuccessDialog
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
}
