'use client'

import React, { useState } from 'react'
import useCreteZone from '@/hooks/useCreateZone'
import { StatusDialog } from '@/components/ui/status-dialog'
import ZoneName from '../components/ZoneName'
import ZoneDistrict from '../components/ZoneDistrict'
import ZoneSubmitButton from '../components/ZoneSubmitButton'
import { divisions } from '@/data/divisions'

// Districts List
const allDistricts: string[] = Object.values(divisions).flatMap((d) =>
  Object.keys(d)
)
const districts: string[] = [...new Set(allDistricts)].sort()

export default function AddZone() {
  const { disallowedDistricts, createZoneMutation, isCreatingZone } =
    useCreteZone()

  const [zoneName, setZoneName] = useState('')
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  const handleAddDistrict = (district: string) => {
    if (!selectedDistricts.includes(district)) {
      setSelectedDistricts([...selectedDistricts, district])
    }
  }

  const handleRemoveDistrict = (district: string) => {
    setSelectedDistricts(selectedDistricts.filter((d) => d !== district))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!zoneName.trim()) {
      openStatusDialog('error', 'ত্রুটি!', 'জোনের নাম দিন')
      return
    }

    createZoneMutation(
      { name: zoneName, allDistricts: selectedDistricts },
      {
        onSuccess: () => {
          openStatusDialog(
            'success',
            'সফলভাবে তৈরি হয়েছে',
            'জোন তৈরি করা হয়েছে'
          )
          setZoneName('')
          setSelectedDistricts([])
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          openStatusDialog(
            'error',
            'ত্রুটি!',
            error?.message || 'জোন তৈরি করতে সমস্যা হয়েছে'
          )
        }
      }
    )
  }

  const openStatusDialog = (
    type: 'success' | 'error',
    title: string,
    message: string
  ) => {
    setStatusDialog({ isOpen: true, type, title, message })
    if (type === 'success') {
      setTimeout(() => {
        closeStatusDialog()
      }, 3000)
    }
  }

  const closeStatusDialog = () => {
    setStatusDialog((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-base md:text-lg font-bold mb-6 text-gray-800">
          নতুন জোন যোগ করুন
        </h1>

        <form onSubmit={handleSubmit}>
          <ZoneName zoneName={zoneName} setZoneName={setZoneName} />

          <ZoneDistrict
            districts={districts}
            selectedDistricts={selectedDistricts}
            allDisallowedDistricts={disallowedDistricts}
            onAddDistrict={handleAddDistrict}
            onRemoveDistrict={handleRemoveDistrict}
          />

          <ZoneSubmitButton isLoading={isCreatingZone} />
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
  )
}
