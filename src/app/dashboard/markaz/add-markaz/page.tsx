'use client'
import React, { useRef } from 'react'
import SearchMadrasah from '@/components/SearchMadrasah'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import ShowSelectedMadrasahList from '@/components/ShowSelectedMadrasahList'
import useCreateMarkaz from '@/hooks/useCreateMarkaz'
import IStatusDialog from '@/types/statusDialog'
import StatusDialog from '@/components/ui/StatusDialog'
import useGetAllZones from '@/hooks/useGetAllZones'

const AddMarkaz = () => {
  const [statusDialog, setStatusDialog] = useState<IStatusDialog>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  const { mutate: createMarkaz } = useCreateMarkaz()
  const searchMadrasahRef1 = useRef<{ reset: () => void }>(null)
  const searchMadrasahRef2 = useRef<{ reset: () => void }>(null)

  const markazRef = useRef<HTMLInputElement>(null)
  const [selectedMadrasah, setSelectedMadrasah] = useState<string>(null)
  const [zoneSearchTerm, setZoneSearchTerm] = useState('')
  const [selectedZone, setSelectedZone] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  console.log(selectedZone)
  const [allMadrasah, setAllMadrasah] = useState<
    {
      name: string
      _id: string
      code: string
    }[]
  >([])

  const { data: zones } = useGetAllZones(zoneSearchTerm)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      !markazRef.current ||
      !markazRef.current.value ||
      !allMadrasah ||
      !selectedMadrasah ||
      !selectedZone
    )
      return
    const markaz = {
      madrasah: selectedMadrasah,
      allMadrasah: allMadrasah.map((m) => m._id),
      code: markazRef.current.value,
      zone: selectedZone._id
    }

    createMarkaz(markaz, {
      onSuccess: () => {
        markazRef.current.value = ''
        setSelectedMadrasah(null)
        setSelectedZone(null)
        setZoneSearchTerm('')
        setAllMadrasah([])
        searchMadrasahRef1.current?.reset()
        searchMadrasahRef2.current?.reset()
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল হয়েছে',
          message: 'মারকায সফলভাবে যোগ করা হয়েছে।'
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.log(error)
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ব্যর্থ হয়েছে!',
          message:
            error?.response?.data?.message ||
            'মারকায যোগ করা সম্ভব হয়নি। আবার চেষ্টা করুন।'
        })
      }
    })
  }

  return (
    <>
      <h3 className="text-center mt-10 font-bold text-lg">মারকায যুক্ত করুন</h3>
      <div className="w-11/12 md:w-3/4 lg:w-1/2 mx-auto mt-2 bg-white/90 px-4 py-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <SearchMadrasah
            ref={searchMadrasahRef1}
            onMadrasahSelect={(madrasah) => setSelectedMadrasah(madrasah?._id)}
            labelText="মারকায মাদ্রাসা"
          />
          <SearchMadrasah
            ref={searchMadrasahRef2}
            onMadrasahSelect={(madrasah) =>
              !allMadrasah.some((m) => m._id === madrasah._id) &&
              setAllMadrasah((prev) => [
                {
                  _id: madrasah._id,
                  name: madrasah.madrasahNames.bengaliName,
                  code: madrasah.code
                },
                ...prev
              ])
            }
            labelText="মাদ্রাসা অন্তর্ভুক্ত করুন"
          />

          <ShowSelectedMadrasahList
            madrasahs={allMadrasah}
            onRemove={(id) =>
              setAllMadrasah((prev) => prev.filter((m) => m._id !== id))
            }
          />
          <div>
            <Label>জোন</Label>
            <Input
              name="zone"
              onFocus={() => {
                if (selectedZone) {
                  setSelectedZone(null)
                  setZoneSearchTerm('')
                }
              }}
              type="text"
              value={selectedZone?.name || zoneSearchTerm}
              onChange={(e) => {
                const value = e.target.value
                setZoneSearchTerm(value)
                if (value.trim() !== '') {
                  setShowDropdown(true) // ড্রপডাউন খোলা
                } else {
                  setShowDropdown(false) // ড্রপডাউন বন্ধ
                }
              }}
            />
          </div>

          {zones?.data?.length > 0 && showDropdown && (
            <div className="absolute z-10 w-1/3 mt-1 bg-white border cursor-pointer border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {zones?.data.map((zone) => (
                <div
                  key={zone._id}
                  className={`p-2 cursor-pointer'bg-gray-100 hover:bg-gray-50`}
                  onClick={() => {
                    setSelectedZone(zone)
                    setShowDropdown(false)
                  }}
                >
                  <div className="font-medium">{zone.name}</div>
                  <div className="text-sm text-gray-600">কোড: {zone.code}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col">
            <Label>মারকায কোড</Label>
            <Input ref={markazRef} />
          </div>

          <Button variant="primary" size="sm" className="w-full">
            সেভ করুন
          </Button>
        </form>
      </div>

      <StatusDialog
        isOpen={statusDialog.isOpen}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
        onClose={() => setStatusDialog({ ...statusDialog, isOpen: false })}
      />
    </>
  )
}

export default AddMarkaz
