import { useState } from 'react';
import { MadrasahData } from '@/types/madrasah';

interface UseMadrasahFormReturn {
  data: MadrasahData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setData: React.Dispatch<React.SetStateAction<MadrasahData>>;
}

export const useMadrasahForm = (initialData: MadrasahData): UseMadrasahFormReturn => {
  const [data, setData] = useState<MadrasahData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData((prev: MadrasahData) => {
        const parentKey = parent as keyof MadrasahData;
        const currentParent = prev[parentKey];
        
        if (currentParent && typeof currentParent === 'object' && !Array.isArray(currentParent)) {
          return {
            ...prev,
            [parentKey]: {
              ...currentParent,
              [child]: value
            }
          } as MadrasahData;
        }
        return prev;
      });
    } else {
      const key = name as keyof MadrasahData;
      setData((prev: MadrasahData) => ({
        ...prev,
        [key]: value
      } as MadrasahData));
    }
  };

  return { data, handleChange, setData };
};
