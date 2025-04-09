'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ImageUploadProps {
  label: string
  value?: string
  onChange: (field: string, value: string) => void
  fieldName: string
  onImageUpload?: (url: string) => void
  error?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  fieldName,
  onImageUpload,
  error
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('শুধুমাত্র ছবি আপলোড করা যাবে')
        return
      }

      // Validate file size (300KB)
      const maxSizeKB = 300
      const fileSizeKB = Math.round(file.size / 1024)
      if (fileSizeKB > maxSizeKB) {
        setErrorMessage(
          `ছবির সাইজ ${maxSizeKB}KB এর বেশি হতে পারবে না (বর্তমান সাইজ: ${fileSizeKB}KB)`
        )
        return
      }
      setErrorMessage('')

      try {
        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'madrasah_images')

        const cloudName = 'dpes1dyqb'
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        )

        if (!response.ok) {
          throw new Error('ছবি আপলোড করতে সমস্যা হয়েছে')
        }

        const data = await response.json()
        const imageUrl = data.secure_url

        onChange(fieldName, imageUrl)
        if (onImageUpload) {
          onImageUpload(imageUrl)
        }
        setFileName(file.name)
        toast.success('ছবি সফলভাবে আপলোড হয়েছে')
      } catch (error) {
        console.error('ছবি আপলোড ত্রুটি:', error)
        toast.error('ছবি আপলোড করতে সমস্যা হয়েছে')
      } finally {
        setIsUploading(false)
      }
    },
    [fieldName, onChange, onImageUpload]
  )

  return (
    <div className="space-y-2">
      <Label className="text-base">{label}</Label>
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="outline"
          className={`relative ${isUploading ? 'cursor-not-allowed' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              আপলোড হচ্ছে...
            </>
          ) : (
            'ছবি আপলোড করুন'
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={isUploading}
          />
        </Button>
        {fileName && <span className="text-sm text-gray-500">{fileName}</span>}
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Uploaded"
            className="max-w-[200px] h-auto rounded-md"
          />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
