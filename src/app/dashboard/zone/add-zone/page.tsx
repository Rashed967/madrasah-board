'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { StatusDialog } from '@/components/ui/status-dialog';
import ZoneName from '../components/ZoneName';
import ZoneDistrict from '../components/ZoneDistrict';
import ZoneSubmitButton from '../components/ZoneSubmitButton';
import { divisions } from '@/data/divisions';
import { createZone } from '@/features/zone/zone.services';

// Get all unique districts from divisions
const allDistricts : string[] = Object.values(divisions).reduce((acc, divisionDistricts) => {
  return [...acc, ...Object.keys(divisionDistricts)];
}, [] as string[]);

// Remove duplicates and sort
const districts : string[] = [...new Set(allDistricts)].sort();

export default function AddZone() {
  const router = useRouter();
  const [zoneName, setZoneName] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });


  const handleAddDistrict = (district: string) => {
    if (!selectedDistricts.includes(district)) {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  const handleRemoveDistrict = (district: string) => {
    setSelectedDistricts(selectedDistricts.filter(d => d !== district));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zoneName.trim()) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'জোনের নাম দিন'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await createZone({
        name: zoneName,
        allDistricts: selectedDistricts
      });

  
      // ‍show dialog based on response
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফলভাবে তৈরি হয়েছে',
          message: 'জোন তৈরি করা হয়েছে'
        });
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'জোন তৈরি করতে সমস্যা হয়েছে'
        });
      }
  
      // Clear form
      setZoneName('');
      setSelectedDistricts([]);
      
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'জোন তৈরি করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeStatusDialog = () => {
    setStatusDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Auto close success dialog after 3 seconds
  if (statusDialog.isOpen && statusDialog.type === 'success') {
    setTimeout(closeStatusDialog, 3000);
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-28">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-base md:text-lg font-bold mb-6 text-gray-800">নতুন জোন যোগ করুন</h1>
        
        <form onSubmit={handleSubmit}>
          <ZoneName 
            zoneName={zoneName}
            setZoneName={setZoneName}
          />

          <ZoneDistrict
            districts={districts}
            selectedDistricts={selectedDistricts}
            onAddDistrict={handleAddDistrict}
            onRemoveDistrict={handleRemoveDistrict}
          />

          <ZoneSubmitButton isLoading={isLoading} />
          
        </form>
      </div>

      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={closeStatusDialog}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />

      
    </div>
  );
}
