'use client'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IMadrasah } from '@/features/madrasah/interfaces'
import { IMarkazResponse } from '@/features/markaz/markaz.interface'
import { updateMarkaz } from '@/features/markaz/markazService'
import { getAllMadrasahs } from '@/services/madrasahService'
import { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'sonner'

interface EditMarkazDialogProps {
  markaz: IMarkazResponse
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditMarkazDialog({
  markaz,
  isOpen,
  onClose,
  onSuccess
}: EditMarkazDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    madrasah: '',
    allMadrasah: [] as string[]
  })
  console.log(markaz)
  

  const [availableMadrasahs, setAvailableMadrasahs] = useState<IMadrasah[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermForAdd, setSearchTermForAdd] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (markaz) {
      console.log(markaz.allMadrasahInMarkaz)
      setFormData({
        code: markaz.code,
        madrasah: markaz.madrasah._id.toString(),
        allMadrasah: markaz.allMadrasahInMarkaz.map((m) => m._id.toString())
      })
      setSearchTerm(markaz.madrasah.madrasahNames.bengaliName)
    }
  }, [markaz])

  useEffect(() => {
    const searchMadrasahs = async () => {
      if (
        searchTerm.length < 2 &&
        searchTerm !== markaz.madrasah.madrasahNames.bengaliName
      ) {
        setShowDropdown(false)
        return
      }

      try {
        const response = await getAllMadrasahs(`search=${searchTerm}`)
        if (response.success) {
          setAvailableMadrasahs(response.data)
          setShowDropdown(true)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error('মাদ্রাসা খুঁজতে সমস্যা হয়েছে')
      }
    }

    const debounceTimer = setTimeout(searchMadrasahs, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, markaz.madrasah.madrasahNames.bengaliName])

  useEffect(() => {
    const searchMadrasahsForAdd = async () => {
      if (searchTermForAdd.length < 2) {
        setShowAddDropdown(false)
        return
      }

      try {
        const response = await getAllMadrasahs(`search=${searchTermForAdd}`)
        if (response.success) {
          setAvailableMadrasahs(response.data)
          setShowAddDropdown(true)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('মাদ্রাসা খুঁজতে সমস্যা হয়েছে')
      }
    }

    const debounceTimer = setTimeout(searchMadrasahsForAdd, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTermForAdd])

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.code.trim()) {
        toast.error('মারকাযের কোড দিন')
        return
      }

      if (!formData.madrasah) {
        toast.error('মারকাযের মাদ্রাসা নির্বাচন করুন')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const changes: any = {}

      if (formData.code !== markaz.code) {
        changes.code = formData.code
      }

      if (formData.madrasah !== markaz.madrasah._id.toString()) {
        changes.madrasah = formData.madrasah
      }

      const originalMadrasahs = markaz.allMadrasah.map((m) => m._id.toString())
      if (
        JSON.stringify(originalMadrasahs) !==
        JSON.stringify(formData.allMadrasah)
      ) {
        changes.allMadrasah = formData.allMadrasah
      }

      if (Object.keys(changes).length === 0) {
        onClose()
        return
      }

      const response = await updateMarkaz(markaz._id.toString(), changes)

      if (response.success) {
        toast.success('মারকায আপডেট করা হয়েছে')
        onSuccess()
        onClose()
      } else {
        toast.error(response.message || 'মারকায আপডেট করতে সমস্যা হয়েছে')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('মারকায আপডেট করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleMadrasahSelect = (madrasah: IMadrasah) => {
    setFormData((prev) => ({ ...prev, madrasah: madrasah._id.toString() }))
    setSearchTerm(madrasah.madrasahNames.bengaliName)
    setShowDropdown(false)
  }

  const handleAddMadrasah = (madrasah: IMadrasah) => {
    if (formData.allMadrasah.includes(madrasah._id.toString())) {
      toast.error('এই মাদ্রাসা ইতিমধ্যে যোগ করা হয়েছে')
      return
    }

    setFormData((prev) => ({
      ...prev,
      allMadrasah: [...prev.allMadrasah, madrasah._id.toString()]
    }))
    setSearchTermForAdd('')
    setShowAddDropdown(false)
  }

  const handleRemoveMadrasah = (madrasahId: string) => {
    setFormData((prev) => ({
      ...prev,
      allMadrasah: prev.allMadrasah.filter((id) => id !== madrasahId)
    }))
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="মারকায সম্পাদনা">
      <form
        onSubmit={(e) => {
          e.preventDefault()
         
        }}
        className="space-y-4 max-h-[80vh] overflow-y-auto pr-2"
      >
        <div>
          <Label>মারকাযের কোড *</Label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="মারকাযের কোড লিখুন"
            required
          />
        </div>

        <div className="space-y-1">
          <Label>মারকাযের মাদ্রাসা *</Label>
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="মাদ্রাসার নাম লিখুন"
              className="w-full"
            />
            {showDropdown && availableMadrasahs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="max-h-48 overflow-y-auto">
                  {availableMadrasahs.map((madrasah) => (
                    <div
                      key={madrasah._id.toString()}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleMadrasahSelect(madrasah)}
                    >
                      <div className="text-sm">
                        {madrasah.madrasahNames.bengaliName}
                      </div>
                      <div className="text-xs text-gray-500">
                        কোড: {madrasah.code}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>মাদ্রাসা যোগ করুন</Label>
          <div className="relative">
            <div className="flex gap-2">
              <Input
                value={searchTermForAdd}
                onChange={(e) => setSearchTermForAdd(e.target.value)}
                placeholder="মাদ্রাসার নাম লিখুন"
                className="flex-1"
              />
            </div>
            {showAddDropdown && availableMadrasahs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="max-h-48 overflow-y-auto">
                  {availableMadrasahs
                    .filter(
                      (m) => !formData.allMadrasah.includes(m._id.toString())
                    )
                    .map((madrasah) => (
                      <div
                        key={madrasah._id.toString()}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddMadrasah(madrasah)}
                      >
                        <div className="text-sm">
                          {madrasah.madrasahNames.bengaliName}
                        </div>
                        <div className="text-xs text-gray-500">
                          কোড: {madrasah.code}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>যোগকৃত মাদ্রাসাসমূহ</Label>
          <div className="mt-2 border rounded-lg p-2 max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {formData.allMadrasah.map((madrasahId) => {
                const madrasah =
                  availableMadrasahs.find(
                    (m) => m._id.toString() === madrasahId
                  ) ||
                  markaz.allMadrasah.find(
                    (m) => m._id.toString() === madrasahId
                  )
                return (
                  <div
                    key={madrasahId}
                    className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-sm"
                  >
                    <div className="flex-1 mr-2">
                      <div className="text-sm">
                        {madrasah?.madrasahNames.bengaliName}
                      </div>
                      <div className="text-xs text-gray-500">
                        কোড: {madrasah?.code}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveMadrasah(madrasahId)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <MdDelete className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            বাতিল করুন
          </Button>
          <Button
            type="submit"
            className="bg-[#52B788] hover:bg-[#52B788]/90"
            disabled={loading}
          >
            {loading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
