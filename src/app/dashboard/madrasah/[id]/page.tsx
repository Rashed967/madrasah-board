'use client';

import { MdLocationOn, MdPhone, MdEmail, MdPeople, MdSchool, MdCalendarToday, MdPerson, MdBook, MdStar, MdDomain } from 'react-icons/md';

// Demo data for a madrasah
const madrasahData = {
  name: 'জামিয়া আরাবিয়া ইসলামিয়া',
  establishedYear: '১৩৮৫ হিজরি',
  location: 'মিরপুর-১, ঢাকা-১২১৬',
  phone: '+৮৮০১৭১২৩৪৫৬৭৮',
  email: 'info@jamia-arabia.edu.bd',
  website: 'www.jamia-arabia.edu.bd',
  principalName: 'মাওলানা আব্দুল্লাহ আল-মাদানী',
  totalStudents: '১২০০+',
  totalTeachers: '৫০+',
  type: 'কওমি মাদরাসা',
  departments: [
    'হিফজুল কুরআন',
    'তাজবীদ ও কিরাআত',
    'হাদীস',
    'ফিকহ',
    'আরবী সাহিত্য',
    'ইসলামী দর্শন'
  ],
  courses: [
    { name: 'তাহফিজুল কুরআন', duration: '৩-৫ বছর', students: '৩০০+' },
    { name: 'ইবতিদাইয়্যাহ', duration: '৫ বছর', students: '২৫০+' },
    { name: 'মুতাওয়াস্সিতাহ', duration: '৩ বছর', students: '২০০+' },
    { name: 'সানাবিয়্যাহ', duration: '২ বছর', students: '১৫০+' },
    { name: 'ফাজিল', duration: '২ বছর', students: '১০০+' },
    { name: 'কামিল', duration: '২ বছর', students: '৫০+' }
  ],
  facilities: [
    { name: 'আধুনিক লাইব্রেরি', details: '১০,০০০+ বই সহ' },
    { name: 'কম্পিউটার ল্যাব', details: '২০টি কম্পিউটার' },
    { name: 'মসজিদ', details: '৫০০ মুসল্লির ধারণক্ষমতা' },
    { name: 'ছাত্রাবাস', details: '২০০ শিক্ষার্থীর জন্য' },
    { name: 'খেলার মাঠ', details: '৫ একর' },
    { name: 'ক্যাফেটেরিয়া', details: '১০০ আসন' }
  ],
  achievements: [
    { title: 'জাতীয় পর্যায়ে সেরা মাদরাসা পুরস্কার ২০২২', year: '২০২২' },
    { title: 'সর্বোচ্চ বোর্ড পরীক্ষার ফলাফল', year: '২০২১' },
    { title: 'আন্তর্জাতিক কুরআন প্রতিযোগিতায় চ্যাম্পিয়ন', year: '২০২০' }
  ],
  description: 'জামিয়া আরাবিয়া ইসলামিয়া একটি ঐতিহ্যবাহী ইসলামি শিক্ষা প্রতিষ্ঠান। এখানে ধর্মীয় শিক্ষার পাশাপাশি আধুনিক শিক্ষারও ব্যবস্থা রয়েছে। প্রতিষ্ঠানটি দীর্ঘদিন ধরে উচ্চমানের ইসলামি শিক্ষা প্রদান করে আসছে।'
};

export default function MadrasahDetailsPage() {
  return (
    <div className="container mx-auto mt-10 p-4 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#52b788] to-[#52b788]/70 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-4xl font-bold mb-2">{madrasahData.name}</h1>
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm">
              {madrasahData.type}
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-center max-w-3xl mx-auto">{madrasahData.description}</p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdCalendarToday className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">প্রতিষ্ঠাকাল</p>
              <p className="font-medium">{madrasahData.establishedYear}</p>
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
              <p className="font-medium">{madrasahData.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdPerson className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">মোট শিক্ষক</p>
              <p className="font-medium">{madrasahData.totalTeachers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdDomain className="w-6 h-6 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">বিভাগ সংখ্যা</p>
              <p className="font-medium">{madrasahData.departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">যোগাযোগের তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdLocationOn className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ঠিকানা</p>
              <p className="font-medium">{madrasahData.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
              <MdPhone className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ফোন</p>
              <p className="font-medium">{madrasahData.phone}</p>
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

      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">কোর্স সমূহ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {madrasahData.courses.map((course, index) => (
            <div key={index} className="p-4 rounded-lg border border-[#52b788]/20 bg-[#52b788]/5">
              <h3 className="font-medium text-[#52b788] mb-2">{course.name}</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">মেয়াদ: {course.duration}</p>
                <p className="text-sm text-gray-600">শিক্ষার্থী: {course.students}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">সুযোগ-সুবিধা</h2>
          <div className="space-y-4">
            {madrasahData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-[#52b788]/5">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center">
                  <MdStar className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{facility.name}</h3>
                  <p className="text-sm text-gray-600">{facility.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">অর্জন সমূহ</h2>
          <div className="space-y-4">
            {madrasahData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-[#52b788]/20">
                <div className="w-10 h-10 rounded-full bg-[#52b788]/10 flex items-center justify-center flex-shrink-0">
                  <MdStar className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-[#52b788] mt-1">{achievement.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
