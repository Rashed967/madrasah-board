import { ApiResponse } from '@/interfaces/api';
import { post, get, patch } from '@/core/api/apiService';
import { IPreExamineeRegistration } from '@/features/preExamineeRegistration/interfaces';

// export type PreExamineeRegistrationApiResponse = ApiResponse<IPreExamineeRegistration>;
// export type PreExamineeRegistrationListApiResponse = ApiResponse<IPreExamineeRegistration[]>;

export const preExamineeRegistrationServices = {
  async create(data: any) {
    try {
      const response = await post('/pre-examinee-registrations', data);
      return {
        success: true,
        data: response.data,
        message: response.message || 'Pre-examinee registration created successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create pre-examinee registration'
      };
    }
  },


  async getAll(page: number = 1, limit: number = 10) {
    try {
      const response = await get(`/pre-examinee-registrations?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registrations retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to get pre-examinee registrations'
      };
    }
  },

  getById: async (id: string) => {
    try {
      const response = await get(`/pre-examinee-registrations/${id}`);
      return {
        success: true,
        message: response.message,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to fetch registration details',
      };
    }
  },

  async getByIdOld(id: string) {
    try {
      const response = await get<IPreExamineeRegistration>(`/pre-examinee-registration/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registration retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to get pre-examinee registration'
      };
    }
  },

  // async update(id: string, data: Partial<IPreExamineeRegistration>) {
  //   try {
  //     const response = await patch<IPreExamineeRegistration>(`/pre-examinee-registration/${id}`, data);
  //     return {
  //       success: true,
  //       data: response.data,
  //       message: 'Pre-examinee registration updated successfully'
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       error: error?.message || 'Failed to update pre-examinee registration'
  //     };
  //   }
  // },


  update: async (id: string, data: any) => {
    try {
      const response = await patch(`/pre-examinee-registrations/${id}`, data);
      return {
        success: true,
        message: response.message,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to update registration',
      };
    }
  },

  createPreExamineeRegistration: async (data: Record<string, unknown>) => {
    try {
      const response = await post<IPreExamineeRegistration>('/pre-examinee-registration', data);
      return {
        success: true,
        data: response.data,
        message: 'Pre-examinee registration created successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create pre-examinee registration'
      };
    }
  }

};
