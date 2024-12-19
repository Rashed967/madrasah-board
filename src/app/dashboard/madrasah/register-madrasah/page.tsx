'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

export default function RegisterMadrasah() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const  [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    communicatorName: '',
    communicatorContactNo: '',
    zone: '',
    email: '',
    nameInArabic: '',
    nameInBangla: '',
    nameInEnglish: '',
    highestMarhala: '',
    totalStudent: '',
    totalTeacherAndStaff: '',
    madrasahType: '',
    muhtamimName: '',
    muhtamimNID: '',
    year: '',
    distric: '',
    division: '',
    holdingNumber: '',
    policeStation: '',
    postOffice: '',
    village: '',
    courierOption: '',
    logo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      nameInBangla: 'মাদরাসার বাংলা নাম',
      communicatorName: 'যোগাযোগকারীর নাম',
      communicatorContactNo: 'যোগাযোগকারীর মোবাইল নম্বর',
      division: 'বিভাগ',
      distric: 'জেলা',
      village: 'গ্রাম/মহল্লা'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`অনুগ্রহ করে নিম্নলিখিত তথ্য পূরণ করুন:\n${missingFields.join('\n')}`);
      return;
    }

    // Validate logo size (300KB)
    if (formData.logo && formData.logo.size > 300 * 1024) {
      toast.error('লোগোর সাইজ ৩০০ কেবি এর বেশি হতে পারবে না');
      return;
    }

    setIsLoading(true);
    
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/madrasah/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': process.env.NEXT_PUBLIC_API_TOKEN as string,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setSuccessMessage(data.message);

      if (response.ok) {
        setShowSuccessModal(true);
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push('/dashboard/madrasah/register-madrasah');
        }, 3000);
      } else {
        toast.error(data.message || 'কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-4 mt-12">
      <div className="w-full md:w-[80%] mx-auto">
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
                  value={formData.nameInArabic}
                  onChange={(e) => handleChange('nameInArabic', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">বাংলা নাম</label>
                <input
                  type="text"
                  placeholder="বাংলা নাম লিখুন"
                  value={formData.nameInBangla}
                  onChange={(e) => handleChange('nameInBangla', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ইংরেজি নাম</label>
                <input
                  type="text"
                  placeholder="ইংরেজি নাম লিখুন"
                  value={formData.nameInEnglish}
                  onChange={(e) => handleChange('nameInEnglish', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">যোগাযোগ বিষয়ক তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">যোগাযোগকারীর নাম</label>
                <input
                  type="text"
                  placeholder="নাম লিখুন"
                  value={formData.communicatorName}
                  onChange={(e) => handleChange('communicatorName', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">যোগাযোগকারীর মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="মোবাইল নম্বর লিখুন"
                  value={formData.communicatorContactNo}
                  onChange={(e) => handleChange('communicatorContactNo', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ইমেইল</label>
                <input
                  type="email"
                  placeholder="ইমেইল লিখুন"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Madrasah Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">মাদ্রাসার সার্বিক তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">সর্বোচ্চ মারহালা</label>
                <input
                  type="text"
                  placeholder="সর্বোচ্চ মারহালা লিখুন"
                  value={formData.highestMarhala}
                  onChange={(e) => handleChange('highestMarhala', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মাদরাসার ধরণ</label>
                <select
                  value={formData.madrasahType}
                  onChange={(e) => handleChange('madrasahType', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="">মাদরাসার ধরণ নির্বাচন করুন</option>
                  <option value="BOY">বালক</option>
                  <option value="GIRL">বালিকা</option>
                  <option value="CO-ED">উভয়</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মোট ছাত্র সংখ্যা</label>
                <input
                  type="number"
                  placeholder="মোট ছাত্র সংখ্যা লিখুন"
                  value={formData.totalStudent}
                  onChange={(e) => handleChange('totalStudent', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">মোট শিক্ষক ও কর্মচারী</label>
                <input
                  type="number"
                  placeholder="মোট শিক্ষক ও কর্মচারী সংখ্যা"
                  value={formData.totalTeacherAndStaff}
                  onChange={(e) => handleChange('totalTeacherAndStaff', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">ঠিকানার তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">বিভাগ</label>
                <select
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
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
                  value={formData.distric}
                  onChange={(e) => handleChange('distric', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">জোন</label>
                <input
                  type="text"
                  placeholder="জোন নম্বর লিখুন"
                  value={formData.zone}
                  onChange={(e) => handleChange('zone', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">গ্রাম/মহল্লা</label>
                <input
                  type="text"
                  placeholder="গ্রাম/মহল্লার নাম লিখুন"
                  value={formData.village}
                  onChange={(e) => handleChange('village', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ডাকঘর</label>
                <input
                  type="text"
                  placeholder="ডাকঘরের নাম লিখুন"
                  value={formData.postOffice}
                  onChange={(e) => handleChange('postOffice', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">হোল্ডিং নম্বর</label>
                <input
                  type="text"
                  placeholder="হোল্ডিং নম্বর লিখুন"
                  value={formData.holdingNumber}
                  onChange={(e) => handleChange('holdingNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">থানা</label>
                <input
                  type="text"
                  placeholder="থানার নাম লিখুন"
                  value={formData.policeStation}
                  onChange={(e) => handleChange('policeStation', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">কুরিয়ার অপশন</label>
                <select
                  value={formData.courierOption}
                  onChange={(e) => handleChange('courierOption', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="">কুরিয়ার নির্বাচন করুন</option>
                  <option value="SA Paribahan">এস এ পরিবহন</option>
                  <option value="Sundarban">সুন্দরবন</option>
                </select>
              </div>
            </div>
          </div>

          {/* Muhtamim Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">মুহতামিমের তথ্য</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">মুহতামিমের নাম</label>
                <input
                  type="text"
                  placeholder="মুহতামিমের নাম লিখুন"
                  value={formData.muhtamimName}
                  onChange={(e) => handleChange('muhtamimName', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">এনআইডি নম্বর</label>
                <input
                  type="text"
                  placeholder="এনআইডি নম্বর লিখুন"
                  value={formData.muhtamimNID}
                  onChange={(e) => handleChange('muhtamimNID', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">দায়িত্বভার গ্রহণের সন</label>
                <input
                  type="number"
                  placeholder="দায়িত্বভার গ্রহণের সন লিখুন"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">লোগো আপলোড</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">মাদরাসার লোগো</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  formEncType="multipart/form-data"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData(prev => ({ ...prev, logo: file }));
                  }}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  সর্বোচ্চ সাইজঃ ৩০০ কেবি
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 text-base font-medium text-white shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[600px]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <ClipLoader size={20} color="#ffffff" />
                  <span>প্রক্রিয়াজাত হচ্ছে...</span>
                </div>
              ) : (
                'জমা দিন'
              )}
            </button>
          </div>

          {/* Success Modal */}
          <Dialog
            open={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-2xl transform transition-all">
                <div className="flex flex-col items-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-bounce">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <Dialog.Title className="mt-6 text-2xl font-bold text-gray-900">
                  {successMessage}
                  </Dialog.Title>
                  <Dialog.Description className="mt-3 text-lg text-gray-500 text-center">
                    মাদরাসা নিবন্ধন সফলভাবে সম্পন্ন হয়েছে। আপনি ড্যাশবোর্ডে রিডাইরেক্ট হবেন।
                  </Dialog.Description>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      router.push('/dashboard/madrasah');
                    }}
                    className="mt-6 w-full rounded-md bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </form>
      </div>
    </div>
  );
}
