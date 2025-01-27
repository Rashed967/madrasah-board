import { get, post, patch } from '@/core/api/apiService';
import { ApiResponse } from '@/core/api/apiService';
import { IKitab } from './kitab.interface';

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;

type KitabInput = {
    name: {
        bengaliName: string;
        arabicName?: string;
    };
    fullMarks: number;
};

export type KitabApiResponse = ApiResponse<IKitab>;
export type KitabListApiResponse = ApiResponse<IKitab[]>;

export const createKitab = async (data: KitabInput): Promise<KitabApiResponse> => {
    try {
        const response = await post<IKitab>(`/kitabs`, data);
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            success: false,
            message: 'কিতাব তৈরি করতে সমস্যা হয়েছে',
            data: null
        };
    }
};

export const getAllKitabs = async (page: number = 1, limit: number = 10): Promise<KitabListApiResponse> => {
  try {
    const response = await get<IKitab[]>(`/kitabs?page=${page}&limit=${limit}`);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch kitabs',
      data: null
    };
  }
};

export const getKitabById = async (id: string): Promise<KitabApiResponse> => {
  try {
    const response = await get<IKitab>(`/kitabs/${id}`);
    return response;
  } catch (error: any) {
    return {
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch kitab',
      data: null
    };
  }
};