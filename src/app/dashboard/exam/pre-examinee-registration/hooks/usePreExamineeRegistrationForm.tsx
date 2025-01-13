import { useState, useEffect } from 'react';
import { madrasahServices } from '@/services/madrasahService';
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService';
import marhalaNames from '@/data/marhala.names';
import globalValidateRequest from '@/middleware/globalValidateRequest';
import IExam from '@/features/exam/exam.interface';
import { IMadrasah } from '@/features/madrasah/interfaces';
import { TransactionValidationSchemas } from '@/features/transaction/transaction.validation';
import { boolean } from 'zod';
import { examServices } from '@/services/examService';
import { PreExamineeRegistrationValidation } from '@/features/preExamineeRegistration/validation';

// Initial form state
const initialFormState = {
  exam: '',
  madrasah: '',
  examineesPerMahala: marhalaNames.map(marhalaName => ({
    marhalaName,
    totalExamineesSlots: 0,
    startingRegistrationNumber: 0,
    endingRegistrationNumber: 0
  })),
  totalFeesAmount: 0,
  transactionDetails: {
    amount: 0,
    transactionType: 'income',
    transactionCategory: 'examFee',
    description: '',
    paymentMethod: ''
  }
};

export const usePreExamineeRegistrationForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState<IExam[]>([]);
  const [madrasahs, setMadrasahs] = useState<IMadrasah[]>([]);
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

  // Fetch exams and madrasahs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsResponse, madrasahsResponse] = await Promise.all([
          examServices.getExams(),
          madrasahServices.getMadrasahs()
        ]);

        if (examsResponse.success) {
          setExams(examsResponse.data);
        }
        if (madrasahsResponse.success) {
          setMadrasahs(madrasahsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleExamineeCountChange = (marhalaIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => {
      const updatedExamineesPerMahala = [...prev.examineesPerMahala];
      const currentMarhala = updatedExamineesPerMahala[marhalaIndex];
      
      // Get the previous marhala's ending number (if exists)
      const previousEndingNumber = marhalaIndex > 0 
        ? updatedExamineesPerMahala[marhalaIndex - 1].endingRegistrationNumber
        : 1000; // Starting from 1000 for the first marhala
      
      // Update current marhala
      updatedExamineesPerMahala[marhalaIndex] = {
        ...currentMarhala,
        totalExamineesSlots: numValue,
        startingRegistrationNumber: previousEndingNumber + 1,
        endingRegistrationNumber: previousEndingNumber + numValue
      };

      // Update subsequent marhalas' numbers
      for (let i = marhalaIndex + 1; i < updatedExamineesPerMahala.length; i++) {
        const prevMarhala = updatedExamineesPerMahala[i - 1];
        updatedExamineesPerMahala[i] = {
          ...updatedExamineesPerMahala[i],
          startingRegistrationNumber: prevMarhala.endingRegistrationNumber + 1,
          endingRegistrationNumber: prevMarhala.endingRegistrationNumber + (updatedExamineesPerMahala[i].totalExamineesSlots || 0)
        };
      }

      return {
        ...prev,
        examineesPerMahala: updatedExamineesPerMahala
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate registration details
      const registrationErrors = globalValidateRequest(
        PreExamineeRegistrationValidation.createPreExamineeRegistrationValidationSchema,
        {
          exam: formData.exam === 'select' ? '' : formData.exam,
          madrasah: formData.madrasah === 'select' ? '' : formData.madrasah,
          examineesPerMahala: formData.examineesPerMahala,
          totalFeesAmount: formData.totalFeesAmount
        }
      );

      // Validate transaction details
      const transactionErrors = globalValidateRequest(
        TransactionValidationSchemas.createTransactionValidationSchema,
        formData.transactionDetails
      );

      const combinedErrors = { ...registrationErrors, ...transactionErrors };

      if (Object.keys(combinedErrors).length > 0) {
        setErrors(combinedErrors);
        setIsSubmitting(false);
        return;
      }

      // Submit to server
      const response = await preExamineeRegistrationServices.createPreExamineeRegistration({
        preExaminneRegistrationDetails: {
          exam: formData.exam,
          madrasah: formData.madrasah,
          examineesPerMahala: formData.examineesPerMahala,
          totalFeesAmount: formData.totalFeesAmount
        },
        transactionDetails: formData.transactionDetails
      });

      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল',
          message: response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন সফলভাবে সম্পন্ন হয়েছে'
        });
        setFormData(initialFormState);
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'পরীক্ষার্থী প্রি-নিবন্ধন করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    statusDialog,
    handleChange,
    handleExamineeCountChange,
    handleSubmit,
    setStatusDialog,
    exams,
    madrasahs,
    isLoading
  };
};
