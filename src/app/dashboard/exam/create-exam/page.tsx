"use client"

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};



import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/forms/InputField";
import { StatusDialog } from "@/components/ui/status-dialog";
import marhalaNames from "@/data/marhala.names";
import IExam, { IExamFeeForExaminee } from "@/features/exam/exam.interface";
import globalValidateRequest from "@/middleware/globalValidateRequest";
import { ExamValidationSchemas } from "@/features/exam";
import { examServices } from "@/services/examService";
import { IoAddCircle } from "react-icons/io5";
import ExamName from "./components/examName";
import ExamDate from "./components/examDate";
import DateInputField from "@/components/forms/DateInputField";
import TextInputField from "@/components/forms/textInputField";
import NumberInputField from "@/components/forms/NumberInputField";
import ExamFees from "./components/examFeeForBoys";

// Initial form state
const initialFormState = {
  examName: "",
  startDate: "",
  endDate: "",
  registrationStartNumber: 0,
  preRegistrationFee: 0,
  examFeeForBoys: marhalaNames.map(marhala => ({ marhala, amount: 0 })),
  examFeeForGirls: marhalaNames.map(marhala => ({ marhala, amount: 0 }))
};

export default function CreateExamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof IExam];
        if (parentObj && typeof parentObj === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  // Handle fee change
  const handleFeeChange = (gender: 'Boys' | 'Girls', marhalaIndex: number, value: string) => {
    const field = `examFeeFor${gender}` as 'examFeeForBoys' | 'examFeeForGirls';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((fee, idx) => 
        idx === marhalaIndex ? { ...fee, amount: value } : fee
      )
    }));
  };


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const exam = {
      examName: formData.examName || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      registrationStartNumber: Number(formData.registrationStartNumber) || 0,
      preRegistrationFee: Number(formData.preRegistrationFee) || 0,
      examFeeForBoys: [] as IExamFeeForExaminee[],
      examFeeForGirls: [] as IExamFeeForExaminee[]
  };

    for (let i = 0; i < formData.examFeeForBoys.length; i++) {
      const marhala = formData.examFeeForBoys[i];
        marhala.amount = Number(marhala.amount) || 0;
        exam.examFeeForBoys.push(marhala);
    }

    for (let i = 0; i < formData.examFeeForGirls.length; i++) {
      const marhala = formData.examFeeForGirls[i];
        marhala.amount = Number(marhala.amount) || 0;
        exam.examFeeForGirls.push(marhala);
    }

    const validationErrors = globalValidateRequest(ExamValidationSchemas.createExamValidationSchema, exam);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Send data to server
      const response = await examServices.createExam(exam);
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল',
          message: response.message || 'পরীক্ষা সফলভাবে তৈরি করা হয়েছে'
        });
        // router.push("/dashboard/exam");
        return 
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে'
        });
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container  md:mx-6 lg:mx-8 mt-8">
      <Card className="bg-[#FBFBFB] md:mx-6 lg:mx-8">
        <CardHeader>
          <CardTitle className="text-md md:text-lg font-bold">নতুন পরীক্ষা তৈরি করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 ">
            {/* Basic Information Section */}
            <div className="space-y-4">

            {/* exam name and date section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* <InputField
                label="পরীক্ষার নাম"
                name="examName"
                value={formData.examName}
                onChange={handleChange}
                error={errors.examName}
              /> */}

              <TextInputField
                formData={formData}
                label="পরীক্ষার নাম"
                name="examName"
                onChange={handleChange}
                error={errors.examName}
              />

                <DateInputField
                  formData={formData}
                  label="শুরুর তারিখ"
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  error={errors.startDate}
                />

                <DateInputField
                  formData={formData}
                  label="শেষের তারিখ"
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  error={errors.endDate}
                />
                   </div>
    
            </div>

            {/* Registration Information Section */}
            <div className="space-y-4">
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <NumberInputField
                label="রেজিস্ট্রেশন শুরুর নম্বর"
                name="registrationStartNumber"
                type="number"
                value={formData.registrationStartNumber}
                onChange={handleChange}
                error={errors.registrationStartNumber}
              />

              <NumberInputField
                label="প্রি-রেজিস্ট্রেশন ফি"
                name="preRegistrationFee"
                type="number"
                value={formData.preRegistrationFee || 0}
                onChange={handleChange}
                error={errors.preRegistrationFee}
              />
             </div>
            </div>

            <hr  />

            {/* fees section div */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Boys Fee Section */}
            <div className="space-y-4 ">
              <h3 className="text-lg font-medium">ছাত্রদের পরীক্ষার ফি</h3>
              <div className="grid gap-4">
                {formData.examFeeForBoys.map((fee, index) => (
                  <div key={fee.marhala} className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-sm font-medium">{fee.marhala}</span>
                    <NumberInputField
                      label=""
                      name={`examFeeForBoys.${index}.amount`}
                      type="number"
                      value={fee.amount}
                      onChange={(e) => handleFeeChange('Boys', index, e.target.value)}
                      error={errors[`examFeeForBoys.${index}.amount`]}
                    />
                  </div>
                ))}
              </div>
            </div>


                <hr className="md:hidden" />
            {/* Girls Fee Section */}
            <div className="space-y-4 ">
              <h3 className="text-lg font-medium">ছাত্রীদের পরীক্ষার ফি</h3>
　　 　 　 　
              <div className="grid gap-4">
                {formData.examFeeForGirls.map((fee, index) => (
                  <div key={fee.marhala} className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-sm font-medium">{fee.marhala}</span>
                    <NumberInputField
                      label=""
                      name={`examFeeForGirls.${index}.amount`}
                      type="number"
                      value={fee.amount}
                      onChange={(e) => handleFeeChange('Girls', index, e.target.value)}
                      error={errors[`examFeeForGirls.${index}.amount`]}
                    />
                  </div>
                ))}
              </div>
            </div>
            </div>

            <div className="flex justify-center md:justify-end space-x-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#52B788] hover:bg-[#52B788]/70 text-white w-2/3 md:w-2/6 lg:w-1/4  mx:auto"
              >
                <IoAddCircle className="text-xl mr-2" />

                {isSubmitting ? "তৈরি করা হচ্ছে..." : "পরীক্ষা তৈরি করুন"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <StatusDialog 
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
          title={statusDialog.title}
          message={statusDialog.message}
          type={statusDialog.type}
      />
    </div>
  );
}