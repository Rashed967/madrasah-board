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
import { updateMadrasahBasicInfo, getMadrasahById } from '@/services/madrasahService';
import { MadrasahBasicInfoUpdate } from '@/types/madrasahUpdate';
import type { Madrasah } from '@/types/madrasah';
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
import { updateMadrasahAddress } from '@/services/addressService';
import { AddressForm } from '@/components/forms/AddressForm';
import { MadrasahAddress } from '@/types/address';
import { useMadrasahForm } from '@/hooks/useMadrasahForm';

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

export default function EditMadrasahPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { madrasahData, setMadrasahData } = useMadrasahForm({
    _id: "",
    madrasahNames: {
      bengaliName: "",
      arabicName: "",
      englishName: "" 
    },
    code: "",
    email: "",
    description: "",
    communicatorName: "",
    contactNo1: "",
    contactNo2: "",
    ilhakImage: "",
    address: {
      division: "",
      district: "",
      subDistrict: "",
      policeStation: "",
      village: "",
      holdingNumber: "",
      zone: "",
      courierAddress: ""
    },
    madrasah_information: {
      highestMarhala: "",
      totalStudents: 0,
      totalTeacherAndStuff: 0,
      madrasahType: ""
    },
    muhtamim: {
      name: "",
      nidNumber: "",
      contactNo: "",
      highestEducationalQualification: ""
    },
    chairman_mutawalli: {
      name: "",
      nidNumber: "",
      contactNo: "",
      designation: ""
    },
    educational_secretory: {
      name: "",
      nidNumber: "",
      contactNo: "",
      highestEducationalQualification: ""
    }
  });

  const [initialAddress, setInitialAddress] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchMadrasahData = async () => {
      try {
        const response = await getMadrasahById(id);
        if (response.success) {
          setMadrasahData(response.data);
          setInitialAddress(response.data.address);
          console.log('Fetched madrasah data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching madrasah data:', error);
      }
    };

    if (id) {
      fetchMadrasahData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMadrasahData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setMadrasahData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleBasicInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const updateData = {
        madrasahNames: {
          bengaliName: madrasahData.madrasahNames.bengaliName,
          arabicName: madrasahData.madrasahNames.arabicName,
          englishName: madrasahData.madrasahNames.englishName
        },
        email: madrasahData.email,
        description: madrasahData.description,
        communicatorName: madrasahData.communicatorName,
        contactNo1: madrasahData.contactNo1,
        contactNo2: madrasahData.contactNo2,
        ilhakImage: madrasahData.ilhakImage || ''
      };

      const response = await updateMadrasahBasicInfo(params.id, updateData);
      
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          title: 'সফল',
          message: 'মাদ্রাসার মৌলিক তথ্য সফলভাবে আপডেট করা হয়েছে',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating madrasah:', error);
      setStatusDialog({
        isOpen: true,
        title: 'ত্রুটি',
        message: 'মাদ্রাসার মৌলিক তথ্য আপডেট করা যায়নি',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!madrasahData.address?._id) {
        setStatusDialog({
          isOpen: true,
          title: 'ত্রুটি',
          message: 'ঠিকানার আইডি পাওয়া যায়নি',
          type: 'error'
        });
        setIsLoading(false);
        return;
      }

      // Get changed address fields
      const addressData = {};
      const fields = ['division', 'district', 'subDistrict', 'policeStation', 'village', 'holdingNumber', 'zone'];
      
      fields.forEach(field => {
        const currentValue = madrasahData.address[field];
        const initialValue = initialAddress?.[field];
        console.log(`Checking field ${field}:`, { current: currentValue, initial: initialValue });
        if (currentValue && currentValue !== initialValue) {
          addressData[field] = currentValue;
        }
      });

      console.log('Changed address fields:', addressData);

      if (Object.keys(addressData).length === 0) {
        setStatusDialog({
          isOpen: true,
          title: 'তথ্য',
          message: 'কোনো তথ্য পরিবর্তন করা হয়নি',
          type: 'info'
        });
        setIsLoading(false);
        return;
      }

      console.log('Sending address data:', addressData);

      const response = await updateMadrasahAddress(madrasahData.address._id, addressData);
      console.log('Server response:', response);
      
      if (response.success) {
        setInitialAddress(madrasahData.address); // Update initial address after successful save
        setStatusDialog({
          isOpen: true,
          title: 'সফল',
          message: response.message || 'মাদ্রাসার ঠিকানা সফলভাবে আপডেট করা হয়েছে',
          type: 'success'
        });
      } else {
        setStatusDialog({
          isOpen: true,
          title: 'ত্রুটি',
          message: response.message || 'মাদ্রাসার ঠিকানা আপডেট করা যায়নি',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusDialog({
        isOpen: true,
        title: 'ত্রুটি',
        message: 'মাদ্রাসার ঠিকানা আপডেট করার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (section: string, imageFile: File, previewUrl: string) => {
    setMadrasahData({
      ...madrasahData,
      [section]: {
        ...madrasahData[section],
        image: URL.createObjectURL(imageFile),
        imagePreview: previewUrl
      }
    });
  };

  const renderBasicInformation = () => (
    <form onSubmit={handleBasicInfoUpdate}>
      <BasicInfoForm madrasahData={madrasahData} onChange={handleChange} />
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

  const renderAddressInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">ঠিকানার তথ্য</h2>
      <div>
        <AddressForm 
          address={madrasahData.address}
          onChange={(e) => {
            const { name, value } = e.target;
            const fieldName = name.split('.')[1]; // Extract field name from "address.fieldName"
            setMadrasahData({
              ...madrasahData,
              address: {
                ...madrasahData.address,
                [fieldName]: value
              }
            });
          }}
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddressUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#52b788]/90 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderMadrasahInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">মাদ্রাসার তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="সর্বোচ্চ মারহালা"
          name="madrasah_information.highestMarhala"
          value={madrasahData.madrasah_information.highestMarhala}
          onChange={(name, value) => setMadrasahData({
            ...madrasahData,
            madrasah_information: {
              ...madrasahData.madrasah_information,
              [name]: value
            }
          })}
          options={marhalaTypes}
        />
        <SelectField
          label="মাদ্রাসার ধরণ"
          name="madrasah_information.madrasahType"
          value={madrasahData.madrasah_information.madrasahType}
          onChange={(name, value) => setMadrasahData({
            ...madrasahData,
            madrasah_information: {
              ...madrasahData.madrasah_information,
              [name]: value
            }
          })}
          options={madrasahTypes}
        />
        <InputField
          label="মোট শিক্ষার্থী"
          name="madrasah_information.totalStudents"
          type="number"
          value={madrasahData.madrasah_information.totalStudents}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            madrasah_information: {
              ...madrasahData.madrasah_information,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="মোট শিক্ষক ও কর্মচারী"
          name="madrasah_information.totalTeacherAndStuff"
          type="number"
          value={madrasahData.madrasah_information.totalTeacherAndStuff}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            madrasah_information: {
              ...madrasahData.madrasah_information,
              [e.target.name]: e.target.value
            }
          })}
        />
      </div>
    </div>
  );

  const renderMuhtamimInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">মুহতামিমের তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="muhtamim.name"
          value={madrasahData.muhtamim.name}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            muhtamim: {
              ...madrasahData.muhtamim,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="যোগাযোগ নম্বর"
          name="muhtamim.contactNo"
          value={madrasahData.muhtamim.contactNo}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            muhtamim: {
              ...madrasahData.muhtamim,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="muhtamim.nidNumber"
          value={madrasahData.muhtamim.nidNumber}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            muhtamim: {
              ...madrasahData.muhtamim,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
          name="muhtamim.highestEducationQualification"
          value={madrasahData.muhtamim.highestEducationalQualification}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            muhtamim: {
              ...madrasahData.muhtamim,
              [e.target.name]: e.target.value
            }
          })}
        />
      </div>
    </div>
  );

  const renderMutawalliInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">সভাপতি/মুতাওয়াল্লির তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="chairman_mutawalli.name"
          value={madrasahData.chairman_mutawalli.name}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            chairman_mutawalli: {
              ...madrasahData.chairman_mutawalli,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="যোগাযোগ নম্বর"
          name="chairman_mutawalli.contactNo"
          value={madrasahData.chairman_mutawalli.contactNo}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            chairman_mutawalli: {
              ...madrasahData.chairman_mutawalli,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="chairman_mutawalli.nidNumber"
          value={madrasahData.chairman_mutawalli.nidNumber}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            chairman_mutawalli: {
              ...madrasahData.chairman_mutawalli,
              [e.target.name]: e.target.value
            }
          })}
        />
        <SelectField
          label="পদবি"
          name="chairman_mutawalli.designation"
          value={madrasahData.chairman_mutawalli.designation}
          onChange={(name, value) => setMadrasahData({
            ...madrasahData,
            chairman_mutawalli: {
              ...madrasahData.chairman_mutawalli,
              [name]: value
            }
          })}
          options={designationTypes}
        />
      </div>
    </div>
  );

  const renderEducationSecretaryInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">শিক্ষা সচিবের তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="educational_secretory.name"
          value={madrasahData.educational_secretory.name}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            educational_secretory: {
              ...madrasahData.educational_secretory,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="যোগাযোগ নম্বর"
          name="educational_secretory.contactNo"
          value={madrasahData.educational_secretory.contactNo}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            educational_secretory: {
              ...madrasahData.educational_secretory,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="educational_secretory.nidNumber"
          value={madrasahData.educational_secretory.nidNumber}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            educational_secretory: {
              ...madrasahData.educational_secretory,
              [e.target.name]: e.target.value
            }
          })}
        />
        <InputField
          label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
          name="educational_secretory.highestEducationQualification"
          value={madrasahData.educational_secretory.highestEducationalQualification}
          onChange={(e) => setMadrasahData({
            ...madrasahData,
            educational_secretory: {
              ...madrasahData.educational_secretory,
              [e.target.name]: e.target.value
            }
          })}
        />
      </div>

    </div>
  );

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
              {activeTab === "basic" && renderBasicInformation()}
              {activeTab === "address" && renderAddressInformation()}
              {activeTab === "madrasah" && renderMadrasahInformation()}
              {activeTab === "muhtamim" && renderMuhtamimInformation()}
              {activeTab === "mutawalli" && renderMutawalliInformation()}
              {activeTab === "secretary" && renderEducationSecretaryInformation()}
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
