'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService';

export default function PreExamineeRegistrationView({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await preExamineeRegistrationServices.getById(params.id);
        if (response.success) {
          setData(response.data);
        } else {
          throw new Error(response.message || 'ডেটা লোড করতে সমস্যা হয়েছে');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto p-6 mt-3">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className=" mb-1"> 
          <span className="text-xl font-semibold">প্রি-নিবন্ধনের তথ্য: </span> 
          <span className='text-xl'>{data?.madrasah?.madrasahNames?.bengaliName || 'অজানা মাদ্রাসা'}</span>
        </h1>
        <p className="text-gray-600">মাদ্রাসা কোড: {data?.madrasah?.code || '-'}</p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">মৌলিক তথ্য</h2>
            <div className="space-y-2">
              <p><span className="font-medium">পরীক্ষা:</span> {data?.exam?.examName || '-'}</p>
              <p><span className="font-medium">মোট পরীক্ষার্থী:</span> {(data?.totalExaminees || 0).toLocaleString('bn-BD')}</p>
              <p><span className="font-medium">নিবন্ধন তারিখ:</span> {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('bn-BD') : '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">আর্থিক তথ্য</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">মোট ফি:</span> {(data?.transaction?.totalAmount || 0).toLocaleString('bn-BD')} টাকা
              </p>
              <p>
                <span className="font-medium">পরিশোধিত:</span> {(data?.transaction?.paidAmount || 0).toLocaleString('bn-BD')} টাকা
              </p>
              <p>
                <span className="font-medium">বাকি:</span> {((data?.transaction?.totalAmount || 0) - (data?.transaction?.paidAmount || 0)).toLocaleString('bn-BD')} টাকা
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marhala wise Registration Table */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">মারহালা ভিত্তিক নিবন্ধন</h2>
          {!data?.examineesPerMahala?.length ? (
            <p className="text-gray-600">মারহালা ভিত্তিক তথ্য পাওয়া যায়নি</p>
          ) : (
            <Table>
              <TableHeader className="bg-[#52B788] text-white">
                <TableRow>
                  <TableHead>মারহালা</TableHead>
                  <TableHead className="text-right">পরীক্ষার্থীর সংখ্যা</TableHead>
                  <TableHead className="text-right">শুরুর রেজিস্ট্রেশন নং</TableHead>
                  <TableHead className="text-right">শেষ রেজিস্ট্রেশন নং</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.examineesPerMahala.map((mahala: any, index: number) => (
                  <TableRow key={mahala?._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell>{mahala?.marhalaName || '-'}</TableCell>
                    <TableCell className="text-right">{(mahala?.totalExamineesSlots || 0).toLocaleString('bn-BD')}</TableCell>
                    <TableCell className="text-right">
                      {(mahala?.startingRegistrationNumber > 0 ? mahala.startingRegistrationNumber.toLocaleString('bn-BD') : '-')}
                    </TableCell>
                    <TableCell className="text-right">
                      {(mahala?.endingRegistrationNumber > 0 ? mahala.endingRegistrationNumber.toLocaleString('bn-BD') : '-')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">পেমেন্ট বিবরণ</h2>

          {!data?.transaction?.paymentDetails?.length ? (
            <p className="text-gray-600">পেমেন্ট বিবরণ পাওয়া যায়নি</p>
          ) : (
            <Table>
              <TableHeader className="bg-[#52B788] text-white">
                <TableRow>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>পেমেন্ট পদ্ধতি</TableHead>
                  <TableHead className="text-right">পরিমাণ</TableHead>
                  <TableHead>রেফারেন্স নং</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transaction.paymentDetails.map((payment: any, index: number) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell>
                      {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('bn-BD') : '-'}
                    </TableCell>
                    <TableCell>
                      {payment?.paymentMethod === 'mobile_banking' ? 'মোবাইল ব্যাংকিং' : 
                       payment?.paymentMethod === 'bank_transfer' ? 'ব্যাংক ট্রান্সফার' : 
                       payment?.paymentMethod || '-'}
                    </TableCell>
                    <TableCell className="text-right">{(payment?.amount || 0).toLocaleString('bn-BD')}</TableCell>
                    <TableCell>{payment?.referenceNumber || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
