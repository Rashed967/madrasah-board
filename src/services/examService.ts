import { ApiResponse, get, patch, post } from '@/core/api/apiService'
import IExam from '@/features/exam/exam.interface'

export const createExam = async (examData: IExam) => {
  try {
    const response = await post<IExam>('/exams', examData)
    if (response.success) {
      return {
        success: true,
        message: response.message,
        data: response.data
      }
    }
    return {
      success: false,
      message: response.message,
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে',
    }
  }
}

const getExams = async () => {
  try {
    const response = await get<IExam[]>('/exams')
    return {
      success: true,
      data: response.data,
      message: 'Exams retrieved successfully'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to get exams'
    }
  }
}

const getAllExamForPreRegistration = async (queryParams: string) => {
  try {
    const response = await get<IExam[]>(
      `/exams?${queryParams}`
    )
    return {
      success: true,
      data: response.data,
      message: 'Exams retrieved successfully'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to get exams'
    }
  }
}

export const getAllExamsForSearch = async (queryParams?: string) => {
  try {
    const response = await get(
      `/exams/for-search?${queryParams}`
    )
    return {
      success: true,
      data: response.data,
      message: response.message
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to get exams'
    }
  }
}

// toggle exam isCompleted Value -> exams/67bb4f053d90894210c1d743/toggle-completion
export const toggleIsCompleted = async (id: string) => {
  try {
    const response = await patch<ApiResponse<IExam>>(
      `/exams/${id}/toggle-completion`
    )
    return {
      success: true,
      message: response.message,
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to update isCompleted'
    }
  }
}

export const examServices = {
  createExam,
  getExams,
  getAllExamForPreRegistration,
  toggleIsCompleted
}
