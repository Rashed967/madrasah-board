"use client";

import { useRef, useState } from "react";
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

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface MadrasahData {
  _id: string;
  communicatorName: string;
  madrasahNames: {
    bengaliName: string;
    arabicName: string;
    englishName: string;
  };
  code: string;
  email: string;
  contactNo1: string;
  contactNo2: string;
  ilhakImage: string;
  ilhakImagePreview?: string;
  address: {
    _id: string;
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    village: string;
    holdingNumber: string;
    zone: string;
  };
  muhtamim: {
    _id: string;
    name: string;
    contactNo: string;
    nidNumber: string;
    highestEducationalQualification: string;
    imageUrl: string;
    imagePreview?: string;
    code: string;
  };
  chairman_mutawalli: {
    _id: string;
    name: string;
    contactNo: string;
    nidNumber: string;
    designation: string;
    imageUrl: string;
    imagePreview?: string;
    code: string;
  };
  educational_secretory: {
    _id: string;
    name: string;
    contactNo: string;
    nidNumber: string;
    highestEducationalQualification: string;
    imageUrl: string;
    imagePreview?: string;
    code: string;
  };
  madrasah_information: {
    _id: string;
    highestMarhala: string;
    madrasahType: string;
    totalStudents: number;
    totalTeacherAndStuff: number;
    isDeleted: boolean;
  };
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
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<MadrasahData>({
    _id: params.id,
    communicatorName: "Abdul Karim",
    madrasahNames: {
      bengaliName: "আল-আমিন মাদ্রাসা",
      arabicName: "مدرسة الأمين",
      englishName: "Al-Amin Madrasah"
    },
    code: "MD0023",
    email: "abdurrahmanrashed967@gmail.com",
    contactNo1: "+8801712345678",
    contactNo2: "+8801898765432",
    ilhakImage: "",
    ilhakImagePreview: "",
    address: {
      _id: "676bd6afd8e6a3bcd446c975",
      division: "ঢাকা",
      district: "ঢাকা",
      subDistrict: "সাভার",
      policeStation: "সাভার মডেল",
      village: "হেমায়েতপুর",
      holdingNumber: "123/A",
      zone: "Zone A"
    },
    muhtamim: {
      _id: "676bd6afd8e6a3bcd446c976",
      name: "Abdul Karim",
      contactNo: "+8801712345678",
      nidNumber: "132544565455655316545",
      highestEducationalQualification: "Masters in Islamic Studies",
      imageUrl: "",
      imagePreview: "",
      code: "MM0023"
    },
    chairman_mutawalli: {
      _id: "676bd6afd8e6a3bcd446c977",
      name: "Mohammad Ali",
      contactNo: "+8801998765432",
      nidNumber: "132545544565544316545",
      designation: "সভাপতি",
      imageUrl: "",
      imagePreview: "",
      code: "CM-0013"
    },
    educational_secretory: {
      _id: "676bd6afd8e6a3bcd446c978",
      name: "Abdur Rahman",
      contactNo: "+8801998765432",
      nidNumber: "1325456545545445316545",
      highestEducationalQualification: "Dawrah-e-Hadith",
      imageUrl: "",
      imagePreview: "",
      code: "ES0013"
    },
    madrasah_information: {
      _id: "676bd6afd8e6a3bcd446c979",
      highestMarhala: "তাকমীল",
      madrasahType: "বালক",
      totalStudents: 400,
      totalTeacherAndStuff: 25,
      isDeleted: false
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageChange = (section: string, imageFile: File, previewUrl: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        imagePreview: previewUrl
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">মাদ্রাসার নাম</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="বাংলা নাম"
            name="bengaliName"
            value={formData.madrasahNames.bengaliName}
            onChange={(e) => handleInputChange("madrasahNames", "bengaliName", e.target.value)}
          />
          <InputField
            label="আরবি নাম"
            name="arabicName"
            value={formData.madrasahNames.arabicName}
            onChange={(e) => handleInputChange("madrasahNames", "arabicName", e.target.value)}
          />
          <InputField
            label="ইংরেজি নাম"
            name="englishName"
            value={formData.madrasahNames.englishName}
            onChange={(e) => handleInputChange("madrasahNames", "englishName", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">যোগাযোগের তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="যোগাযোগকারীর নাম"
            name="communicatorName"
            value={formData.communicatorName}
            onChange={(e) => handleInputChange("", "communicatorName", e.target.value)}
          />
          <InputField
            label="ইমেইল"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("", "email", e.target.value)}
          />
          <InputField
            label="প্রাথমিক যোগাযোগ"
            name="contactNo1"
            value={formData.contactNo1}
            onChange={(e) => handleInputChange("", "contactNo1", e.target.value)}
          />
          <InputField
            label="দ্বিতীয় যোগাযোগ"
            name="contactNo2"
            value={formData.contactNo2}
            onChange={(e) => handleInputChange("", "contactNo2", e.target.value)}
          />
        </div>
      </div>

      <div>
        <ImageUpload
          label="মাদ্রাসার ছবি"
          imageUrl={formData.ilhakImage}
          previewUrl={formData.ilhakImagePreview}
          onImageChange={(file, preview) => handleImageChange("", file, preview)}
        />
      </div>
    </div>
  );

  const renderAddressInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">ঠিকানার তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="বিভাগ"
          name="division"
          value={formData.address.division}
          onChange={(name, value) => handleInputChange("address", name, value)}
          options={divisions}
        />
        <SelectField
          label="জেলা"
          name="district"
          value={formData.address.district}
          onChange={(name, value) => handleInputChange("address", name, value)}
          options={districts[formData.address.division] || []}
        />
        <SelectField
          label="উপজেলা"
          name="subDistrict"
          value={formData.address.subDistrict}
          onChange={(name, value) => handleInputChange("address", name, value)}
          options={upazilas[formData.address.district] || []}
        />
        <SelectField
          label="থানা"
          name="policeStation"
          value={formData.address.policeStation}
          onChange={(name, value) => handleInputChange("address", name, value)}
          options={policeStations[formData.address.subDistrict] || []}
        />
        <InputField
          label="গ্রাম/মহল্লা"
          name="village"
          value={formData.address.village}
          onChange={(e) => handleInputChange("address", "village", e.target.value)}
        />
        <InputField
          label="হোল্ডিং নম্বর"
          name="holdingNumber"
          value={formData.address.holdingNumber}
          onChange={(e) => handleInputChange("address", "holdingNumber", e.target.value)}
        />
      </div>
    </div>
  );

  const renderMadrasahInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">মাদ্রাসার তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="সর্বোচ্চ মারহালা"
          name="highestMarhala"
          value={formData.madrasah_information.highestMarhala}
          onChange={(name, value) => handleInputChange("madrasah_information", name, value)}
          options={marhalaTypes}
        />
        <SelectField
          label="মাদ্রাসার ধরণ"
          name="madrasahType"
          value={formData.madrasah_information.madrasahType}
          onChange={(name, value) => handleInputChange("madrasah_information", name, value)}
          options={madrasahTypes}
        />
        <InputField
          label="মোট শিক্ষার্থী"
          name="totalStudents"
          type="number"
          value={formData.madrasah_information.totalStudents}
          onChange={(e) => handleInputChange("madrasah_information", "totalStudents", parseInt(e.target.value))}
        />
        <InputField
          label="মোট শিক্ষক ও কর্মচারী"
          name="totalTeacherAndStuff"
          type="number"
          value={formData.madrasah_information.totalTeacherAndStuff}
          onChange={(e) => handleInputChange("madrasah_information", "totalTeacherAndStuff", parseInt(e.target.value))}
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
          name="name"
          value={formData.muhtamim.name}
          onChange={(e) => handleInputChange("muhtamim", "name", e.target.value)}
        />
        <InputField
          label="যোগাযোগ নম্বর"
          name="contactNo"
          value={formData.muhtamim.contactNo}
          onChange={(e) => handleInputChange("muhtamim", "contactNo", e.target.value)}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="nidNumber"
          value={formData.muhtamim.nidNumber}
          onChange={(e) => handleInputChange("muhtamim", "nidNumber", e.target.value)}
        />
        <InputField
          label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
          name="highestEducationalQualification"
          value={formData.muhtamim.highestEducationalQualification}
          onChange={(e) => handleInputChange("muhtamim", "highestEducationalQualification", e.target.value)}
        />
      </div>
      <ImageUpload
        label="মুহতামিমের ছবি"
        imageUrl={formData.muhtamim.imageUrl}
        previewUrl={formData.muhtamim.imagePreview}
        onImageChange={(file, preview) => handleImageChange("muhtamim", file, preview)}
      />
    </div>
  );

  const renderMutawalliInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">সভাপতি/মুতাওয়াল্লির তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="name"
          value={formData.chairman_mutawalli.name}
          onChange={(e) => handleInputChange("chairman_mutawalli", "name", e.target.value)}
        />
        <InputField
          label="যোগাযোগ নম্বর"
          name="contactNo"
          value={formData.chairman_mutawalli.contactNo}
          onChange={(e) => handleInputChange("chairman_mutawalli", "contactNo", e.target.value)}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="nidNumber"
          value={formData.chairman_mutawalli.nidNumber}
          onChange={(e) => handleInputChange("chairman_mutawalli", "nidNumber", e.target.value)}
        />
        <SelectField
          label="পদবি"
          name="designation"
          value={formData.chairman_mutawalli.designation}
          onChange={(name, value) => handleInputChange("chairman_mutawalli", name, value)}
          options={designationTypes}
        />
      </div>
      <ImageUpload
        label="সভাপতি/মুতাওয়াল্লির ছবি"
        imageUrl={formData.chairman_mutawalli.imageUrl}
        previewUrl={formData.chairman_mutawalli.imagePreview}
        onImageChange={(file, preview) => handleImageChange("chairman_mutawalli", file, preview)}
      />
    </div>
  );

  const renderEducationSecretaryInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">শিক্ষা সচিবের তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="name"
          value={formData.educational_secretory.name}
          onChange={(e) => handleInputChange("educational_secretory", "name", e.target.value)}
        />
        <InputField
          label="যোগাযোগ নম্বর"
          name="contactNo"
          value={formData.educational_secretory.contactNo}
          onChange={(e) => handleInputChange("educational_secretory", "contactNo", e.target.value)}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="nidNumber"
          value={formData.educational_secretory.nidNumber}
          onChange={(e) => handleInputChange("educational_secretory", "nidNumber", e.target.value)}
        />
        <InputField
          label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
          name="highestEducationalQualification"
          value={formData.educational_secretory.highestEducationalQualification}
          onChange={(e) => handleInputChange("educational_secretory", "highestEducationalQualification", e.target.value)}
        />
      </div>
      <ImageUpload
        label="শিক্ষা সচিবের ছবি"
        imageUrl={formData.educational_secretory.imageUrl}
        previewUrl={formData.educational_secretory.imagePreview}
        onImageChange={(file, preview) => handleImageChange("educational_secretory", file, preview)}
      />
    </div>
  );

  return (
    <div className="mx-8 mt-16 mb-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            মাদ্রাসার তথ্য হালনাগাদ
          </h1>

          <div className="border-b border-gray-200 mb-6">
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
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "basic" && renderBasicInformation()}
            {activeTab === "address" && renderAddressInformation()}
            {activeTab === "madrasah" && renderMadrasahInformation()}
            {activeTab === "muhtamim" && renderMuhtamimInformation()}
            {activeTab === "mutawalli" && renderMutawalliInformation()}
            {activeTab === "secretary" && renderEducationSecretaryInformation()}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
              >
                পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
