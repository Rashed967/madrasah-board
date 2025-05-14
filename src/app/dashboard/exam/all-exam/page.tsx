"use client";
import React, { useEffect, useState } from 'react';
import { examServices } from '@/services/examService';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { convertToBengali } from '@/utils/convertToBengali';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AllExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      const response = await examServices.getAllExamForPreRegistration('');
      if (response.success) {
        setExams(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if(exams.length === 0) return <div className='min-h-screen flex justify-center items-center text-lg' >
    <p>কোন পরীক্ষা নেই</p>
  </div>


  return (
    <div className='m-6'>
      <div className='text-lg font-bold mb-4'>সকল পরীক্ষা</div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-scroll">
      <thead className="bg-[#52B788] text-white">
        <tr>
          <th className="py-2 px-4 border-b font-normal text-sm">পরীক্ষার নাম</th>
          <th className="py-2 px-4 border-b font-normal text-sm">নিবন্ধন শেষ তাং</th>
          <th className="py-2 px-4 border-b font-normal text-sm">শুরুর রেজিস্ট্রেশন নং</th>
          <th className="py-2 px-4 border-b font-normal text-sm">বর্তমান রেজিস্ট্রেশন নং</th>
          <th className="py-2 px-4 border-b font-normal text-sm">নিবন্ধন ফি (নিয়মিত)</th>
          <th className="py-2 px-4 border-b font-normal text-sm">নিবন্ধন ফি (অনিয়মিত)</th>
          <th className="py-2 px-4 border-b font-normal text-sm">এ্যাকশন</th>
        </tr>
      </thead>

      <tbody>
        
        {exams.map((exam) => (
          <tr key={exam._id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b text-center">{exam.examName}</td>
            <td className="py-2 px-4 border-b text-center">{new Date(exam.endRegistrationDate).toLocaleDateString('bn-BD')}</td>
            <td className="py-2 px-4 border-b text-center">{convertToBengali(exam?.registrationStartNumber)}</td>
            <td className="py-2 px-4 border-b text-center">{convertToBengali(exam?.currentRegistrationNumber)}</td>
            <td className="py-2 px-4 border-b text-center">{convertToBengali(exam?.registrationFeeForRegularStudent)}</td>
            <td className="py-2 px-4 border-b text-center">{convertToBengali(exam?.registrationFeeForIrregularStudent)}</td>
            <td className="py-2 px-4 border-b text-center">
              <button
                onClick={async () => {
                  await examServices.toggleIsCompleted(exam._id);
                  const response = await examServices.getAllExamForPreRegistration('');
                  if (response.success) {
                    setExams(response.data);
                  }
                }}
                className="text-blue-500"
              >
                {exam.isCompleted ? <FaLock /> : <FaUnlock />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default AllExamsPage;
