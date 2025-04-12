"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IoSearch } from 'react-icons/io5';
import ExamSelectionForExamineeRegistrationPage from '@/components/examinee-registration/ExamSelectionForExamineeRegistrationPage';
import MadrasahSelectionForExamineeRegistration from '@/components/examinee-registration/MadrasahSelectionForExamineeRegistration';
import ExamineeRegistrationTable from '@/components/examinee-registration/ExamineeRegistrationTable';
import { getAllExams } from '@/actions/exam';
import axios from 'axios';

interface Exam {
  _id: string;
  examName: string;
  endRegistrationDate: string;
  registrationStartNumber: number;
  currentRegistrationNumber: number;
  registrationFeeForRegularStudent: number;
  registrationFeeForIrregularStudent: number;
  lateRegistrationFeeForRegularStudent: number;
  lateRegistrationFeeForIrregularStudent: number;
}

interface ExamResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Exam[];
}

const ExamineeRegistrationPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("access_token");
        
        const response = await axios.get<ExamResponse>(`${process.env.NEXT_PUBLIC_MAIN_URL}/exams`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        });
        
        if (response.data && response.data.success && response.data.data) {
          setExams(response.data.data);
        } else {
          setError("পরীক্ষার তথ্য পাওয়া যায়নি");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError("পরীক্ষার তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);


  // select madrasah with search 
  

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    console.log("Selected exam ID:", examId);
    // Here you can add additional logic when an exam is selected
  };

  return (
    <div className="container max-w-4xl mx-auto mt-8 px-4 text-gray-800">
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            পরীক্ষার্থী নিবন্ধন 
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Select Dropdown */}
              <ExamSelectionForExamineeRegistrationPage 
                exams={exams} 
                onExamSelect={handleExamSelect}
              />
              {/* Search Input with Button */}
              <MadrasahSelectionForExamineeRegistration />
            </div>
            
            {/* Table Component */}
            <ExamineeRegistrationTable />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ExamineeRegistrationPage;