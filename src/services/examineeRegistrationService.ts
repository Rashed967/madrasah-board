import { ApiResponse, post, get, del } from '@/core/api/apiService'
import IRegesteredExaminee from '@/features/examineeRegistration/ExamineeRegistration.interface'
// import { IRegesteredExaminee } from '@/features/ExamineeRegistration/ExamineeRegistration.interface'

type ExamineeListResponse = {
  data: IRegesteredExaminee[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export const examineeRegistrationService = {
  create: async (data: Partial<IRegesteredExaminee>) => {
    try {
      const response = await post<IRegesteredExaminee>('/regestered-examinees', data)
      return {
        success: true,
        data: response.data,
        message: response.message || 'পরীক্ষার্থী নিবন্ধন সফল হয়েছে'
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'পরীক্ষার্থী নিবন্ধন করতে সমস্যা হয়েছে'
      }
    }
  },

  getAll: async (page: number = 1, limit: number = 10): Promise<ApiResponse<ExamineeListResponse>> => {
    try {
      const response = await get<ExamineeListResponse>(`/regestered-examinees?page=${page}&limit=${limit}`)
      return response
    } catch (error: any) {
      return {
        success: false,
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.message || 'পরীক্ষার্থী তালিকা পেতে সমস্যা হয়েছে',
        data: { data: [], meta: { total: 0, page, limit } }
      }
    }
  },

  deleteExaminee: async (id: string): Promise<ApiResponse<IRegesteredExaminee>> => {
    try {
      const response = await del<IRegesteredExaminee>(`/regestered-examinees/${id}`)
      return response
    } catch (error: any) {
      return {
        success: false,
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.message || 'পরীক্ষার্থী মুছে ফেলতে সমস্যা হয়েছে',
        data: null
      }
    }
  }
}
