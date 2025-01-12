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
import { SuccessDialog } from '@/components/ui/success-dialog';
import { IMadrasah, TCourierAddress, TMadrasahType, TMutawalliDesignation } from '@/features/madrasah/interfaces';
import { madrasahSchema } from '@/features/schemas/madrasah.schema.for.public';
import { madrasahSchemaForAdmin } from '@/features/schemas/madrasah.schema.for.admin';
import PdfUpload from './components/ImageUpload';
import globalValidateRequest from '@/middleware/globalValidateRequest';
import { StatusDialog } from '@/components/ui/status-dialog';

/**
 * RegisterMadrasah Component
 * Main component for madrasah registration
 * Handles form state, validation, and submission
 */
export default function RegisterMadrasah() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const initialFormState: Omit<IMadrasah, '_id' | 'user' | 'madrasahResult' | 'createdAt' | 'updatedAt' | 'status' | 'code'> = {
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
      code: ''
    },
    educational_secretory: {
      name: '',
      contactNo: '',
      nidNumber: '',
      highestEducationalQualification: '',
      code: ''
    },
    ilhakPdf: '',
  };

  console.log(initialFormState);

  const [formData, setFormData] = useState<Omit<IMadrasah, '_id' | 'user' | 'madrasahResult' | 'createdAt' | 'updatedAt' | 'status' | 'code'>>(initialFormState);

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
    setIsSubmitting(true);

    const validationErrors = globalValidateRequest(madrasahSchemaForAdmin, formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ভুল তথ্য!',
        message: 'সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন'
      });
      return;
    }

    try {
      const response = await registerMadrasah(formData);
      console.log('Registration response:', response);

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: response.message || 'মাদরাসা নিবন্ধন সফলভাবে সম্পন্ন হয়েছে'
        });
        setFormData(initialFormState);
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মাদরাসা নিবন্ধন করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error?.message || 'মাদরাসার তথ্য আপডেট করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-4 md:m-8 lg:m-10 xl:m-12">
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
      <div className="mb-6 px-6 text-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">মাদরাসা নিবন্ধন</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">নতুন মাদরাসা নিবন্ধনের জন্য তথ্য পূরণ করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-0 md:space-y-4 bg-white/80 rounded-lg shadow-md p-4 md:p-6 lg:p-8 xl:p-10">
        <MadrasahNameAndBio
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />    
        <ContactInfo
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
        <MadrasahBasicInfo
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
        <LocationForm
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
        <MuhtamimInfo
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
        <EducationSecretory
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
        <MutawalliInfo
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />


        <PdfUpload
          label="মাদরাসা ইলহাকের পিডিএফ আপলোড করুন"
          value={formData.ilhakPdf}
          onChange={handleChange}
          fieldName="ilhakPdf"
          onPdfUpload={(url) => handleChange('ilhakPdf', url)}
          error={errors.ilhakPdf}
        />

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-[#45B39D] hover:bg-[#3B9C85] text-white font-medium rounded-md shadow-sm transition-colors duration-200 gap-2"
          >
            {!isSubmitting && <PaperAirplaneIcon className="h-5 w-5" /> }
            {isSubmitting ? (
              <span className="flex items-center">
                <ClipLoader size={20} color="white" className="mr-2" />
                নিবন্ধন হচ্ছে...
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
