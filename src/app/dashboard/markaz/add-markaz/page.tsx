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
  const [allMadrasah, setAllMadrasah] = useState<
    {
      name: string
      _id: string
      code: string
    }[]
  >([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      !markazRef.current ||
      !markazRef.current.value ||
      !allMadrasah ||
      !selectedMadrasah
    )
      return
    const markaz = {
      madrasah: selectedMadrasah,
      allMadrasah: allMadrasah.map((m) => m._id),
      code: markazRef.current.value
    }

    createMarkaz(markaz, {
      onSuccess: () => {
        markazRef.current.value = ''
        setSelectedMadrasah(null)
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
      onError: (error) => {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ব্যর্থ হয়েছে!',
          message:
            error.message || 'মারকায যোগ করা সম্ভব হয়নি। আবার চেষ্টা করুন।'
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
