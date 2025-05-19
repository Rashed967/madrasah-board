import { useState } from 'react';
import { markazService } from '@/services/markazService';

interface UseGetMarkazListProps {
  zoneIds: string[];
  districts: string[];
  madrasahType: 'বালক' | 'বালিকা' | 'উভয়';
  marhalaCategory: 'darsiyat' | 'hifz' | 'both';
}

export const useGetMarkazList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const getMarkazList = async (params: UseGetMarkazListProps) => {
    try {
      setLoading(true);
      setError(null);
      const response = await markazService.getAllMarkazWithStudentList(params);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching markaz list';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMarkazList,
    loading,
    error,
    data
  };
}; 