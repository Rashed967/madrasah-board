import { ApiResponse, get, patch, post } from "@/core/api/apiService";
import  IExam  from "@/features/exam/exam.interface";

export const createExam = async (examData: IExam) => {
  try {
    const response = await post<IExam>('/exams', examData);
    console.log(' Create Response:', response);
    return {
      success: true as const,
      message: response.message,
      data: response.data
    };
  } catch (error:any) {
    return {
      success: false,
      error:error?.response?.data?.message || 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে',
    };
  }
};

const getExams= async () => {
  try {
    const response = await get<IExam[]>('/exams');
    return {
      success: true,
      data: response.data,
      message: 'Exams retrieved successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to get exams'
    };
  }
};

const getAllExamForPreRegistration= async () => {
  try {
    const response = await get<IExam[]>('/exams?fields=examName,preRegistrationFee,examFeeForBoys,examFeeForGirls,registrationStartNumber, currentRegistrationNumber');
    return {
      success: true,
      data: response.data,
      message: 'Exams retrieved successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to get exams'
    };
  }
};


export const examServices = {
  createExam,
  getExams,
  getAllExamForPreRegistration
};