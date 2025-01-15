"use client";

import { useState, useEffect } from "react";
import { IMadrasah, IMadrasahAddress, TCourierAddress, TMadrasahType, TMutawalliDesignation } from '@/features/madrasah/interfaces';
import { updateMadrasahBasicInfo, getMadrasahById, updateMadrasahInformation } from '@/services/madrasahService';
import { updateMadrasahAddress } from '@/services/addressService';
import { updateMuhtamim, updateChairmanMutawalli, updateEducationalSecretary } from '@/services/staffService';
import toast from "react-hot-toast";
import { BasicInformationSection } from './components/BasicInformationSection';
import { AddressInformationSection } from './components/AddressInformationSection';
import { MadrasahInformationSection } from './components/MadrasahInformationSection';
import { MuhtamimInformationSection } from './components/MuhtamimInformationSection';
import { MutawalliInformationSection } from './components/MutawalliInformationSection';
import { EducationSecretarySection } from './components/EducationSecretarySection';
import { EditSectionTabs } from './components/EditSectionTabs';
import { basicInfoSchema } from '@/features/madrasah/schemas/basicInfo.schema';
import { StatusDialog } from "@/components/ui/status-dialog";
import globalValidateRequest from "@/middleware/globalValidateRequest";
import { addressSchema } from "@/features/schemas/address.schema";
import madrasahInfoSchemas from "@/features/schemas/madrasah-info.schema";
import staffSchemas from "@/features/schemas/staff.schema";
import { Types } from "mongoose";



const initialFormState: IMadrasah= {
  _id: '',
  user: '',
  madrasahNames: {
    bengaliName: '',
    englishName: '',
    arabicName: ''
  },
  description: '',
  code: '',
  email: '',
  communicatorName: '',
  contactNo1: '',
  contactNo2: '',
  ilhakPdf: '',
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
    madrasahType: '' as TMadrasahType,
    _id: ""
  },
  muhtamim: {
    name: '',
    contactNo: '',
    nidNumber: '',
    highestEducationalQualification: '',
    code: '',
    _id: ""
  },
  chairman_mutawalli: {
    name: '',
    contactNo: '',
    nidNumber: '',
    designation: '' as TMutawalliDesignation,
    code: '',
    _id: ""
  },
  educational_secretory: {
    name: '',
    contactNo: '',
    nidNumber: '',
    highestEducationalQualification: '',
    code: '',
    _id: ""
  },
  madrasahResult: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date()
};

export default function EditMadrasahPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<IMadrasah>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  

  useEffect(() => {
    const fetchMadrasah = async () => {
      try {
        const response = await getMadrasahById(params.id);
        if (response.success && response.data) {
          const madrasahData: IMadrasah = {
            ...initialFormState,
            ...response.data,
            madrasahNames: {
              bengaliName: response.data.madrasahNames?.bengaliName || '',
              englishName: response.data.madrasahNames?.englishName || '',
              arabicName: response.data.madrasahNames?.arabicName || ''
            },
            muhtamim: {
              name: response.data.muhtamim?.name || '',
              contactNo: response.data.muhtamim?.contactNo || '',
              nidNumber: response.data.muhtamim?.nidNumber || '',
              highestEducationalQualification: response.data.muhtamim?.highestEducationalQualification || '',
              code: response.data.muhtamim?.code || '',
              _id: response.data.muhtamim?._id
            },
            chairman_mutawalli: {
              name: response.data.chairman_mutawalli?.name || '',
              contactNo: response.data.chairman_mutawalli?.contactNo || '',
              nidNumber: response.data.chairman_mutawalli?.nidNumber || '',
              designation: response.data.chairman_mutawalli?.designation || '' as TMutawalliDesignation,
              code: response.data.chairman_mutawalli?.code || '',
              _id: response.data.chairman_mutawalli?._id
            },
            educational_secretory: {
              name: response.data.educational_secretory?.name || '',
              contactNo: response.data.educational_secretory?.contactNo || '',
              nidNumber: response.data.educational_secretory?.nidNumber || '',
              highestEducationalQualification: response.data.educational_secretory?.highestEducationalQualification || '',
              code: response.data.educational_secretory?.code || '',
              _id: response.data.educational_secretory?._id
            }
          };
          setFormData(madrasahData);
        }
      } catch (error) {
        toast.error('মাদরাসার তথ্য লোড করতে সমস্যা হয়েছে');
      } finally {
        setLoading(false);
      }
    };

    fetchMadrasah();
  }, [params.id]);

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof IMadrasah];
        if (parentObj && typeof parentObj === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleBasicInfoUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate request
    const validationErrors = globalValidateRequest(basicInfoSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const basicInfo = {
        madrasahNames: {
          bengaliName: formData.madrasahNames?.bengaliName?.trim() || '',
          englishName: formData.madrasahNames?.englishName?.trim() || '',
          arabicName: formData.madrasahNames?.arabicName?.trim() || ''
        },
        email: formData.email?.trim() || '',
        communicatorName: formData.communicatorName?.trim() || '',
        contactNo1: formData.contactNo1?.trim() || '',
        contactNo2: formData.contactNo2?.trim() || '',
        description: formData.description?.trim() || ''
      };
      
      const response = await updateMadrasahBasicInfo(params.id, basicInfo);

      
if (response.success) {
  setStatusDialog({
    isOpen: true,
    type: 'success',
    title: 'সফল!',
    message: 'মাদরাসার মৌলিক তথ্য সফলভাবে আপডেট করা হয়েছে'
  });
  return;
}    else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মাদরাসার তথ্য আপডেট করতে সমস্যা হয়েছে'
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

  const handleAddressUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = globalValidateRequest(addressSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (typeof formData.address === 'string') {
        throw new Error('Invalid address format');
      }

      const addressData: IMadrasahAddress = {
        division: formData.address.division.trim() || '',
        district: formData.address.district.trim() || '',
        subDistrict: formData.address.subDistrict.trim() || '',
        policeStation: formData.address.policeStation.trim() || '',
        village: formData.address.village.trim() || '',
        holdingNumber: formData.address.holdingNumber.trim() || '',
        zone: formData.address.zone.trim() || '',
        courierAddress: formData.address.courierAddress || '' as TCourierAddress
      };

      const response = await updateMadrasahAddress(formData.address._id.toString(), addressData);

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'মাদরাসার ঠিকানা সফলভাবে আপডেট করা হয়েছে'
        });
        return;
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মাদরাসার ঠিকানা আপডেট করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error?.message || 'মাদরাসার ঠিকানা আপডেট করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInformationUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = globalValidateRequest(madrasahInfoSchemas.updateMadrasahInfoSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      if (typeof formData.madrasah_information === 'string') {
        throw new Error('Invalid madrasah information format');
      }

      const madrasahInfo = {
        highestMarhala: formData.madrasah_information.highestMarhala,
        totalStudents: Number(formData.madrasah_information.totalStudents),
        totalTeacherAndStuff: Number(formData.madrasah_information.totalTeacherAndStuff),
        madrasahType: formData.madrasah_information.madrasahType
      };

      const response = await updateMadrasahInformation(formData.madrasah_information._id.toString(), madrasahInfo);

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'মাদরাসার তথ্য সফলভাবে আপডেট করা হয়েছে'
        });
        return;
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মাদরাসার তথ্য আপডেট করতে সমস্যা হয়েছে'
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

  const handleMuhtamimUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

  
    const validationErrors = globalValidateRequest(staffSchemas.updateMuhtamimSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      if (typeof formData.muhtamim === 'string') {
        throw new Error('Invalid muhtamim information format');
      }
      
      const muhtamimInfo = {
        name: formData.muhtamim.name,
        contactNo: formData.muhtamim.contactNo,
        nidNumber: formData.muhtamim.nidNumber,
        highestEducationalQualification: formData.muhtamim.highestEducationalQualification,
      };
      const response = await updateMuhtamim(formData.muhtamim._id.toString(), muhtamimInfo);

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'মুহতামিমের তথ্য সফলভাবে আপডেট করা হয়েছে'
        });
        return;
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মুহতামিমের তথ্য আপডেট করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error?.message || 'মুহতামিমের তথ্য আপডেট করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMutawalliUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = globalValidateRequest(staffSchemas.updateMutawalliSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (typeof formData.chairman_mutawalli === 'string') {
        throw new Error('Invalid chairman/mutawalli information format');
      }

      const mutawalliInfo = {
        name: formData.chairman_mutawalli.name,
        contactNo: formData.chairman_mutawalli.contactNo,
        nidNumber: formData.chairman_mutawalli.nidNumber,
        designation: formData.chairman_mutawalli.designation,
      };

      const response = await updateChairmanMutawalli(formData.chairman_mutawalli._id.toString(), mutawalliInfo);

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'চেয়ারম্যান/মুতাওয়াল্লির তথ্য সফলভাবে আপডেট করা হয়েছে'
        });
        return;
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'চেয়ারম্যান/মুতাওয়াল্লির তথ্য আপডেট করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error?.message || 'চেয়ারম্যান/মুতাওয়াল্লির তথ্য আপডেট করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecretaryUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = globalValidateRequest(staffSchemas.updateEducationalSecretarySchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (typeof formData.educational_secretory === 'string') {
        throw new Error('Invalid educational secretary information format');
      }

      const secretaryInfo = {
        name: formData.educational_secretory.name,
        contactNo: formData.educational_secretory.contactNo,
        nidNumber: formData.educational_secretory.nidNumber,
        highestEducationalQualification: formData.educational_secretory.highestEducationalQualification,
      };

      const response = await updateEducationalSecretary(formData.educational_secretory._id.toString(), secretaryInfo);

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'শিক্ষা সচিবের তথ্য সফলভাবে আপডেট করা হয়েছে'
        });
        return;
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'শিক্ষা সচিবের তথ্য আপডেট করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error?.message || 'শিক্ষা সচিবের তথ্য আপডেট করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInformationSection
            formData={formData}
            onChange={handleChange}
            onSubmit={handleBasicInfoUpdate}
            errors={errors}
          />
        );
      case "address":
        return (
          <AddressInformationSection
            formData={formData}
            onChange={handleChange}
            onSubmit={handleAddressUpdate}
            isSubmitting={isSubmitting}
          />
        );
      case "madrasah":
        return (
          <MadrasahInformationSection
            formData={formData}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleInformationUpdate}
            isSubmitting={isSubmitting}
          />
        );
      case "muhtamim":
        return (
          <MuhtamimInformationSection
            formData={formData}
            onChange={handleChange}
            onSubmit={handleMuhtamimUpdate}
            isSubmitting={isSubmitting}
          />
        );
      case "mutawalli":
        return (
          <MutawalliInformationSection
            formData={formData}
            onChange={handleChange}
            onSubmit={handleMutawalliUpdate}
            isSubmitting={isSubmitting}
          />
        );
      case "secretary":
        return (
          <EducationSecretarySection
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSecretaryUpdate}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
  
    <div className="container mx-auto py-6 mt-8 md:mt-12 px-6">

      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />

      <div className="bg-white rounded-lg shadow-lg p-6 ">
        <div className="flex flex-col space-y-6 ">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold">মাদ্রাসা তথ্য সম্পাদনা</h1>
          </div>

          <div className="flex flex-col space-y-4">
            <EditSectionTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
