import { ApiResponse } from '@/interfaces/api'
import { post, get, patch } from '@/core/api/apiService'
import { IPreExamineeRegistration } from '@/features/preExamineeRegistration/interfaces'

import { PreExamineeRegistrationData } from '@/types/preExaminee.types'

export type PreExamineeRegistrationApiResponse = ApiResponse<IPreExamineeRegistration>;
export type PreExamineeRegistrationListApiResponse = ApiResponse<IPreExamineeRegistration[]>;

export const preExamineeRegistrationServices = {
  create: async (data: PreExamineeRegistrationData) => {
    try {
      const response = await post('/pre-examinee-registrations', {
        ...data
      })
      return {
        success: true,
        data: response.data,
        message: response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করা হয়েছে'
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করতে সমস্যা হয়েছে'
      }
    }
  },

  getAll: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await get(
        `/pre-examinee-registrations?page=${page}&limit=${limit}`
      )
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registrations retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'Failed to get pre-examinee registrations'
      }
    }
  },

  getAllMarhalasByIds: async (ids: string[]) => {
    try {
      const response = await get(`/marhalas/by-ids?ids=${ids.join(',')}`)
      return {
        success: true,
        data: response.data,
        message: 'Marhalas retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to get marhalas'
      }
    }
  },

  getById: async (id: string) => {
    try {
      const response = await get(`/pre-examinee-registrations/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registration retrieved successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'Failed to get pre-examinee registration'
      }
    }
  },

  update: async (id: string, data: Partial<IPreExamineeRegistration>) => {
    try {
      const response = await patch(`/pre-examinee-registrations/${id}`, data)
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registration updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message || 'Failed to update registration'
      }
    }
  },

  createPreExamineeRegistration: async (data: Record<string, unknown>) => {
    try {
      const response = await post<IPreExamineeRegistration>(
        '/pre-examinee-registration',
        data
      )
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registration created successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create pre-examinee registration'
      }
    }
  },

  getByExamAndMadrasah: async (examId: string, madrasaId: string) => {
    try {
      const response = await get(
        `/pre-examinee-registrations?examId=${examId}&madrasaId=${madrasaId}`
      )
      if(response.success && response.data)
      return {
        success: true,
        data: response.data || [],
        message: 'পরীক্ষার্থী প্রি-নিবন্ধন সফলভাবে পাওয়া গেছে'
      }
      else{
        return {
          success: false,
          data: [],
          message: 'পরীক্ষার্থী প্রি-নিবন্ধন তথ্য পাওয়া যায়নি!'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message:
          error?.response?.data?.message ||
          'পরীক্ষার্থী প্রি-নিবন্ধন পেতে সমস্যা হয়েছে'
      }
    }
  }
}
