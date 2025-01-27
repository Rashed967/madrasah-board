import { API_URL } from '@/config/env';
import { post } from '@/core/api/apiService';
import { CreateMarhalaData } from './marhala.interface';

export interface Kitab {
  _id: string;
  name: {
    bengaliName: string;
    arabicName?: string;
  };
  code: string;
  fullMarks: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
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

export const createMarhala = async (marhalaData: CreateMarhalaData): Promise<ApiResponse> => {
  try {
    console.log(marhalaData);
    const response = await post(`/marhalas`, marhalaData);
    // const data = await response.json();
    return response;
  } catch (error) {
    return {
      success: false,
      message: 'মারহালা তৈরি করতে সমস্যা হয়েছে'
    };
  }
};
