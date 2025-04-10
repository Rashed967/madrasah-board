'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import ImageUpload from '@/app/dashboard/exam/examine-registration/components/ImageUpload'

interface ExamineeRegistrationModalProps {
  preExaminee: any
  onClose: () => void
  onSubmit: (data: any) => void
  selectedMarhala?: any
  showSuccessMessage?: boolean
  remainingSlots?: number
}

export default function ExamineeRegistrationModal({
  preExaminee,
  onClose,
  onSubmit,
  selectedMarhala,
  showSuccessMessage,
  remainingSlots
}: ExamineeRegistrationModalProps) {
  const [formData, setFormData] = useState({
    examineType: '',
    nameBangla: '',
    nameArabic: '',
    nameEnglish: '',
    fatherNameBangla: '',
    fatherNameArabic: '',
    fatherNameEnglish: '',
    motherNameBangla: '',
    motherNameArabic: '',
    motherNameEnglish: '',
    dateOfBirth: '',
    nationalId: '',
    photo: null,
    marhala: selectedMarhala?._id || '',
    image: ''
  })

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(formData)
      
      // Reset form data except marhala
      const currentMarhala = formData.marhala
      setFormData({
        examineType: '',
        nameBangla: '',
        nameArabic: '',
        nameEnglish: '',
        fatherNameBangla: '',
        fatherNameArabic: '',
        fatherNameEnglish: '',
        motherNameBangla: '',
        motherNameArabic: '',
        motherNameEnglish: '',
        dateOfBirth: '',
        nationalId: '',
        image: '',
        photo: null,
        marhala: currentMarhala // Keep the current marhala
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {showSuccessMessage && (
        <div className="absolute top-0 left-0 right-0 bg-green-100 p-4 rounded-t-lg z-50">
          <div className="flex items-center justify-center text-green-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>নিবন্ধন সফল হয়েছে!</span>
            {remainingSlots === 0 && (
              <span className="ml-2 text-orange-600">
                (এই মারহালার সকল স্লট পূরণ হয়েছে)
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marhala Selection */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">মারহালা নির্ধারণ *</Label>
            <Select
              value={formData.marhala}
              onValueChange={(value) => handleInputChange('marhala', value)}
              disabled={!!selectedMarhala}
              required
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="মারহালা নির্বাচন" />
              </SelectTrigger>
              <SelectContent>
                {preExaminee.examineesPerMahala.map((marhala: any) => (
                  <SelectItem
                    key={marhala.marhala._id}
                    value={marhala.marhala._id}
                    disabled={marhala.remainingSlots === 0}
                  >
                    {marhala.marhala.name.bengaliName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Examine Type */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পরীক্ষার্থীর ধরণ</Label>
            <Select
              value={formData.examineType}
              onValueChange={(value) => handleInputChange('examineType', value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="ধরণ নির্বাচন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="নিয়মিত">নিয়মিত</SelectItem>
                <SelectItem value="অনিয়মিত">অনিয়মিত</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name Fields */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পরীক্ষার্থীর নাম (বাংলা) *</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.nameBangla}
              onChange={(e) => handleInputChange('nameBangla', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পরীক্ষার্থীর নাম (আরবী) *</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.nameArabic}
              onChange={(e) => handleInputChange('nameArabic', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পরীক্ষার্থীর নাম (ইংরেজী)</Label>
            <Input
              className="h-10"
              value={formData.nameEnglish}
              onChange={(e) => handleInputChange('nameEnglish', e.target.value)}
            />
          </div>

          {/* Father's Name Fields */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পিতার নাম (বাংলা) *</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.fatherNameBangla}
              onChange={(e) => handleInputChange('fatherNameBangla', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পিতার নাম (আরবী)</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.fatherNameArabic}
              onChange={(e) => handleInputChange('fatherNameArabic', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-base text-gray-700">পিতার নাম (ইংরেজী)</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.fatherNameEnglish}
              onChange={(e) => handleInputChange('fatherNameEnglish', e.target.value)}
            />
          </div>

          {/* Mother's Name Fields */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">মাতার নাম (বাংলা) *</Label>
            <Input
              className="h-10"
              value={formData.motherNameBangla}
              onChange={(e) => handleInputChange('motherNameBangla', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-base text-gray-700">মাতার নাম (আরবী)</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.motherNameArabic}
              onChange={(e) => handleInputChange('motherNameArabic', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-base text-gray-700">মাতার নাম (ইংরেজী)</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.motherNameEnglish}
              onChange={(e) => handleInputChange('motherNameEnglish', e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">জন্ম তারিখ *</Label>
            <Input
              type="date"
              className="h-10 text-gray-800"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              required
            />
          </div>

          {/* National ID */}
          <div className="space-y-1">
            <Label className="text-base text-gray-700">জন্ম নিবন্ধন / জাতীয় পরিচয় পত্র *</Label>
            <Input
              className="h-10 text-gray-800"
              value={formData.nationalId}
              onChange={(e) => handleInputChange('nationalId', e.target.value)}
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
              <ImageUpload
                label="পরীক্ষার্থীর ছবি *"
                fieldName="image"
                value={formData.image}
                onChange={handleInputChange}
                error={null}
              />
            </div> */}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="px-6 py-2 text-gray-800"
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-[#52b788] text-white hover:bg-[#52b788]/70"
          >
            নিবন্ধন
          </Button>
        </div>
      </div>
    </form>
  )
}
