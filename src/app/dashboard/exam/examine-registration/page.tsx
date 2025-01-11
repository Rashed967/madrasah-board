'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Autocomplete, AutocompleteItem } from "@/components/ui/autocomplete";
import { X } from 'lucide-react';

// Mock data - replace with actual data fetching
const EXAM_OPTIONS = [
  { value: 'dakhil', label: 'দাখিল পরীক্ষা' },
  { value: 'alim', label: 'আলিম পরীক্ষা' },
  { value: 'fazil', label: 'ফাজিল পরীক্ষা' },
];

const MARHALA_OPTIONS = [
  { value: 'primary', label: 'প্রাথমিক' },
  { value: 'secondary', label: 'মাধ্যমিক' },
  { value: 'higher', label: 'উচ্চ মাধ্যমিক' },
];

const MADRASAH_OPTIONS = [
  { value: 'madrasah1', label: 'মাদ্রাসা ১' },
  { value: 'madrasah2', label: 'মাদ্রাসা ২' },
  { value: 'madrasah3', label: 'মাদ্রাসা ৩' },
];

export default function ExamineRegistrationPage() {
  const [formData, setFormData] = useState({
    exam: '',
    madrasah: '',
    marhala: '',
    examineType: '',
    nameBangla: '',
    nameArabic: '',
    nameEnglish: '',
    fatherNameBangla: '',
    fatherNameArabic: '',
    fatherNameEnglish: '',
    dateOfBirth: '',
    nationalId: '',
    photo: null as File | null
  });

  const [fee, setFee] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExamineTypeChange = (value: string) => {
    // Logic to calculate fee based on examine type
    setFee(value === 'regular' ? 500 : 750);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submission logic
    console.log(formData);
    
    // Show success modal
    setShowSuccessModal(true);

    // Automatically hide modal after 2 seconds
    const timer = setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);

    // Clear form after submission
    setFormData({
      exam: '',
      madrasah: '',
      marhala: '',
      examineType: '',
      nameBangla: '',
      nameArabic: '',
      nameEnglish: '',
      fatherNameBangla: '',
      fatherNameArabic: '',
      fatherNameEnglish: '',
      dateOfBirth: '',
      nationalId: '',
      photo: null
    });
    setFee(null);

    // Cleanup timer
    return () => clearTimeout(timer);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="container mx-auto p-4 mt-16 relative">
      {/* Standalone Centered Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          পরীক্ষার্থী নিবন্ধন ফরম
        </h1>
        <p className="text-gray-500 mt-2">
          অনুগ্রহ করে নিম্নলিখিত তথ্যগুলি সঠিকভাবে পূরণ করুন
        </p>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <button 
              onClick={closeSuccessModal} 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="mb-4 text-green-600">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                নিবন্ধন সফল হয়েছে
              </h2>
              <p className="text-gray-600">
                পরীক্ষার্থীর তথ্য সফলভাবে সংরক্ষিত হয়েছে।
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exam Selection */}
              <div className="space-y-1">
                <Label className="text-base">পরীক্ষা নির্ধারণ *</Label>
                <Select 
                  value={formData.exam}
                  onValueChange={(value) => handleInputChange('exam', value)}
                  required
                >
                  <SelectTrigger className="h-8 text-base">
                    <SelectValue placeholder="পরীক্ষা নির্বাচন" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_OPTIONS.map(exam => (
                      <SelectItem key={exam.value} value={exam.value} className="text-base">
                        {exam.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Madrasah Selection */}
              <div className="space-y-1">
                <Label className="text-base">মাদরাসা নির্ধারণ *</Label>
                <Autocomplete
                  placeholder="মাদরাসা নাম"
                  value={formData.madrasah}
                  onValueChange={(value) => handleInputChange('madrasah', value)}
                  className="h-8"
                >
                  {MADRASAH_OPTIONS.map(madrasah => (
                    <AutocompleteItem 
                      key={madrasah.value} 
                      value={madrasah.value}
                      className="text-base"
                    >
                      {madrasah.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              {/* Marhala Selection */}
              <div className="space-y-1">
                <Label className="text-base">মারহালা নির্ধারণ *</Label>
                <Select 
                  value={formData.marhala}
                  onValueChange={(value) => handleInputChange('marhala', value)}
                  required
                >
                  <SelectTrigger className="h-8 text-base">
                    <SelectValue placeholder="মারহালা নির্বাচন" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARHALA_OPTIONS.map(marhala => (
                      <SelectItem key={marhala.value} value={marhala.value} className="text-base">
                        {marhala.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Examine Type */}
              <div className="space-y-1">
                <Label className="text-base">পরীক্ষার্থীর ধরণ *</Label>
                <Select 
                  value={formData.examineType}
                  onValueChange={(value) => {
                    handleInputChange('examineType', value);
                    handleExamineTypeChange(value);
                  }}
                  required
                >
                  <SelectTrigger className="h-8 text-base">
                    <SelectValue placeholder="ধরণ নির্বাচন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular" className="text-base">নিয়মিত</SelectItem>
                    <SelectItem value="irregular" className="text-base">অনিয়মিত</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name Fields */}
              <div className="space-y-1">
                <Label className="text-base">পরীক্ষার্থীর নাম (বাংলা) *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.nameBangla}
                  onChange={(e) => handleInputChange('nameBangla', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-base">পরীক্ষার্থীর নাম (আরবী) *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.nameArabic}
                  onChange={(e) => handleInputChange('nameArabic', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-base">পরীক্ষার্থীর নাম (ইংরেজী) *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.nameEnglish}
                  onChange={(e) => handleInputChange('nameEnglish', e.target.value)}
                  required 
                />
              </div>

              {/* Father's Name Fields */}
              <div className="space-y-1">
                <Label className="text-base">পিতার নাম (বাংলা) *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.fatherNameBangla}
                  onChange={(e) => handleInputChange('fatherNameBangla', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-base">পিতার নাম (আরবী) *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.fatherNameArabic}
                  onChange={(e) => handleInputChange('fatherNameArabic', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-base">পিতার নাম (ইংরেজী) *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.fatherNameEnglish}
                  onChange={(e) => handleInputChange('fatherNameEnglish', e.target.value)}
                  required 
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <Label className="text-base">জন্ম তারিখ *</Label>
                <Input 
                  type="date"
                  className="h-8 text-base"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required 
                />
              </div>

              {/* National ID */}
              <div className="space-y-1">
                <Label className="text-base">জন্ম নিবন্ধন / জাতীয় পরিচয় পত্র *</Label>
                <Input 
                  className="h-8 text-base"
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange('nationalId', e.target.value)}
                  required 
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-1">
                <Label className="text-base">ছবি *</Label>
                <Input 
                  type="file"
                  accept="image/*"
                  className="h-8 text-base file:text-base file:mr-2 file:px-2 file:py-1"
                  onChange={(e) => handleInputChange('photo', e.target.files?.[0] || null)}
                  required 
                />
              </div>
            </div>

            {/* Fee Display */}
            {fee && (
              <div className="text-right text-base font-semibold text-gray-700 mt-2">
                পরীক্ষার্থীর ফি: {fee} টাকা
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-3">
              <Button 
                type="submit" 
                variant="primary"
                className="px-3 py-1 text-base bg-[#52b788] text-white rounded hover:bg-[#52b788]/70 transition-colors"
              >
                নিবন্ধন করুন
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
