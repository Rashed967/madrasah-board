'use client'
import React, { useRef } from 'react'
import SearchMadrasah from '@/components/SearchMadrasah'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import ShowSelectedMadrasahList from '@/components/ShowSelectedMadrasahList'

const AddMarkaz = () => {
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
  console.log(selectedMadrasah)
  console.log(allMadrasah)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!markazRef.current || !markazRef.current.value) return
    const markaz = {
      madrasah: selectedMadrasah,
      allMadrasah: allMadrasah.map((m) => m._id),
      code: markazRef.current.value
    }
    console.log(markaz)
    markazRef.current.value = ''
    setSelectedMadrasah(null)
    setAllMadrasah([])

    // সার্চ ইনপুট রিসেট
    searchMadrasahRef1.current?.reset()
    searchMadrasahRef2.current?.reset()
  }

  return (
    <>
      <div className="w-11/12 md:w-3/4 lg:w-1/2 mx-auto mt-7">
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
    </>
  )
}

export default AddMarkaz
