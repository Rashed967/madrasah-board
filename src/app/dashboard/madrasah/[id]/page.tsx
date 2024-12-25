'use client';

import { useEffect, useState } from 'react';
import { MdLocationOn, MdPhone, MdEmail, MdPeople, MdSchool, MdCalendarToday, MdPerson, MdBook, MdStar, MdDomain } from 'react-icons/md';

interface MadrasahData {
  ilhakIamge: string;
  _id: string;
  madrasahNames: {
    bengaliName: string;
    arabicName: string;
    englishName: string;
  };
  bio: string;
  code: string;
  email: string;
  contactNo1: string;
  contactNo2: string;
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
    code: string;
  };
  chairman_mutawalli: {
    _id: string;
    name: string;
    contactNo: string;
    nidNumber: string;
    designation: string;
    imageUrl: string;
    code: string;
  };
  educational_secretory: {
    _id: string;
    name: string;
    contactNo: string;
    nidNumber: string;
    highestEducationalQualification: string;
    imageUrl: string;
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
  status: string;
}

export default function MadrasahDetailsPage({ params }: { params: { id: string } }) {
  const [madrasahData, setMadrasahData] = useState<MadrasahData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now using mock data
    const mockData: MadrasahData = {
      ilhakIamge: "image link here",
      _id: params.id,
      madrasahNames: {
        bengaliName: "আল-আমিন মাদ্রাসা",
        arabicName: "مدرسة الأمين",
        englishName: "Al-Amin Madrasah"
      },
      bio: "১৯৮৫ সালে প্রতিষ্ঠিত এই মাদরাসাটি বাংলাদেশের অন্যতম প্রাচীন শিক্ষা প্রতিষ্ঠান। এখানে কওমি ও আলিয়া মাদরাসার পাঠদান করা হয়। প্রতি বছর শতাধিক ছাত্র এখান থেকে পাস করে বিভিন্ন প্রতিষ্ঠানে কর্মরত আছে।",
      code: "100039",
      email: "abdurrahmanrashed967@gmail.com",
      contactNo1: "+8801712345678",
      contactNo2: "+8801898765432",
      address: {
        _id: "676bd6afd8e6a3bcd446c975",
        division: "Dhaka",
        district: "Dhaka",
        subDistrict: "Gulshan",
        policeStation: "Gulshan Police Station",
        village: "Vatara",
        holdingNumber: "123/4",
        zone: "6767f0b3dff3c630fbbb8e81"
      },
      muhtamim: {
        _id: "676bd6b0d8e6a3bcd446c979",
        name: "Abdul Karim",
        contactNo: "+8801712345678",
        nidNumber: "132544565455655316545",
        highestEducationalQualification: "Masters in Islamic Studies",
        imageUrl: "https://i.ibb.co/7yNhYGG/profile-placeholder.jpg",
        code: "MM0023"
      },
      chairman_mutawalli: {
        _id: "676bd6b0d8e6a3bcd446c97d",
        name: "Fatema Begum",
        contactNo: "+8801998765432",
        nidNumber: "132545544565544316545",
        designation: "সভাপতি",
        imageUrl: "https://i.ibb.co/7yNhYGG/profile-placeholder.jpg",
        code: "CM-0013"
      },
      educational_secretory: {
        _id: "676bd6b0d8e6a3bcd446c981",
        name: "Fatema Begum",
        contactNo: "+8801998765432",
        nidNumber: "1325456545545445316545",
        highestEducationalQualification: "Dawrah-e-Hadith",
        imageUrl: "https://i.ibb.co/7yNhYGG/profile-placeholder.jpg",
        code: "ES0013"
      },
      madrasah_information: {
        _id: "676bd6b0d8e6a3bcd446c983",
        highestMarhala: "জালালাইন",
        madrasahType: "বালক",
        totalStudents: 400,
        totalTeacherAndStuff: 25,
        isDeleted: false
      },
      status: "active"
    };

    setMadrasahData(mockData);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52b788]"></div>
      </div>
    );
  }

  if (!madrasahData) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">মাদ্রাসা খুঁজে পাওয়া যায়নি</h2>
          <p className="mt-2 text-gray-600">দুঃখিত, আপনার অনুরোধকৃত মাদ্রাসাটি খুঁজে পাওয়া যায়নি।</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-6 mt-16 mb-8 px-8 space-y-4">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-[#52b788] to-[#52b788]/70 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-4xl font-bold mb-2">{madrasahData.madrasahNames.bengaliName}</h1>
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{madrasahData.madrasahNames.arabicName}</span>
              <span className="text-lg">{madrasahData.madrasahNames.englishName}</span>
            </div>
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">{madrasahData.bio}</p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdSchool className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">মাদ্রাসা কোড</p>
              <p className="font-medium">{madrasahData.code}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdPeople className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">মোট শিক্ষার্থী</p>
              <p className="font-medium">{madrasahData.madrasah_information.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdPerson className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">শিক্ষক ও কর্মচারী</p>
              <p className="font-medium">{madrasahData.madrasah_information.totalTeacherAndStuff}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdDomain className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">মাদ্রাসার ধরন</p>
              <p className="font-medium">{madrasahData.madrasah_information.madrasahType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-xl font-semibold mb-6">যোগাযোগের তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdLocationOn className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ঠিকানা</p>
              <p className="font-medium">
                {`${madrasahData.address.holdingNumber}, ${madrasahData.address.village}, ${madrasahData.address.subDistrict}, ${madrasahData.address.district}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdPhone className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ফোন</p>
              <div>
                <p className="font-medium">{madrasahData.contactNo1}</p>
                {madrasahData.contactNo2 && (
                  <p className="font-medium">{madrasahData.contactNo2}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdEmail className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ইমেইল</p>
              <p className="font-medium">{madrasahData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Administration Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Muhtamim */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">মহতামিম</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img src={madrasahData.muhtamim.imageUrl} alt="Muhtamim" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-lg">{madrasahData.muhtamim.name}</h3>
              <p className="text-sm text-gray-600">{madrasahData.muhtamim.highestEducationalQualification}</p>
              <p className="text-sm text-gray-600">{madrasahData.muhtamim.contactNo}</p>
            </div>
          </div>
        </div>

        {/* Chairman/Mutawalli */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">সভাপতি/মুতাওয়াল্লি</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img src={madrasahData.chairman_mutawalli.imageUrl} alt="Chairman" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-lg">{madrasahData.chairman_mutawalli.name}</h3>
              <p className="text-sm text-gray-600">{madrasahData.chairman_mutawalli.designation}</p>
              <p className="text-sm text-gray-600">{madrasahData.chairman_mutawalli.contactNo}</p>
            </div>
          </div>
        </div>

        {/* Educational Secretary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">শিক্ষা সচিব</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img src={madrasahData.educational_secretory.imageUrl} alt="Educational Secretary" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-lg">{madrasahData.educational_secretory.name}</h3>
              <p className="text-sm text-gray-600">{madrasahData.educational_secretory.highestEducationalQualification}</p>
              <p className="text-sm text-gray-600">{madrasahData.educational_secretory.contactNo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
