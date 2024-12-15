'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";

// Mock data - replace with actual data fetching
const MOCK_EXAMINEES = [
  {
    id: 1,
    registrationNumber: '15847855',
    name: 'মোঃ আবদুল কালাম',
    photo: '/placeholder-profile.jpg',
    marhala: 'দাখিল',
    madrasah: 'দারুল উলূম মাদরাসা',
    nationalId: '1234567890'
  },
  {
    id: 2,
    registrationNumber: '25698741',
    name: 'আলী আহমদ',
    photo: '/placeholder-profile.jpg',
    marhala: 'আলিম',
    madrasah: 'আল-আজহার মাদরাসা',
    nationalId: '9876543210'
  },
  {
    id: 3,
    registrationNumber: '25698741',
    name: 'জাকের মুহাম্মদ',
    photo: '/placeholder-profile.jpg',
    marhala: 'ফাযিল',
    madrasah: 'আল-আজহার মাদরাসা',
    nationalId: '54564874842'
  },
  // Add more mock examinees as needed
];

export default function AllExamineesPage() {
  const [examinees, setExaminees] = useState(MOCK_EXAMINEES);
  const [selectedExaminee, setSelectedExaminee] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [examineeToDelete, setExamineeToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setExamineeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (examineeToDelete !== null) {
      setExaminees(prev => prev.filter(examinee => examinee.id !== examineeToDelete));
      setExamineeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (examinee: any) => {
    setSelectedExaminee(examinee);
  };

  const handleEditSubmit = () => {
    setExaminees(prev => 
      prev.map(examinee => 
        examinee.id === selectedExaminee.id ? selectedExaminee : examinee
      )
    );
    setSelectedExaminee(null);
  };

  return (
    <div className="container mx-auto p-4 mt-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">সকল পরীক্ষার্থী</h1>
        <p className="text-gray-500">আপনার সকল পরীক্ষার্থীর তালিকা এখানে রয়েছে</p>
      </div>

      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-[#52B788] text-white rounded-t-lg">
            <TableRow>
              <TableHead className="w-[100px]">ছবি</TableHead>
              <TableHead>নাম</TableHead>
              <TableHead>রেজিস্ট্রেশন নাম্বার</TableHead>
              <TableHead>মারহালা</TableHead>
              <TableHead>মাদরাসা</TableHead>
              <TableHead>জাতীয় পরিচয় পত্র</TableHead>
              <TableHead className="text-right">ক্রিয়া</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examinees.map((examinee) => (
              <TableRow key={examinee.id} className="hover:bg-gray-50 transition-colors">
                <TableCell>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image 
                      src={examinee.photo} 
                      alt={examinee.name} 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{examinee.name}</TableCell>
                <TableCell>{examinee.registrationNumber}</TableCell>
                <TableCell>{examinee.marhala}</TableCell>
                <TableCell>{examinee.madrasah}</TableCell>
                <TableCell>{examinee.nationalId}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleEdit(examinee)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(examinee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {examinees.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            কোনো পরীক্ষার্থী পাওয়া যায়নি
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog 
        isOpen={!!selectedExaminee}
        onClose={() => setSelectedExaminee(null)}
        title="পরীক্ষার্থীর তথ্য সম্পাদনা করুন"
        description="নিম্নলিখিত তথ্যগুলি পরিবর্তন করুন"
        onSubmit={handleEditSubmit}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              নাম
            </label>
            <Input 
              id="name" 
              value={selectedExaminee?.name || ''} 
              className="col-span-3"
              onChange={(e) => setSelectedExaminee({
                ...selectedExaminee, 
                name: e.target.value
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="registrationNumber" className="text-right">
              রেজিস্ট্রেশন নাম্বার
            </label>
            <Input 
              id="registrationNumber" 
              value={selectedExaminee?.registrationNumber || ''} 
              className="col-span-3"
              onChange={(e) => setSelectedExaminee({
                ...selectedExaminee, 
                registrationNumber: e.target.value
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="marhala" className="text-right">
              মারহালা
            </label>
            <Input 
              id="marhala" 
              value={selectedExaminee?.marhala || ''} 
              className="col-span-3"
              onChange={(e) => setSelectedExaminee({
                ...selectedExaminee, 
                marhala: e.target.value
              })}
            />
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setExamineeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="আপনি কি নিশ্চিত?"
        description="এই পরীক্ষার্থীর তথ্য permanently মুছে ফেলা হবে। এই ক্রিয়াটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।"
        confirmButtonText="মুছে ফেলুন"
        cancelButtonText="বাতিল"
      />
    </div>
  );
}
