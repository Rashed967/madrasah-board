import { useState } from 'react';
import { examServices } from '@/services/examService';
import { ExamValidationSchemas, IExamFeeForExaminee } from '@/features/exam';
import globalValidateRequest from '@/middleware/globalValidateRequest';
import marhalaNames from '@/data/marhala.names';
import IExam from '@/features/exam/exam.interface';

export const useExamForm = () => {
  const initialFormState = {
    examName: "",
    startDate: "",
    endDate: "",
    registrationStartNumber: 0,
    preRegistrationFee: 0,
    examFeeForBoys: marhalaNames.map(marhala => ({ marhala, amount: 0 })),
    examFeeForGirls: marhalaNames.map(marhala => ({ marhala, amount: 0 }))
  };

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


  // Your existing handleChange, handleFeeChange, and handleSubmit functions here

  return {
    formData,
    errors,
    isSubmitting,
    statusDialog,
    handleChange,
    handleFeeChange,
    handleSubmit,
    setStatusDialog
  };
};