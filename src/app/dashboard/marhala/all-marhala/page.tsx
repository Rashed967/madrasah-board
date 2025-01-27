'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { getAllMarhalas, deleteMarhala } from '@/features/marhala/marhala.service';
import type { IMarhala } from '@/features/marhala/marhala.interface';
import type { IKitab } from '@/features/kitab/kitab.interface';
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmation } from './components/DeleteConfirmation';

export default function AllMarhalaPage() {
  const [marhalaList, setMarhalaList] = useState<IMarhala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMarhala, setEditingMarhala] = useState<IMarhala | null>(null);
  const [selectedMarhala, setSelectedMarhala] = useState<IMarhala | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [marhalaToDelete, setMarhalaToDelete] = useState<IMarhala | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const marhalaPerPage = 10;

  useEffect(() => {
    const fetchMarhalas = async () => {
      try {
        const response = await getAllMarhalas();
        if (response.success) {
          setMarhalaList(response.data || []);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('মারহালা লোড করতে সমস্যা হয়েছে');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarhalas();
  }, []);

  // Pagination Logic
  const paginatedMarhala = useMemo(() => {
    const startIndex = (currentPage - 1) * marhalaPerPage;
    return marhalaList.slice(startIndex, startIndex + marhalaPerPage);
  }, [marhalaList, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(marhalaList.length / marhalaPerPage), 
    [marhalaList]
  );

  // Pagination Handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Edit Marhala
  const handleEditMarhala = (marhala: IMarhala) => {
    setEditingMarhala({...marhala});
  };

  // Save Edited Marhala
  const handleSaveEdit = () => {
    if (!editingMarhala?.name?.bengaliName?.trim()) {
      toast.error('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    // Update the marhala in the list
    const updatedList = marhalaList.map(m => 
      m._id === editingMarhala._id ? editingMarhala : m
    );

    setMarhalaList(updatedList);
    toast.success(`${editingMarhala.name.bengaliName} মারহালা আপডেট হয়েছে`);
    setEditingMarhala(null);
  };

  // Delete Marhala
  const handleDeleteClick = (marhala: IMarhala) => {
    setMarhalaToDelete(marhala);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!marhalaToDelete?._id) return;
    
    const marhalaId = marhalaToDelete._id.toString();
    const marhalaBengaliName = marhalaToDelete.name.bengaliName;
    
    // Close dialog before API call
    setShowDeleteDialog(false);
    setMarhalaToDelete(null);

    try {
      const response = await deleteMarhala(marhalaId);
      
      if (response.success) {
        const updatedList = marhalaList.filter(m => m._id?.toString() !== marhalaId);
        setMarhalaList(updatedList);
        toast.success(`${marhalaBengaliName} মারহালা মুছে ফেলা হয়েছে`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('মারহালা মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // Show Marhala Details
  const handleShowDetails = (marhala: IMarhala) => {
    setSelectedMarhala(marhala);
    setShowDetailsDialog(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 mt-12 mx-6 flex justify-center items-center">
        <div className="text-lg">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="p-8 mt-12 mx-6">
      <h1 className="text-lg font-bold mb-8">সকল মারহালা</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#52b788] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-normal">মারহালা কোড</th>
              <th className="px-4 py-3 text-left font-normal">মারহালা নাম</th>
              <th className="px-4 py-3 text-left font-normal">মারহালার ধরণ</th>
              <th className="px-4 py-3 text-left font-normal">মারহালার ক্যাটাগরি</th>
              <th className="px-4 py-3 text-left font-normal">কিতাব সংখ্যা</th>
              <th className="px-4 py-3 text-left font-normal">এ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMarhala.map((marhala) => (
              <tr key={marhala._id.toString()} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-600">{Number(marhala.code).toLocaleString('bn-BD')}</td>
                <td className="px-4 py-4 text-sm font-semibold cursor-pointer" onClick={() => handleShowDetails(marhala)}>
                  {marhala.name.bengaliName}
                  {marhala.name.arabicName && (
                    <span className="block text-gray-500 text-xs mt-1">
                      {marhala.name.arabicName}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{marhala.marhalaType === 'boys' ? 'বালক' :  'বালিকা' }</td>
                <td className="px-4 py-4 text-sm text-gray-600">{marhala.marhalaCategory === 'darsiyat' ? 'দারসিয়াত' : 'হিফজ'}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{Number(marhala.listOfKitabs.length).toLocaleString('bn-BD')}</td>
                <td className="px-4 py-4 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 bg-[#52B788] rounded-full text-white">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='bg-gray-200' align="end">
                      <DropdownMenuItem onClick={() => handleEditMarhala(marhala)}>
                        <MdEdit className="mr-2" />
                        সম্পাদনা করুন
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(marhala)}
                        className="text-red-600"
                      >
                        <MdDelete className="mr-2" />
                        মুছে ফেলুন
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            মোট {marhalaList.length}টি মারহালা
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              পূর্ববর্তী
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              পরবর্তী
            </button>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog 
        isOpen={showDetailsDialog} 
        onClose={() => setShowDetailsDialog(false)}
        title="মারহালা বিস্তারিত"
      >
        {selectedMarhala && (
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold">মারহালা নাম</h5>
              <p className="text-gray-700">{selectedMarhala.name.bengaliName}</p>
              {selectedMarhala.name.arabicName && (
                <p className="text-gray-500 text-sm">{selectedMarhala.name.arabicName}</p>
              )}
            </div>
            <div>
              <h5 className="font-semibold">মারহালা কোড</h5>
              <p className="text-gray-700">{Number(selectedMarhala.code).toLocaleString('bn-BD')}</p>
            </div>
            <div>
              <h5 className="font-semibold">মারহালার ধরণ</h5>
              <p className="text-gray-700">{selectedMarhala.marhalaType === 'boys' ? 'বালক' : 'বালিকা'}</p>
            </div>
            <div>
              <h5 className="font-semibold">মারহালার ক্যাটাগরি</h5>
              <p className="text-gray-700">{selectedMarhala.marhalaCategory === 'darsiyat' ? 'দারসিয়াত' : 'হিফজ'}</p>
            </div>
            <div>
              <h5 className="font-semibold">কিতাব তালিকা</h5>
              <div className="mt-2 space-y-2">
                {selectedMarhala.listOfKitabs.map((kitab, index) => {
                  const kitabObj = kitab as unknown as IKitab;
                  return (
                    <div key={typeof kitab === 'object' && '_id' in kitab ? kitab._id.toString() : index} className="text-gray-700">
                      {index + 1}. {typeof kitab === 'object' && 'name' in kitab && kitabObj.name ? (
                        <>
                          {kitabObj.name.bengaliName}
                          {kitabObj.name.arabicName && (
                            <span className="text-gray-500 text-sm ml-2">({kitabObj.name.arabicName})</span>
                          )}
                        </>
                      ) : 'কিতাব'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        selectedMarhala={marhalaToDelete}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
