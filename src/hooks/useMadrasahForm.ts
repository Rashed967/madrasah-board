import { useState } from 'react';
import { IMadrasah } from '@/types/global/madrasah.types';

interface UseMadrasahFormReturn {
  madrasahData: Partial<IMadrasah>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setMadrasahData: React.Dispatch<React.SetStateAction<Partial<IMadrasah>>>;
}

export const useMadrasahForm = (initialData?: Partial<IMadrasah>): UseMadrasahFormReturn => {
  const [madrasahData, setMadrasahData] = useState<Partial<IMadrasah>>(initialData || {
    madrasahNames: {
      bengaliName: '',
      arabicName: '',
      englishName: ''
    },
    email: '',
    contactNo1: '',
    contactNo2: '',
    description: '',
    address: {
      division: '',
      district: '',
      subDistrict: '',
      policeStation: '',
      village: '',
      holdingNumber: '',
      zone: '',
      courierAddress: ''
    },
    madrasah_information: {
      highestMarhala: '',
      totalStudents: 0,
      totalTeacherAndStuff: 0,
      madrasahType: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMadrasahData((prev: Partial<IMadrasah>) => {
        const parentKey = parent as keyof Partial<IMadrasah>;
        const currentParent = prev[parentKey];
        
        if (currentParent && typeof currentParent === 'object' && !Array.isArray(currentParent)) {
          return {
            ...prev,
            [parentKey]: {
              ...currentParent,
              [child]: value
            }
          } as Partial<IMadrasah>;
        }
        return prev;
      });
    } else {
      const key = name as keyof Partial<IMadrasah>;
      setMadrasahData((prev: Partial<IMadrasah>) => ({
        ...prev,
        [key]: value
      } as Partial<IMadrasah>));
    }
  };

  return { madrasahData, handleChange, setMadrasahData };
};
