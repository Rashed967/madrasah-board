'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterMadrasah() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    madrasahNames: {
      nameInArabic: '',
      nameInBangla: '',
      nameInEnglish: ''
    },
    communicatorName: '',
    communicatorContactNo: '',
    yearlyInformtion: {
      highestMarhala: '',
      madrasahType: '',
      totalStudent: '',
      totalTeacherAndStaff: ''
    },
    location: {
      division: '',
      distric: '',
      village: '',
      postOffice: '',
      holdingNumber: '',
      courierOption: '',
      policeStation: ''
    },
    muhtamim: {
      muhtamimName: '',
      muhtamimNID: ''
    },
    logoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically send the data to your backend
      console.log(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object'
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">মাদরাসা নিবন্ধন</h1>
          <p className="mt-2 text-sm text-gray-600">নতুন মাদরাসা নিবন্ধনের জন্য তথ্য পূরণ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow">
          {/* Madrasah Names */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">মাদরাসার নাম</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">আরবি নাম</label>
                <input
                  type="text"
                  placeholder="আরবি নাম লিখুন"
                  value={formData.madrasahNames.nameInArabic}
                  onChange={(e) => handleChange('madrasahNames', 'nameInArabic', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">বাংলা নাম</label>
                <input
                  type="text"
                  placeholder="বাংলা নাম লিখুন"
                  value={formData.madrasahNames.nameInBangla}
                  onChange={(e) => handleChange('madrasahNames', 'nameInBangla', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ইংরেজি নাম</label>
                <input
                  type="text"
                  placeholder="ইংরেজি নাম লিখুন"
                  value={formData.madrasahNames.nameInEnglish}
                  onChange={(e) => handleChange('madrasahNames', 'nameInEnglish', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Communicator Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">যোগাযোগকারীর তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">যোগাযোগকারীর নাম</label>
                <input
                  type="text"
                  placeholder="নাম লিখুন"
                  value={formData.communicatorName}
                  onChange={(e) => handleChange('communicatorName', '', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="মোবাইল নম্বর লিখুন"
                  value={formData.communicatorContactNo}
                  onChange={(e) => handleChange('communicatorContactNo', '', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Yearly Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">বার্ষিক তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">সর্বোচ্চ মারহালা</label>
                <input
                  type="text"
                  placeholder="সর্বোচ্চ মারহালা লিখুন"
                  value={formData.yearlyInformtion.highestMarhala}
                  onChange={(e) => handleChange('yearlyInformtion', 'highestMarhala', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মাদরাসার ধরন</label>
                <select
                  value={formData.yearlyInformtion.madrasahType}
                  onChange={(e) => handleChange('yearlyInformtion', 'madrasahType', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="">মাদরাসার ধরন নির্বাচন করুন</option>
                  <option value="ফুল মাদরাসা">ফুল মাদরাসা</option>
                  <option value="নূরানী মাদরাসা">নূরানী মাদরাসা</option>
                  <option value="হাফেজী মাদরাসা">হাফেজী মাদরাসা</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মোট ছাত্র সংখ্যা</label>
                <input
                  type="number"
                  placeholder="মোট ছাত্র সংখ্যা লিখুন"
                  value={formData.yearlyInformtion.totalStudent}
                  onChange={(e) => handleChange('yearlyInformtion', 'totalStudent', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মোট শিক্ষক ও কর্মচারী</label>
                <input
                  type="number"
                  placeholder="মোট শিক্ষক ও কর্মচারী সংখ্যা"
                  value={formData.yearlyInformtion.totalTeacherAndStaff}
                  onChange={(e) => handleChange('yearlyInformtion', 'totalTeacherAndStaff', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">ঠিকানার তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">বিভাগ</label>
                <select
                  value={formData.location.division}
                  onChange={(e) => handleChange('location', 'division', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  <option value="ঢাকা">ঢাকা</option>
                  <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                  <option value="রাজশাহী">রাজশাহী</option>
                  <option value="খুলনা">খুলনা</option>
                  <option value="বরিশাল">বরিশাল</option>
                  <option value="সিলেট">সিলেট</option>
                  <option value="রংপুর">রংপুর</option>
                  <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">জেলা</label>
                <input
                  type="text"
                  placeholder="জেলার নাম লিখুন"
                  value={formData.location.distric}
                  onChange={(e) => handleChange('location', 'distric', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">গ্রাম/মহল্লা</label>
                <input
                  type="text"
                  placeholder="গ্রাম/মহল্লার নাম লিখুন"
                  value={formData.location.village}
                  onChange={(e) => handleChange('location', 'village', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ডাকঘর</label>
                <input
                  type="text"
                  placeholder="ডাকঘরের নাম লিখুন"
                  value={formData.location.postOffice}
                  onChange={(e) => handleChange('location', 'postOffice', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">হোল্ডিং নম্বর</label>
                <input
                  type="text"
                  placeholder="হোল্ডিং নম্বর লিখুন"
                  value={formData.location.holdingNumber}
                  onChange={(e) => handleChange('location', 'holdingNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">থানা</label>
                <input
                  type="text"
                  placeholder="থানার নাম লিখুন"
                  value={formData.location.policeStation}
                  onChange={(e) => handleChange('location', 'policeStation', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Muhtamim Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">মুহতামিমের তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">মুহতামিমের নাম</label>
                <input
                  type="text"
                  placeholder="মুহতামিমের নাম লিখুন"
                  value={formData.muhtamim.muhtamimName}
                  onChange={(e) => handleChange('muhtamim', 'muhtamimName', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">জাতীয় পরিচয়পত্র নম্বর</label>
                <input
                  type="text"
                  placeholder="এনআইডি নম্বর লিখুন"
                  value={formData.muhtamim.muhtamimNID}
                  onChange={(e) => handleChange('muhtamim', 'muhtamimNID', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isLoading ? 'প্রক্রিয়াকরণ চলছে...' : 'নিবন্ধন সম্পন্ন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
