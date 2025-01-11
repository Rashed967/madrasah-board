'use client';

import { useState } from 'react';
import { 
  MdPhone, 
  MdEmail, 
  MdLocationOn, 
  MdSchool, 
  MdPerson, 
  MdCalendarToday,
  MdAssignment,
  MdGrade,
  MdBadge,
  MdFingerprint
} from 'react-icons/md';
import Image from 'next/image';

// This will be replaced with actual API call
const getExamineeData = (id: string) => ({
  id,
  name: {
    bn: 'মোঃ আব্দুল করিম',
    ar: 'محمد عبد الكريم',
    en: 'Md. Abdul Karim'
  },
  fatherName: {
    bn: 'মোঃ আব্দুল রহিম',
    ar: 'محمد عبد الرحيم',
    en: 'Md. Abdul Rahim'
  },
  dateOfBirth: '১৫ জানুয়ারি, ১৯৯৫',
  nidOrBirthCertNo: '১২৩৪৫৬৭৮৯০',
  profilePicture: '', // Empty for testing no-image scenario
  phone: '+880 1712-345678',
  email: 'abdulkarim@example.com',
  address: 'মিরপুর-১০, ঢাকা-১২১৬',
  marhala: 'মুতাওয়াস্সিতাহ প্রথম বর্ষ',
  kitab: 'নাহুল বালাগাহ',
  education: {
    degree: 'কামিল',
    institution: 'আল-জামিয়া আল-ইসলামিয়া',
    passingYear: '২০২০'
  },
  examHistory: [
    {
      examName: 'নাহুল বালাগাহ প্রথম পত্র',
      date: '১৫ জানুয়ারি, ২০২৪',
      marks: '৮৫',
      totalMarks: '১০০',
      grade: 'A+',
      status: 'passed'
    },
    {
      examName: 'নাহুল বালাগাহ দ্বিতীয় পত্র',
      date: '১০ ডিসেম্বর, ২০২৩',
      marks: '৯০',
      totalMarks: '১০০',
      grade: 'A+',
      status: 'passed'
    }
  ],
  registrationDate: '১ জানুয়ারি, ২০২৩'
});

export default function ExamineeProfile({ params }: { params: { id: string } }) {
  const [examinee] = useState(() => getExamineeData(params.id));

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#52b788] to-[#40916c]" />
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              {examinee.profilePicture ? (
                <Image
                  src={examinee.profilePicture}
                  alt={examinee.name.bn}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-[#52b788]/10 flex items-center justify-center">
                  <MdPerson className="w-16 h-16 text-[#52b788]" />
                </div>
              )}
              <div className="mt-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900">{examinee.name.bn}</h1>
                <div className="flex items-center gap-2 text-[#52b788] mt-2">
                  <MdSchool className="w-5 h-5" />
                  <span>জামিয়া আরাবিয়া ইসলামিয়া</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">ব্যক্তিগত তথ্য</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">নাম (বাংলা)</label>
                <p className="font-medium">{examinee.name.bn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">নাম (আরবী)</label>
                <p className="font-medium text-xl">{examinee.name.ar}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">নাম (ইংরেজী)</label>
                <p className="font-medium">{examinee.name.en}</p>
              </div>
              <div className="pt-4">
                <label className="text-sm text-gray-500">মারহালা</label>
                <p className="font-medium">{examinee.marhala}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">পিতার নাম (বাংলা)</label>
                <p className="font-medium">{examinee.fatherName.bn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">পিতার নাম (আরবী)</label>
                <p className="font-medium text-xl">{examinee.fatherName.ar}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">পিতার নাম (ইংরেজী)</label>
                <p className="font-medium">{examinee.fatherName.en}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">অতিরিক্ত তথ্য</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
                  <MdCalendarToday className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">জন্ম তারিখ</div>
                  <div className="font-medium">{examinee.dateOfBirth}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
                  <MdFingerprint className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">জন্ম নিবন্ধন / জাতীয় পরিচয় পত্র নাম্বার</div>
                  <div className="font-medium">{examinee.nidOrBirthCertNo}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">যোগাযোগের তথ্য</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
                  <MdPhone className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">ফোন নম্বর</div>
                  <div>{examinee.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
                  <MdEmail className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">ইমেইল</div>
                  <div>{examinee.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
                  <MdLocationOn className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">ঠিকানা</div>
                  <div>{examinee.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Results */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-lg font-semibold">পরীক্ষার ফলাফল</h2>
            
            {/* Exam Filter */}
            <div className="mt-4 sm:mt-0">
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent bg-white"
                onChange={(e) => {
                  // Here you would typically update the selected exam in state
                  console.log('Selected exam:', e.target.value);
                }}
              >
                <option value="কেন্দ্রীয়_পরীক্ষা_১৪৪৬_হি">কেন্দ্রীয় পরীক্ষা ১৪৪৬ হি.</option>
                <option value="অর্ধ-বার্ষিক_পরীক্ষা_১৪৪৬_হি">অর্ধ-বার্ষিক পরীক্ষা ১৪৪৬ হি.</option>
                <option value="বার্ষিক_পরীক্ষা_১৪৪৫_হি">বার্ষিক পরীক্ষা ১৪৪৫ হি.</option>
              </select>
            </div>
          </div>

          {/* Current Exam Info */}
          <div className="mb-6 bg-[#52b788]/5 rounded-lg p-4 border border-[#52b788]/20">
            <div>
              <h3 className="font-medium text-[#52b788]">কেন্দ্রীয় পরীক্ষা ১৪৪৬ হি.</h3>
              <p className="text-sm text-gray-600 mt-1">মুতাওয়াস্সিতাহ প্রথম বর্ষ</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#52b788] text-white">
                  <th className="border px-4 py-2 text-left">কিতাবের নাম</th>
                  <th className="border px-4 py-2 text-center">প্রাপ্ত নম্বর</th>
                  <th className="border px-4 py-2 text-center">পূর্ণ নম্বর</th>
                  <th className="border px-4 py-2 text-center">গ্রেড</th>
                </tr>
              </thead>
              <tbody>
                {/* Example data for different exams */}
                {(() => {
                  const examData = {
                    'কেন্দ্রীয়_পরীক্ষা_১৪৪৬_হি': {
                      marhala: 'মুতাওয়াস্সিতাহ প্রথম বর্ষ',
                      results: [
                        { name: 'তাহযীবুল ইসলাম ৪র্থ খন্ড', marks: 85 },
                        { name: 'তাইসীরুল মুবতাদী ও ফারসী পড়েছি', marks: 78 },
                        { name: 'উর্দু সি চেতনা কিতাব', marks: 82 },
                        { name: 'এসো আরবী শিখি', marks: 90 },
                        { name: 'ইংরেজী ও আমার', marks: 75 },
                        { name: 'বাংলা (আমার বাংলা বই পার্ট)', marks: 88 },
                        { name: 'গণিত', marks: 70 },
                        { name: 'ইতিহাস পাঠ', marks: 92 },
                        { name: 'ভূগোল ও সমাজ', marks: 86 }
                      ]
                    },
                    'অর্ধ-বার্ষিক_পরীক্ষা_১৪৪৬_হি': {
                      marhala: 'মুতাওয়াস্সিতাহ দ্বিতীয় বর্ষ',
                      results: [
                        { name: 'আল-আখলাক', marks: 88 },
                        { name: 'আল-ফিকহ', marks: 92 },
                        { name: 'আন-নাহু', marks: 85 },
                        { name: 'আস-সরফ', marks: 78 },
                        { name: 'আল-আদাব', marks: 90 },
                        { name: 'আল-ইনশা', marks: 82 },
                        { name: 'বাংলা সাহিত্য', marks: 88 },
                        { name: 'ইংরেজি', marks: 75 },
                        { name: 'গণিত', marks: 80 }
                      ]
                    },
                    'বার্ষিক_পরীক্ষা_১৪৪৫_হি': {
                      marhala: 'মুতাওয়াস্সিতাহ তৃতীয় বর্ষ',
                      results: [
                        { name: 'আল-হাদীস', marks: 95 },
                        { name: 'উসূলুল ফিকহ', marks: 88 },
                        { name: 'আল-মানতিক', marks: 82 },
                        { name: 'বালাগাত', marks: 85 },
                        { name: 'আরবী সাহিত্য', marks: 90 },
                        { name: 'ফারসী', marks: 78 },
                        { name: 'উর্দু', marks: 85 },
                        { name: 'বাংলা', marks: 92 },
                        { name: 'ইংরেজি', marks: 84 }
                      ]
                    }
                  };

                  const currentExam = 'কেন্দ্রীয়_পরীক্ষা_১৪৪৬_হি'; // This would come from state
                  const examInfo = examData[currentExam];
                  const results = examInfo.results;

                  return results.map((subject, index) => {
                    let grade = '';
                    let gradeColor = '';
                    
                    if (subject.marks >= 80) {
                      grade = 'ممتاز';
                      gradeColor = 'text-[#52b788]';
                    } else if (subject.marks >= 65) {
                      grade = 'جيد جداً';
                      gradeColor = 'text-[#52b788]/70';
                    } else {
                      grade = 'جيد';
                      gradeColor = 'text-[#52b788]/40';
                    }

                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="border px-4 py-3">{subject.name}</td>
                        <td className="border px-4 py-3 text-center font-medium">{subject.marks}</td>
                        <td className="border px-4 py-3 text-center">১০০</td>
                        <td className={`border px-4 py-3 text-center font-medium ${gradeColor}`}>
                          {grade}
                        </td>
                      </tr>
                    );
                  });
                })()}
                <tr className="bg-gray-50 font-medium">
                  <td className="border px-4 py-3">সর্বমোট</td>
                  <td className="border px-4 py-3 text-center">
                    {(() => {
                      const examData = {
                        'কেন্দ্রীয়_পরীক্ষা_১৪৪৬_হি': [85, 78, 82, 90, 75, 88, 70, 92, 86],
                        'অর্ধ-বার্ষিক_পরীক্ষা_১৪৪৬_হি': [88, 92, 85, 78, 90, 82, 88, 75, 80],
                        'বার্ষিক_পরীক্ষা_১৪৪৫_হি': [95, 88, 82, 85, 90, 78, 85, 92, 84]
                      };
                      const currentExam = 'কেন্দ্রীয়_পরীক্ষা_১৪৪৬_হি'; // This would come from state
                      return examData[currentExam].reduce((a, b) => a + b, 0);
                    })()}
                  </td>
                  <td className="border px-4 py-3 text-center">৯০০</td>
                  <td className="border px-4 py-3 text-center text-[#52b788]">ممتاز</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Registration Date */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center gap-2 text-gray-600">
          <MdCalendarToday className="w-5 h-5 text-[#52b788]" />
          <span>রেজিস্ট্রেশনের তারিখ: {examinee.registrationDate}</span>
        </div>
      </div>
    </div>
  );
}
