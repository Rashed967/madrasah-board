'use client';

import { getMadrasahById } from '@/services/madrasahService';
import { useEffect, useState } from 'react';
import { MdLocationOn, MdPhone, MdEmail, MdPeople, MdSchool, MdPerson, MdStar, MdDomain } from 'react-icons/md';
import {  Madrasah  } from '@/types/madrasah';
import { InfoCard } from '@/components/madrasah/InfoCard';
import { PersonCard } from '@/components/madrasah/PersonCard';
import { StatsCard } from '@/components/madrasah/StatsCard';
import { Description } from '@/components/madrasah/Description';

export default function MadrasahDetailsPage({ params }: { params: { id: string } }) {
  const [madrasahData, setMadrasahData] = useState<Madrasah | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMadrasahData = async () => {
      try {
        const response = await getMadrasahById(params.id);
        setMadrasahData(response.data);
      } catch (error) {
        console.error('Error fetching madrasah data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMadrasahData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!madrasahData) {
    return <div className="text-center py-10">মাদ্রাসার তথ্য পাওয়া যায়নি</div>;
  }

  const {
    madrasahNames,
    code,
    email,
    contactNo1,
    contactNo2,
    description,
    address,
    muhtamim,
    chairman_mutawalli,
    educational_secretory,
    madrasah_information,
  } = madrasahData;

  return (
    <div className="mx-6 mt-16 mb-8 px-8 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-[#52b788] to-[#52b788]/70 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-2">{madrasahNames.bengaliName}</h1>
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{madrasahNames.arabicName}</span>
              <span className="text-lg">{madrasahNames.englishName}</span>
            </div>
          </div>
        </div>
        <Description text={description} />
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <InfoCard icon={MdSchool} label="মাদ্রাসার কোড" value={code} />
          <InfoCard icon={MdEmail} label="ইমেইল" value={email} />
          <InfoCard icon={MdPhone} label="যোগাযোগ" value={`${contactNo1}${contactNo2 ? `, ${contactNo2}` : ''}`} />
        </div>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <InfoCard
            icon={MdLocationOn}
            label="ঠিকানা"
            value={address ? `${address.holdingNumber}, ${address.village}, ${address.policeStation}, ${address.subDistrict}, ${address.district}, ${address.division}` : undefined}
          />
          <InfoCard icon={MdDomain} label="মাদ্রাসার ধরণ" value={madrasah_information?.madrasahType} />
          <InfoCard icon={MdStar} label="সর্বোচ্চ মারহালা" value={madrasah_information?.highestMarhala} />
        </div>
      </div>

      {/* Administrative Information */}
      <div>
        {/* <h3 className="text-xl font-semibold mb-4">প্রশাসনিক তথ্য</h3> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PersonCard title="মুহতামিম" person={muhtamim} />
          <PersonCard title="চেয়ারম্যান/মুতাওয়াল্লি" person={chairman_mutawalli} />
          <PersonCard title="শিক্ষা সচিব" person={educational_secretory} />
        </div>
      </div>

      {/* Educational Statistics */}
      <div>
        {/* <h3 className="text-xl font-semibold mb-4">শিক্ষা সংক্রান্ত তথ্য</h3> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            icon={MdPeople}
            label="মোট শিক্ষার্থী"
            value={madrasah_information?.totalStudents}
          />
          <StatsCard
            icon={MdPerson}
            label="মোট শিক্ষক ও কর্মচারী"
            value={madrasah_information?.totalTeacherAndStuff}
          />
        </div>
      </div>
    </div>
  );
}
