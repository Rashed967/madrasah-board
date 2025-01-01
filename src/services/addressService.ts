import { patch } from './apiService';
import { MadrasahAddress, AddressUpdateResponse } from '@/types/address';

export const updateMadrasahAddress = async (
  id: string,
  data: Partial<MadrasahAddress>
): Promise<AddressUpdateResponse> => {
  try {
    console.log('📝 Updating address:', {
      endpoint: `/madrasah-addresses/${id}`,
      data
    });

    const response = await patch(`/madrasah-addresses/${id}`, data);
    
    console.log('✅ Address update response:', response);
    return response;
  } catch (error) {
    console.error('❌ Address update error:', error);
    throw error;
  }
};
