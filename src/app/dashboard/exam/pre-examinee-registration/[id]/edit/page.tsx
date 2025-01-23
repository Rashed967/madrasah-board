'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService';
import { useRouter } from 'next/navigation';
import { StatusDialog } from '@/components/ui/status-dialog';

interface Mahala {
  marhalaName: string;
  totalExamineesSlots: number;
  startingRegistrationNumber: number;
  endingRegistrationNumber: number;
  _id?: string;
}

interface PreExamineeRegistration {
  _id: string;
  madrasah: {
    madrasahNames: {
      bengaliName: string;
    };
    code: string;
  };
  exam: {
    examName: string;
  };
  examineesPerMahala: Mahala[];
  transaction: {
    totalAmount: number;
    paidAmount: number;
  };
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: PreExamineeRegistration;
}

export default function EditPreExamineeRegistration({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [examineesPerMahala, setExamineesPerMahala] = useState<Mahala[]>([]);
  const [data, setData] = useState<PreExamineeRegistration | null>(null);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await preExamineeRegistrationServices.getById(params.id) as ApiResponse;
        if (response.success && response.data) {
          setData(response.data);
          setExamineesPerMahala(response.data.examineesPerMahala || []);
        } else {
          throw new Error(response.message || 'ডেটা লোড করতে সমস্যা হয়েছে');
        }
      } catch (err: any) {
        setError(err.message);
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Calculate total examinees and update registration numbers
  const updateMahalaCalculations = (index: number, newValue: number) => {
    setExamineesPerMahala(prevState => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        totalExamineesSlots: newValue
      };

      // Calculate starting and ending registration numbers
      let currentStartingNumber = 30001; // Starting from 30001
      newState.forEach((mahala, idx) => {
        if (mahala.totalExamineesSlots > 0) {
          mahala.startingRegistrationNumber = currentStartingNumber;
          mahala.endingRegistrationNumber = currentStartingNumber + mahala.totalExamineesSlots - 1;
          currentStartingNumber = mahala.endingRegistrationNumber + 1;
        } else {
          mahala.startingRegistrationNumber = 0;
          mahala.endingRegistrationNumber = 0;
        }
      });

      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Calculate total examinees
      const totalExaminees = examineesPerMahala.reduce((sum, mahala) => sum + (mahala.totalExamineesSlots || 0), 0);
      
      // Calculate total amount (250 per examinee)
      const totalAmount = totalExaminees * 250;

      const updateData = {
        ...data,
        examineesPerMahala,
        transaction: {
          ...data?.transaction,
          totalAmount
        }
      };

      const response = await preExamineeRegistrationServices.update(params.id, updateData) as ApiResponse;
      
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল',
          message: 'প্রি-নিবন্ধন আপডেট করা হয়েছে'
        });
        router.push('/dashboard/exam/all-pre-examinee-registrations');
      } else {
        throw new Error(response.message || 'আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.message
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto p-6 mt-3">
      <div className="mb-6">
        <h1 className="mb-1">
          <span className="text-xl font-semibold">প্রি-নিবন্ধন এডিট: </span>
          <span className="text-xl">{data?.madrasah?.madrasahNames?.bengaliName || 'অজানা মাদ্রাসা'}</span>
        </h1>
        <p className="text-gray-600">মাদ্রাসা কোড: {data?.madrasah?.code || '-'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">মারহালা ভিত্তিক পরীক্ষার্থী সংখ্যা</h2>
            <div className="space-y-4">
              {examineesPerMahala.map((mahala, index) => (
                <div key={mahala._id || index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium mb-1">{mahala.marhalaName}</label>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      value={mahala.totalExamineesSlots || 0}
                      onChange={(e) => updateMahalaCalculations(index, parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    শুরু: {mahala.startingRegistrationNumber > 0 ? mahala.startingRegistrationNumber.toLocaleString('bn-BD') : '-'}
                  </div>
                  <div className="text-sm text-gray-600">
                    শেষ: {mahala.endingRegistrationNumber > 0 ? mahala.endingRegistrationNumber.toLocaleString('bn-BD') : '-'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">মোট পরীক্ষার্থী: {examineesPerMahala.reduce((sum, m) => sum + (m.totalExamineesSlots || 0), 0).toLocaleString('bn-BD')}</p>
                  <p className="font-medium">মোট ফি: {(examineesPerMahala.reduce((sum, m) => sum + (m.totalExamineesSlots || 0), 0) * 250).toLocaleString('bn-BD')} টাকা</p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    বাতিল করুন
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#52B788] hover:bg-[#429b71]"
                    disabled={saving}
                  >
                    {saving ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
    </div>
  );
}
