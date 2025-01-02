"use client";

import { useRef, useState, useEffect } from "react";
import { MdCloudUpload } from "react-icons/md";
import Image from "next/image";
import { marhalaTypes, madrasahTypes } from "@/constants/madrasahConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { updateMadrasahBasicInfo, getMadrasahById, updateMadrasahInformation } from '@/services/madrasahService';
import { updateMadrasahAddress } from '@/services/addressService';
import BasicInfoForm from "@/components/forms/BasicInfoForm";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AddressForm } from '@/components/forms/AddressForm';
import { useMadrasahForm } from '@/hooks/useMadrasahForm';

import { Types } from "mongoose";
import { IMadrasah, IMadrasahAddress, TCourierAddress, TMadrasahType, TMutawalliDesignation } from "@/features/madrasah/interfaces";

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const divisions = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ"
];

const districts = {
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'রাঙ্গামাটি', 'খাগড়াছড়ি'],
  // Add more districts
};

const upazilas = {
  'ঢাকা': ['সাভার', 'ধামরাই', 'দোহার', 'নবাবগঞ্জ'],
  'গাজীপুর': ['গাজীপুর সদর', 'কালীগঞ্জ', 'কাপাসিয়া'],
  // Add more upazilas
};

const policeStations = {
  'সাভার': ['সাভার মডেল', 'আশুলিয়া', 'ধামরাই'],
  'গাজীপুর সদর': ['জয়দেবপুর', 'টঙ্গী', 'বাসন'],
  // Add more police stations
};

const designationTypes = [
  { value: "সভাপতি", label: "সভাপতি" },
  { value: "মুতাওয়াল্লি", label: "মুতাওয়াল্লি" },
];

const Tab = ({ label, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#52b788] border-b-2 border-[#52b788]"
        : "text-gray-500 hover:text-[#52b788]"
    }`}
  >
    {label}
  </button>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#52b788]"
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Select value={value} onValueChange={(value) => onChange(name, value)}>
      <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#52b788]">
        <SelectValue placeholder={`${label} নির্বাচন করুন`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value || option} value={option.value || option}>
            {option.label || option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const ImageUpload = ({ label, imageUrl, onImageChange, previewUrl = null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleFileChange = (file: File) => {
    if (file && file.size <= 300 * 1024) { // 300KB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('ছবির সাইজ ৩০০ কেবি এর বেশি হতে পারবে না');
    }
  };

  return (
    <div className="">
      <h3 className="text-lg font-medium mb-2">{label}</h3>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer"
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {previewUrl || imageUrl ? (
          <div className="relative w-full h-48">
            <Image
              src={previewUrl || imageUrl}
              alt={label}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <MdCloudUpload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              Click to upload or drag and drop
              <br />
              PNG, JPG or JPEG (MAX. 300KB)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
        />
      </div>
    </div>
  );
};

const initialFormState: IMadrasah = {
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
  ilhakImage: '',
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
  madrasahResult: [],
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date()
};

export default function EditMadrasahPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<IMadrasah>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMadrasah = async () => {
      try {
        const response = await getMadrasahById(params.id);
        if (response.success && response.data) {
          // Ensure all required fields are present
          const madrasahData: IMadrasah = {
            ...initialFormState,
            ...response.data,
            // Ensure nested objects have all required fields
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
              code: response.data.muhtamim?.code || ''
            },
            chairman_mutawalli: {
              name: response.data.chairman_mutawalli?.name || '',
              contactNo: response.data.chairman_mutawalli?.contactNo || '',
              nidNumber: response.data.chairman_mutawalli?.nidNumber || '',
              designation: response.data.chairman_mutawalli?.designation || '' as TMutawalliDesignation,
              code: response.data.chairman_mutawalli?.code || ''
            },
            educational_secretory: {
              name: response.data.educational_secretory?.name || '',
              contactNo: response.data.educational_secretory?.contactNo || '',
              nidNumber: response.data.educational_secretory?.nidNumber || '',
              highestEducationalQualification: response.data.educational_secretory?.highestEducationalQualification || '',
              code: response.data.educational_secretory?.code || ''
            }
          };
          setFormData(madrasahData);
        }
      } catch (error) {
        console.error('Error fetching madrasah:', error);
        toast.error('মাদরাসার তথ্য লোড করতে সমস্যা হয়েছে');
      } finally {
        setLoading(false);
      }
    };

    fetchMadrasah();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handleBasicInfoUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const basicInfo = {
        madrasahNames: formData.madrasahNames,
        email: formData.email,
        communicatorName: formData.communicatorName,
        contactNo1: formData.contactNo1,
        contactNo2: formData.contactNo2,
        description: formData.description
      };
      
      const response = await updateMadrasahBasicInfo(params.id, basicInfo);
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          title: 'Success',
          message: 'Basic information updated successfully',
          type: 'success'
        });
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update basic information',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (typeof formData.address === 'string') {
        throw new Error('Invalid address format');
      }

      const addressData: IMadrasahAddress = {
        division: formData.address.division,
        district: formData.address.district,
        subDistrict: formData.address.subDistrict,
        policeStation: formData.address.policeStation,
        village: formData.address.village,
        holdingNumber: formData.address.holdingNumber,
        zone: formData.address.zone,
        courierAddress: formData.address.courierAddress
      };

      const response = await updateMadrasahAddress(params.id, addressData);
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          title: 'Success',
          message: 'Address updated successfully',
          type: 'success'
        });
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update address',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInformationUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (typeof formData.madrasah_information === 'string') {
        throw new Error('Invalid madrasah information format');
      }

      const infoData = {
        ...formData.madrasah_information,
        madrasah: formData._id || ''
      };

      const response = await updateMadrasahInformation(params.id, infoData);
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          title: 'Success',
          message: 'Madrasah information updated successfully',
          type: 'success'
        });
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update madrasah information',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInformation = () => (
    <form onSubmit={handleBasicInfoUpdate}>
      <BasicInfoForm madrasahData={formData} onChange={handleChange} />
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </form>
  );

  const renderAddressInformation = () => {
    if (typeof formData.address === 'string') return null;

    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <AddressForm
          address={formData.address}
          onChange={handleChange}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Address'}
          </button>
        </div>
      </form>
    );
  };

  const renderMadrasahInformation = () => {
    const info = typeof formData.madrasah_information === 'string' 
      ? null 
      : formData.madrasah_information;

    if (!info) return null;

    return (
      <form onSubmit={handleInformationUpdate} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">মাদ্রাসার তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="সর্বোচ্চ মারহালা"
            name="madrasah_information.highestMarhala"
            value={info.highestMarhala}
            onChange={handleSelectChange}
            options={marhalaTypes}
          />
          <SelectField
            label="মাদ্রাসার ধরণ"
            name="madrasah_information.madrasahType"
            value={info.madrasahType}
            onChange={handleSelectChange}
            options={madrasahTypes}
          />
          <InputField
            label="মোট শিক্ষার্থী"
            name="madrasah_information.totalStudents"
            value={info.totalStudents.toString()}
            onChange={handleChange}
            type="number"
          />
          <InputField
            label="মোট শিক্ষক ও কর্মচারী"
            name="madrasah_information.totalTeacherAndStuff"
            value={info.totalTeacherAndStuff.toString()}
            onChange={handleChange}
            type="number"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Information'}
          </button>
        </div>
      </form>
    );
  };

  const renderMuhtamimInformation = () => {
    const muhtamim = typeof formData.muhtamim === 'string'
      ? null
      : formData.muhtamim;

    if (!muhtamim) return null;

    return (
      <form onSubmit={handleBasicInfoUpdate} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">মুহতামিমের তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="নাম"
            name="muhtamim.name"
            value={muhtamim.name}
            onChange={handleChange}
          />
          <InputField
            label="মোবাইল নম্বর"
            name="muhtamim.contactNo"
            value={muhtamim.contactNo}
            onChange={handleChange}
          />
          <InputField
            label="এনআইডি নম্বর"
            name="muhtamim.nidNumber"
            value={muhtamim.nidNumber}
            onChange={handleChange}
          />
          <InputField
            label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
            name="muhtamim.highestEducationalQualification"
            value={muhtamim.highestEducationalQualification}
            onChange={handleChange}
          />
        </div>
      </form>
    );
  };

  const renderEducationSecretaryInformation = () => {
    const secretary = typeof formData.educational_secretory === 'string'
      ? null
      : formData.educational_secretory;

    if (!secretary) return null;

    return (
      <form onSubmit={handleBasicInfoUpdate} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">শিক্ষা সচিবের তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="নাম"
            name="educational_secretory.name"
            value={secretary.name}
            onChange={handleChange}
          />
          <InputField
            label="মোবাইল নম্বর"
            name="educational_secretory.contactNo"
            value={secretary.contactNo}
            onChange={handleChange}
          />
          <InputField
            label="এনআইডি নম্বর"
            name="educational_secretory.nidNumber"
            value={secretary.nidNumber}
            onChange={handleChange}
          />
          <InputField
            label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
            name="educational_secretory.highestEducationalQualification"
            value={secretary.highestEducationalQualification}
            onChange={handleChange}
          />
        </div>
      </form>
    );
  };

  const renderMutawalliInformation = () => {
    const mutawalli = typeof formData.chairman_mutawalli === 'string'
      ? null
      : formData.chairman_mutawalli;

    if (!mutawalli) return null;

    return (
      <form onSubmit={handleBasicInfoUpdate} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">সভাপতি/মুতাওয়াল্লীর তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="নাম"
            name="chairman_mutawalli.name"
            value={mutawalli.name}
            onChange={handleChange}
          />
          <InputField
            label="মোবাইল নম্বর"
            name="chairman_mutawalli.contactNo"
            value={mutawalli.contactNo}
            onChange={handleChange}
          />
          <InputField
            label="এনআইডি নম্বর"
            name="chairman_mutawalli.nidNumber"
            value={mutawalli.nidNumber}
            onChange={handleChange}
          />
          <SelectField
            label="পদবি"
            name="chairman_mutawalli.designation"
            value={mutawalli.designation}
            onChange={handleSelectChange}
            options={["CHAIRMAN", "MUTAWALLI"]}
          />
        </div>
      </form>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicInformation();
      case "address":
        return renderAddressInformation();
      case "madrasah":
        return renderMadrasahInformation();
      case "muhtamim":
        return renderMuhtamimInformation();
      case "mutawalli":
        return renderMutawalliInformation();
      case "secretary":
        return renderEducationSecretaryInformation();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 mt-20 px-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">মাদ্রাসা তথ্য সম্পাদনা</h1>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <Tab
                label="মৌলিক তথ্য"
                isActive={activeTab === "basic"}
                onClick={() => setActiveTab("basic")}
              />
              <Tab
                label="ঠিকানা"
                isActive={activeTab === "address"}
                onClick={() => setActiveTab("address")}
              />
              <Tab
                label="মাদ্রাসার তথ্য"
                isActive={activeTab === "madrasah"}
                onClick={() => setActiveTab("madrasah")}
              />
              <Tab
                label="মুহতামিম"
                isActive={activeTab === "muhtamim"}
                onClick={() => setActiveTab("muhtamim")}
              />
              <Tab
                label="সভাপতি/মুতাওয়াল্লি"
                isActive={activeTab === "mutawalli"}
                onClick={() => setActiveTab("mutawalli")}
              />
              <Tab
                label="শিক্ষা সচিব"
                isActive={activeTab === "secretary"}
                onClick={() => setActiveTab("secretary")}
              />
            </div>

            <div>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col items-center gap-2">
                {statusDialog.type === 'success' ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                )}
                <span className="text-lg font-semibold">{statusDialog.title}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-center">
            <p className="text-gray-600">{statusDialog.message}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
