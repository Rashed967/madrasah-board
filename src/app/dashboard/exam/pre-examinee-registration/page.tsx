"use client"

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDialog } from "@/components/ui/status-dialog";
import { IoAddCircle } from "react-icons/io5";
import { useCallback, useEffect, useMemo, useState } from "react";
import { examServices } from "@/services/examService";
import { PreExamineeRegistrationValidation } from "@/features/preExamineeRegistration/validation";
import globalValidateRequest from "@/middleware/globalValidateRequest";
import { preExamineeRegistrationServices } from "@/services/preExamineeRegistrationService";
import { usePreExamineeForm } from "@/hooks/usePreExamineeForm";
import { useStatusDialog } from "@/hooks/useStatusDialog";
import { ExamType, PreExamineeRegistrationData } from "@/types/preExaminee.types";

// Dynamically import components
const ExamSelection = dynamic(
  () => import('@/components/pre-examinee/ExamSelection').then(mod => mod.default), 
  { loading: () => <div className="h-10 bg-gray-100 animate-pulse rounded-md" /> }
);

const MadrasahSearch = dynamic(
  () => import('@/components/pre-examinee/MadrasahSearch').then(mod => mod.default),
  { loading: () => <div className="h-20 bg-gray-100 animate-pulse rounded-md" /> }
);

const MarhalaRegistrationTable = dynamic(
  () => import('@/components/pre-examinee/MarhalaRegistrationTable').then(mod => mod.default),
  { loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-md" /> }
);

const TransactionForm = dynamic(
  () => import('@/components/pre-examinee/TransactionForm').then(mod => mod.default),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" /> }
);

export default function PreExamineeRegistrationPage() {
  const [exams, setExams] = useState([]);
  const [selectedExamDetails, setSelectedExamDetails] = useState<ExamType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { statusDialog, showSuccessDialog, showErrorDialog, closeDialog } = useStatusDialog();

  const {
    formData,
    setFormData,
    searchTerm,
    searchResults,
    showDropdown,
    handleSearch,
    handleMadrasahSelect,
    handleExamineeCountChange,
    handleTransactionChange
  } = usePreExamineeForm(selectedExamDetails);

  // fetch all exams from database
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examServices.getAllExamForPreRegistration();
        setExams(response.data);
      } catch (error) {
        console.error("পরীক্ষা ডাটা লোড করতে সমস্যা হয়েছে");
        showErrorDialog("পরীক্ষা ডাটা লোড করতে সমস্যা হয়েছে");
      }
    };
    fetchExams();
  }, [showErrorDialog]);

  const handleExamChange = useCallback((value: string) => {
    const examDetails = exams.find(exam => exam._id === value);
    if (examDetails) {
      setSelectedExamDetails(examDetails);
      setFormData(prev => ({
        ...prev,
        exam: value
      }));
    }
  }, [exams, setFormData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const modifiedFromData: PreExamineeRegistrationData = {
      preExaminneRegistrationDetails: {
        exam: formData.exam,
        madrasah: formData.madrasah,
        examineesPerMahala: formData.examineesPerMahala,
        totalFeesAmount: formData.totalFeesAmount
      },
      transactionDetails: formData.transactionDetails,
    };
    
    const validationErrors = globalValidateRequest(
      PreExamineeRegistrationValidation.createPreExamineeRegistrationValidationSchema,
      modifiedFromData
    );

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors);
      showErrorDialog(errorMessages.flat().join(', '));
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await preExamineeRegistrationServices.create(modifiedFromData);
      if (response.success) {
        showSuccessDialog(response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করা হয়েছে');
      }
    } catch (error: any) {
      showErrorDialog(error?.response?.data?.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, showSuccessDialog, showErrorDialog]);

  const totalExaminees = useMemo(() => 
    formData.examineesPerMahala.reduce(
      (sum, marhala) => sum + (marhala.totalExamineesSlots || 0), 
      0
    ), 
    [formData.examineesPerMahala]
  );

  return (
    <div className="container max-w-4xl mx-auto mt-8 px-4 text-gray-800">
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={closeDialog}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">পরীক্ষার্থী প্রি-নিবন্ধন</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Select Exam component */}
              <ExamSelection 
                exams={exams}
                selectedExam={formData.exam}
                onExamChange={handleExamChange}
              />

              <div className="col-span-2">
                {/* Madrasah Search component */}
                <MadrasahSearch 
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  searchResults={searchResults}
                  showDropdown={showDropdown}
                  onMadrasahSelect={handleMadrasahSelect}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">মারহালা-ভিত্তিক নিবন্ধন সংখ্যা</h3>
              {/* MarhalaRegistrationTable component */}
              <MarhalaRegistrationTable 
                examineesPerMahala={formData.examineesPerMahala}
                onExamineeCountChange={handleExamineeCountChange}
                totalExaminees={totalExaminees}
                totalAmount={formData.totalFeesAmount}
              />
            </div>

            {/* TransactionForm component */}
            <TransactionForm 
              transactionDetails={formData.transactionDetails}
              onTransactionChange={handleTransactionChange}
            />

            {/* Submit button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                disabled={isSubmitting}
              >
                <IoAddCircle className="mr-2" />
                {isSubmitting ? 'প্রক্রিয়াধীন...' : 'নিবন্ধন করুন'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
