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
import { IMadrasah, TCourierAddress, TMadrasahType, TMutawalliDesignation } from '@/features/madrasah/interfaces';
import { madrasahSchema } from '@/features/schemas/madrasah.schema.for.public';
import { madrasahSchemaForAdmin } from '@/features/schemas/madrasah.schema.for.admin';

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
  // & {muhtamim: Omit<IMadrasah['muhtamim'], 'code'>}
  
  const initialFormState: Omit<IMadrasah, '_id' | 'user' | 'madrasahResult' | 'createdAt' | 'updatedAt' | 'status' | 'code' >   = {
    madrasahNames: {
      bengaliName: '',
      englishName: '',
      arabicName: ''
    },
    description: '',
    email: '',
    communicatorName: '',
    contactNo1: '',
    contactNo2: '',
    address: {
      division: '',
      district: '',
      subDistrict: '',
      policeStation: '',
      village: '',
      holdingNumber: '',
      zone: '',
      courierAddress: '' as TCourierAddress
    },
    madrasah_information: {
      highestMarhala: '',
      totalStudents: 0,
      totalTeacherAndStuff: 0,
      madrasahType: '' as TMadrasahType
    },
    muhtamim: {
      name: '',
      contactNo: '',
      nidNumber: '',
      highestEducationalQualification: '',
      code: ''
    },
    chairman_mutawalli: {
      name: '',
      contactNo: '',
      nidNumber: '',
      designation: '' as TMutawalliDesignation,
      code: '' as TMutawalliDesignation
    },
    educational_secretory: {
      name: '',
      contactNo: '',
      nidNumber: '',
      highestEducationalQualification: '',
      code: ''
    },
    ilhakImage: '',
  };

  const [formData, setFormData] = useState<Omit<IMadrasah, '_id' | 'user' | 'madrasahResult' | 'createdAt' | 'updatedAt' | 'status' | 'code' > >(initialFormState);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const newState = { ...prev };
      const fieldPath = field.split('.');
      let current: any = newState;
      
      // Navigate to the nested object
      for (let i = 0; i < fieldPath.length - 1; i++) {
        current = current[fieldPath[i]];
      }
      
      // Set the value
      current[fieldPath[fieldPath.length - 1]] = value;
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    try {
      // Validate form data with Zod
      const validationResult = madrasahSchemaForAdmin.safeParse(formData);
      console.log(validationResult);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        
        setValidationErrors(errors);
        toast.error('সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন');
        return;
      }

      setValidationErrors({});
      setIsLoading(true);

      const response = await registerMadrasah(validationResult.data);
      console.log('Registration response:', response);
      
      if (response.success) {
        setSuccessMessage(response.message || 'মাদরাসা নিবন্ধন সফলভাবে সম্পন্ন হয়েছে');
        setShowSuccessModal(true);
        // Reset form data
        setFormData(initialFormState);
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
          value={formData.ilhakImage} 
          onChange={handleChange} 
          fieldName="ilhakImage"
          onImageUpload={(url) => handleChange('ilhakImage', url)}
          error={validationErrors.ilhakImage}
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
