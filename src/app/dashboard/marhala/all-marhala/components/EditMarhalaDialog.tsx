'use client';

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMarhala, MarhalaCategory } from "@/features/marhala/marhala.interface";
import { updateMarhala } from "@/features/marhala/marhala.service";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MdDelete, MdAdd } from "react-icons/md";
import { getAllKitabs } from "@/features/kitab/kitab.service";
import { IKitab } from "@/features/kitab/kitab.interface";

interface EditMarhalaDialogProps {
  marhala: IMarhala;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedMarhala: IMarhala) => void;
}

export function EditMarhalaDialog({ marhala, isOpen, onClose, onSuccess }: EditMarhalaDialogProps) {
  const [formData, setFormData] = useState({
    bengaliName: '',
    arabicName: '',
    marhalaType: '',
    marhalaCategory: '',
    listOfKitabs: [] as (string | { _id: string })[]
  });

  const [availableKitabs, setAvailableKitabs] = useState<IKitab[]>([]);
  const [selectedKitab, setSelectedKitab] = useState<string>('');

  useEffect(() => {
    if (marhala) {
      setFormData({
        bengaliName: marhala.name.bengaliName,
        arabicName: marhala.name.arabicName || '',
        marhalaType: marhala.marhalaType,
        marhalaCategory: marhala.marhalaCategory,
        listOfKitabs: marhala.listOfKitabs.map(k => {
          if (typeof k === 'string') return k;
          return k._id?.toString() || '';
        }).filter(Boolean)
      });
    }
    loadKitabs();
  }, [marhala]);

  const loadKitabs = async () => {
    try {
      const response = await getAllKitabs(1, 100); // Get all kitabs
      if (response.success && response.data) {
        setAvailableKitabs(response.data);
      }
    } catch (error) {
      toast.error('কিতাব লোড করতে সমস্যা হয়েছে');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.bengaliName.trim()) {
      toast.error('মারহালার বাংলা নাম দিন');
      return;
    }

    if (!formData.marhalaType) {
      toast.error('মারহালার ধরণ নির্বাচন করুন');
      return;
    }

    if (!formData.marhalaCategory) {
      toast.error('মারহালার ক্যাটাগরি নির্বাচন করুন');
      return;
    }
    console.log(formData);

    try {
      // Check what fields have changed
      const changes: any = {};
      
      if (formData.bengaliName.trim() !== marhala.name.bengaliName) {
        changes.name = { bengaliName: formData.bengaliName.trim() };
      }
      
      if (formData.arabicName.trim() !== (marhala.name.arabicName || '')) {
        changes.name = {
          ...(changes.name || { bengaliName: marhala.name.bengaliName }),
          arabicName: formData.arabicName.trim() || undefined
        };
      }
      
      // Always include marhalaType and marhalaCategory in changes
      changes.marhalaType = formData.marhalaType as 'boys' | 'girls';
      changes.marhalaCategory = formData.marhalaCategory as MarhalaCategory;
      
      // Compare kitab lists
      const originalKitabs = marhala.listOfKitabs.map(k => typeof k === 'string' ? k : k._id?.toString()).filter(Boolean);
      const currentKitabs = formData.listOfKitabs.map(id => typeof id === 'string' ? id : id._id?.toString()).filter(Boolean);
      
      if (JSON.stringify(originalKitabs) !== JSON.stringify(currentKitabs)) {
        changes.listOfKitabs = currentKitabs;
      }

      // If no changes, close the dialog without API call
      if (Object.keys(changes).length === 0) {
        onClose();
        return;
      }

      // Get the string ID from the marhala object
      const marhalaId = typeof marhala._id === 'string' ? marhala._id : marhala._id?.toString();
      
      if (!marhalaId) {
        toast.error('মারহালা আইডি পাওয়া যায়নি');
        return;
      }

      // Ensure the ID is in the correct format
      if (!marhalaId.match(/^[0-9a-fA-F]{24}$/)) {
        toast.error('অবৈধ মারহালা আইডি');
        return;
      }
      
      const response = await updateMarhala(marhalaId, changes);
      console.log('Server response:', response);

      if (response.success) {
        toast.success('মারহালা আপডেট করা হয়েছে', { duration: 3000 });
        onSuccess(response.data);
        onClose();
      } else {
        const errorMessage = response.message || 'মারহালা আপডেট করতে সমস্যা হয়েছে';
        toast.error(errorMessage);
        console.error('Update failed:', response);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('মারহালা আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleRemoveKitab = (kitabId: string) => {
    setFormData(prev => ({
      ...prev,
      listOfKitabs: prev.listOfKitabs.filter(id => id !== kitabId)
    }));
  };

  const handleAddKitab = () => {
    if (!selectedKitab) return;
    
    if (formData.listOfKitabs.includes(selectedKitab)) {
      toast.error('এই কিতাব ইতিমধ্যে যোগ করা হয়েছে');
      return;
    }

    setFormData(prev => ({
      ...prev,
      listOfKitabs: [...prev.listOfKitabs, selectedKitab]
    }));
    setSelectedKitab('');
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="মারহালা সম্পাদনা">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <Label>মারহালার নাম (বাংলা) *</Label>
          <Input
            value={formData.bengaliName}
            onChange={(e) => setFormData(prev => ({ ...prev, bengaliName: e.target.value }))}
            placeholder="মারহালার নাম লিখুন"
            required
          />
        </div>

        <div>
          <Label>মারহালার নাম (আরবি)</Label>
          <Input
            value={formData.arabicName}
            onChange={(e) => setFormData(prev => ({ ...prev, arabicName: e.target.value }))}
            placeholder="মারহালার আরবি নাম লিখুন"
          />
        </div>

        <div>
          <Label>মারহালার ধরণ *</Label>
          <Select
            value={formData.marhalaType || marhala.marhalaType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, marhalaType: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="মারহালার ধরণ নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boys">বালক</SelectItem>
              <SelectItem value="girls">বালিকা</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>মারহালার ক্যাটাগরি *</Label>
          <Select
            value={formData.marhalaCategory || marhala.marhalaCategory}
            onValueChange={(value) => setFormData(prev => ({ ...prev, marhalaCategory: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="মারহালার ক্যাটাগরি নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="darsiyat">দারসিয়াত</SelectItem>
              <SelectItem value="hifz">হিফজ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>কিতাব তালিকা</Label>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedKitab}
                onValueChange={setSelectedKitab}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="কিতাব নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {availableKitabs.map((kitab) => (
                    <SelectItem key={kitab._id?.toString()} value={kitab._id?.toString() || ''}>
                      {kitab.name.bengaliName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button"
                onClick={handleAddKitab}
                className="bg-[#52B788] hover:bg-[#429b71]"
              >
                <MdAdd className="text-xl" />
              </Button>
            </div>

            <div className="mt-2 space-y-2">
              {formData.listOfKitabs.map((kitabId) => {
                const kitab = availableKitabs.find(k => k._id?.toString() === (typeof kitabId === 'object' ? kitabId._id : kitabId));
                const actualKitabId = typeof kitabId === 'object' ? kitabId._id : kitabId;
                return (
                  <div key={actualKitabId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{kitab?.name?.bengaliName}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKitab(actualKitabId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            বাতিল করুন
          </Button>
          <Button type="submit" className="bg-[#52B788] hover:bg-[#429b71]">
            সংরক্ষণ করুন
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
