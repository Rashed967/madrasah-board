'use client'
import React from 'react'
import SearchMadrasah from '@/components/SearchMadrasah'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const AddMarkaz = () => {
  const [selectedMadrasah, setSelectedMadrasah] = useState<string>(null)
  const [allMadrasah, setAllMadrasah] = useState<string[]>([])
  console.log(selectedMadrasah)
  console.log(allMadrasah)

  return (
    <>
      <div className="w-11/12 md:w-3/4 lg:w-1/2 mx-auto mt-7">
        <form className="space-y-5">
          <SearchMadrasah
            onMadrasahSelect={(madrasah) => setSelectedMadrasah(madrasah?._id)}
            labelText="মারকায মাদ্রাসা"
          />
          <SearchMadrasah
            onMadrasahSelect={(madrasah) =>
              !allMadrasah.includes(madrasah._id) &&
              setAllMadrasah((prev) => [madrasah._id, ...prev])
            }
            labelText="মাদ্রাসা অন্তর্ভুক্ত করুন"
          />

          <div className="flex flex-col">
            <Label>মারকায কোড</Label>
            <Input />
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
