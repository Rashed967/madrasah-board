import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface MadrasahNames {
  bengaliName: string;
  arabicName: string;
  englishName: string;
  _id: string;
  id: string;
}

interface Madrasah {
  _id: string;
  madrasahNames: MadrasahNames;
  code: string;
  id: string;
}

interface Marhala {
  name: {
    bengaliName: string;
    arabicName: string;
  };
  _id: string;
  id: string;
}

interface ExamineePerMahala {
  marhala: Marhala;
  regularExamineesSlots: number;
  irregularExamineesSlots: number;
  remainingRegularExamineesSlots: number;
  remainingIrregularExamineesSlots: number;
  startingRegistrationNumber: number;
  endingRegistrationNumber: number;
  _id: string;
  id: string;
}

interface Transaction {
  _id: string;
  totalAmount: number;
  paidAmount: number;
  transactionType: string;
  transactionCategory: string;
  description: string;
  paymentDetails: Array<{
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    referenceNumber: string;
  }>;
  id: string;
}

interface Exam {
  _id: string;
  examName: string;
  id: string;
}

interface PreExamineeRegistration {
  _id: string;
  madrasah: Madrasah;
  examineesPerMahala: ExamineePerMahala[];
  transaction: Transaction;
  isLateRegistrationFeeTaken: boolean;
  receiptNo: number;
  exam: Exam;
}

interface PreExamineeRegistrationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: PreExamineeRegistration[];
  };
}

interface ExamineeRegistrationTableProps {
  selectedExamId?: string;
  selectedMadrasahId?: string;
}

const ExamineeRegistrationTable = ({ 
  selectedExamId, 
  selectedMadrasahId 
}: ExamineeRegistrationTableProps) => {
  const [registrations, setRegistrations] = useState<PreExamineeRegistration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedExamId || !selectedMadrasahId) {
        setRegistrations([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get<PreExamineeRegistrationResponse>(
          `${process.env.NEXT_PUBLIC_MAIN_URL}/pre-examinee-registrations?select=madrasah,examineesPerMahala,transaction,isLateRegistrationFeeTaken,receiptNo,exam&limit=10&page=1&exam=${selectedExamId}&madrasah=${selectedMadrasahId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
          }
        );

        if (response.data && response.data.success && response.data.data && response.data.data.data) {
          setRegistrations(response.data.data.data);
        } else {
          setError("নিবন্ধনের তথ্য পাওয়া যায়নি");
        }
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("নিবন্ধনের তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedExamId, selectedMadrasahId]);

  const handleSubmit = (registrationId: string) => {
    console.log("Submit registration:", registrationId);
    // Implement submission logic here
  };

  if (!selectedExamId || !selectedMadrasahId) {
    return (
      <div className="text-center py-8 text-gray-500">
        পরীক্ষা ও মাদ্রাসা নির্বাচন করুন
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        নিবন্ধনের কোনো তথ্য পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>মাদ্রাসা</TableHead>
            <TableHead>মহালা</TableHead>
            <TableHead>নিয়মিত পরীক্ষার্থী</TableHead>
            <TableHead>অনিয়মিত পরীক্ষার্থী</TableHead>
            <TableHead>অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            registration.examineesPerMahala.map((examineePerMahala) => (
              <TableRow key={`${registration._id}-${examineePerMahala._id}`}>
                <TableCell>{registration.madrasah.madrasahNames.bengaliName}</TableCell>
                <TableCell>{examineePerMahala.marhala.name.bengaliName}</TableCell>
                <TableCell>
                  {examineePerMahala.regularExamineesSlots - examineePerMahala.remainingRegularExamineesSlots} / {examineePerMahala.regularExamineesSlots}
                </TableCell>
                <TableCell>
                  {examineePerMahala.irregularExamineesSlots - examineePerMahala.remainingIrregularExamineesSlots} / {examineePerMahala.irregularExamineesSlots}
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={() => handleSubmit(registration._id)}
                    className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                  >
                    সাবমিট
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamineeRegistrationTable; 