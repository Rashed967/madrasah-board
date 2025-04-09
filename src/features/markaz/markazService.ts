// create markaz 


import { get, post, del, patch } from "@/core/api/apiService";
import IMarkaz from "./markaz.interface";
import { toast } from "sonner";
import { IMarkazResponse } from './markaz.interface';

export const createMarkaz = async (data: IMarkaz) => {
    try {
        const response = await post('/markazs', data)
       if(response.success) {
        return {
            success: true as const,
            message: response.message,
            data: response.data
        }
       }
       else{
        toast.error(response.message)
        return {
            success: false as const,
            message: response.message,
            data: null
        }
       }
    } catch (error: any) {
        toast.error(error.response.data.message)
        return {
            success: false as const,
            message: error.response.data.message,
            data: null
        }
    }
}

// get all markaz 
export const getAllMarkaz = async (queryParams?: string): Promise<{
    success: boolean;
    data: IMarkazResponse[];
    message: string;
    meta?: { total: number };
}> => {
    try {
      
        const response = await get(`/markazs${queryParams ? `?${queryParams}` : ''}`)
        console.log(response)
        return {
            success: true,
            data: response.data as IMarkazResponse[],
            meta: response.meta,
            message: 'মারকায সফলভাবে পাওয়া গেছে'
        }
    } catch (error: any) {
        return {
            success: false,
            data: [],
            message: error?.response?.data?.message || 'মারকায পেতে সমস্যা হয়েছে'
        }
    }
}

export const deleteMarkaz = async (id: string) => {
    try {
        const response = await del(`/markazs/${id}`)
        return {
            success: true,
            message: 'মারকায ডিলিট করা হয়েছে'
        }
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || 'মারকায ডিলিট করতে সমস্যা হয়েছে'
        }
    }
}

export const updateMarkaz = async (id: string, changes: any) => {
  try {
    const response = await patch(`/markazs/${id}`, changes)
    if (response.success) {
      return {
        success: true,
        message: response.message || 'মারকায আপডেট করা হয়েছে',
        data: response.data
      }
    } else {
      toast.error(response.message)
      return {
        success: false,
        message: response.message,
        data: null
      }
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'মারকায আপডেট করতে সমস্যা হয়েছে')
    return {
      success: false,
      message: error.response?.data?.message || 'মারকায আপডেট করতে সমস্যা হয়েছে',
      data: null
    }
  }
}

export const getMarkazById = async (id: string) => {
  try {
    const response = await get(`/markazs/${id}`)
    return {
      success: true,
      data: response.data,
      message: 'মারকায সফলভাবে পাওয়া গেছে'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'মারকায পেতে সমস্যা হয়েছে'
    }
  }
}