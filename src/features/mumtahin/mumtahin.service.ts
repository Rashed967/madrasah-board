import { IHallGuard } from './mumtahin.interface';
import { post } from '@/core/api/apiService';

export const createHallGuard = async (data: any): Promise<any> => {
  try {
    const response = await post<IHallGuard>('/hall-guards', data);
    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'হলগার্ড তৈরি করতে সমস্যা হয়েছে',
    };
  }
};
