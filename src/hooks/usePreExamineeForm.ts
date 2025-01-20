import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { madrasahServices } from '@/services/madrasahService';
import marhalaNames from '@/data/marhala.names';

const initialFormState = {
  exam: '',
  madrasah: '',
  examineesPerMahala: marhalaNames.map(marhalaName => ({
    marhalaName,
    totalExamineesSlots: 0,
    startingRegistrationNumber: 0,
    endingRegistrationNumber: 0,
    totalFeesAmount: 0
  })),
  totalFeesAmount: 0,
  transactionDetails: {
    totalAmount: 0,
    paidAmount: 0,
    transactionCategory: '',
    description: '',
    paymentDetails: [{
      amount: 0,
      paymentMethod: '',
      referenceNumber: ''
    }]
  }
};

export const usePreExamineeForm = (selectedExamDetails: any) => {
  const [formData, setFormData] = useState(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMadrasahDetails, setSelectedMadrasahDetails] = useState<any>(null);
  const [latestRegistrationNumber, setLatestRegistrationNumber] = useState(0);

  // Debounced search function
  const handleSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    
    // Only search if it's a keyboard event and the key is Enter
    if ('key' in e && e.key === 'Enter' && value.length >= 2) {
      setIsSearching(true);
      try {
        const response = await madrasahServices.getAllMadrasahsForPreRegistration(1, 40);
        const filteredResults = response.data.filter((madrasah: any) => 
          madrasah.madrasahNames.bengaliName.toLowerCase().includes(value.toLowerCase()) ||
          madrasah.madrasahNames.englishName?.toLowerCase().includes(value.toLowerCase()) ||
          madrasah.code.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredResults);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching madrasahs:', error);
      } finally {
        setIsSearching(false);
      }
    }
  }, []);

  const handleMadrasahSelect = (madrasah: any) => {
    setFormData(prev => ({ ...prev, madrasah: madrasah._id }));
    setSelectedMadrasahDetails({
      _id: madrasah._id,
      code: madrasah.code,
      madrasahNames: madrasah.madrasahNames,
      madrasahType: madrasah.madrasah_information.madrasahType
    });
    setSearchTerm(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`);
    setShowDropdown(false);
  };

  const handleExamineeCountChange = (marhalaName: string, count: number) => {
    if (!selectedExamDetails) return;

    const updatedExamineesPerMahala = formData.examineesPerMahala.map(marhala => {
      if (marhala.marhalaName === marhalaName) {
        return {
          ...marhala,
          totalExamineesSlots: count,
          totalFeesAmount: count * (selectedExamDetails.preRegistrationFee || 0)
        };
      }
      return marhala;
    });

    let currentStartNumber = selectedExamDetails.currentRegistrationNumber === 0 
      ? selectedExamDetails.registrationStartNumber 
      : selectedExamDetails.currentRegistrationNumber + 1;

    const finalUpdatedExamineesPerMahala = updatedExamineesPerMahala.map(marhala => {
      if (marhala.totalExamineesSlots > 0) {
        const startingNumber = currentStartNumber;
        const endingNumber = startingNumber + marhala.totalExamineesSlots - 1;
        currentStartNumber = endingNumber + 1;
        
        return {
          ...marhala,
          startingRegistrationNumber: startingNumber,
          endingRegistrationNumber: endingNumber
        };
      }
      return {
        ...marhala,
        startingRegistrationNumber: 0,
        endingRegistrationNumber: 0
      };
    });

    const totalFeesAmount = finalUpdatedExamineesPerMahala.reduce(
      (sum, marhala) => sum + marhala.totalFeesAmount,
      0
    );

    setFormData(prev => ({
      ...prev,
      examineesPerMahala: finalUpdatedExamineesPerMahala,
      totalFeesAmount,
      transactionDetails: {
        ...prev.transactionDetails,
        totalAmount: totalFeesAmount
      }
    }));

    const lastMarhalaWithCount = finalUpdatedExamineesPerMahala
      .filter(m => m.totalExamineesSlots > 0)
      .pop();
    
    setLatestRegistrationNumber(
      lastMarhalaWithCount ? lastMarhalaWithCount.endingRegistrationNumber + 1 : 0
    );
  };

  const handleTransactionChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      transactionDetails: {
        ...prev.transactionDetails,
        [field]: value
      }
    }));
  };

  return {
    formData,
    setFormData,
    searchTerm,
    searchResults,
    isSearching,
    showDropdown,
    selectedMadrasahDetails,
    latestRegistrationNumber,
    handleSearch,
    handleMadrasahSelect,
    handleExamineeCountChange,
    handleTransactionChange
  };
};
