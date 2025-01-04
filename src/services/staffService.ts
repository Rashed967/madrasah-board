import { ApiResponse, patch } from '@/core/api/apiService';
import { IMadrasah } from '@/features/madrasah/interfaces';


// {
//   console.log('📝 Updating address:', {
//     madrasahId: id,
//     data
//   });

//   const response = await patch<IMadrasah>(`/madrasah-addresses/${id}`, data);
//   return {
//     ...response,
//     statusCode: 200
//   };
// } catch (error) {
//   console.error('❌ Error updating address:', error);
//   throw error;
// }

export const updateMuhtamim = async (
  id: string,
  data: Partial<IMadrasah['muhtamim']>
): Promise<ApiResponse<IMadrasah>> => {
   try {
  console.log('📝 Updating address:', {
    madrasahId: id,
    data
  });

  console.log('🚀 ~ file: madrasahService.ts:50 ~ updateMuhtamim ~ data:', data);
  const response = await patch<IMadrasah>(`/muhtamims/${id}`, data);
  return {
    ...response,
    statusCode: 200
  };
} catch (error) {
  console.error('❌ Error updating address:', error);
  throw error;
}

}


// {
//   console.log('🚀 ~ file: madrasahService.ts:50 ~ updateMuhtamim ~ data:', data);
//   const response = await patch<IMadrasah>(`/muhtamims/${id}`, data);
//   return {
//     success: true as const,
//     statusCode:  response.statusCode,
//     message: response.message,
//     data: response.data
//   };
// } catch (error: any) {
//   return {
//     success: false as const,
//     statusCode: error?.response?.status,
//     message: error?.response?.data?.message || 'মুহতামিমের তথ্য আপডেট করতে সমস্যা হয়েছে',
//     data: null
//   };
// }


export const updateChairmanMutawalli = async (
  id: string,
  data: Partial<IMadrasah['chairman_mutawalli']>
): Promise<ApiResponse<IMadrasah>> => {
  try {
    const response = await patch<IMadrasah>(`/chairman-mutawallis/${id}`, data);
    return {
      success: true as const,
      statusCode:  response.statusCode,
      message: response.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false as const,
      statusCode: error?.response?.status,
      message: error?.response?.data?.message || 'চেয়ারম্যান/মুতাওয়াল্লির তথ্য আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};

export const updateEducationalSecretary = async (
  id: string,
  data: Partial<IMadrasah['educational_secretory']>
): Promise<ApiResponse<IMadrasah>> => {
  try {

    console.log('🚀 ~ file: staffService.ts:50 ~ updateEducationalSecretary ~ data:', data);
    const response = await patch<IMadrasah>(`/educational-secretories/${id}`, data);
    return {
      success: true as const,
      statusCode:  response.statusCode || 200,
      message: response.message || 'শিক্ষা সচিবের তথ্য সফলভাবে আপডেট করা হয়েছে',
      data: response.data 
    };
  } catch (error: any) {
    return {
      success: false as const,
      statusCode: error?.response?.statusCode || 500,
      message: error?.response?.data?.message || 'শিক্ষা সচিবের তথ্য আপডেট করতে সমস্যা হয়েছে',
      data: null
    };
  }
};
