import { API_URL } from '@/config/env';
import { post, get, del } from '@/core/api/apiService';
import { CreateMarhalaData, IMarhala } from './marhala.interface';

export interface Kitab {
  _id: string;
  name: {
    bengaliName: string;
    arabicName?: string;
  };
  code: string;
  fullMarks: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const getAllKitabs = async (): Promise<{ success: boolean; data: Kitab[]; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/kitabs`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      data: [],
      message: 'কিতাব লোড করতে সমস্যা হয়েছে'
    };
  }
};

export const getAllMarhalas = async (): Promise<ApiResponse<IMarhala[]>> => {
  try {
    const response = await get<IMarhala[]>('/marhalas');
    return response;
  } catch (error) {
    return {
      success: false,
      data: [] as IMarhala[],
      message: 'মারহালা লোড করতে সমস্যা হয়েছে'
    };
  }
};

export const createMarhala = async (marhalaData: CreateMarhalaData): Promise<ApiResponse<IMarhala[]>> => {
  try {
    console.log(marhalaData);
    const response = await post(`/marhalas`, marhalaData);
    return response as ApiResponse<IMarhala[]>;
  } catch (error) {
    return {
      success: false,
      data: [] as IMarhala[],
      message: 'মারহালা তৈরি করতে সমস্যা হয়েছে'
    };
  }
};

export const deleteMarhala = async (id: string): Promise<ApiResponse<IMarhala>> => {
  try {
    const response = await del<IMarhala>(`/marhalas/${id}`);
    return response;
  } catch (error) {
    return {
      success: false,
      message: 'মারহালা মুছে ফেলতে সমস্যা হয়েছে'
    };
  }
};
