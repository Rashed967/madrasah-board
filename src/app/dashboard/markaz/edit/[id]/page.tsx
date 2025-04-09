'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'
// import { toast } from 'sonner'
import { IMarkazResponse } from '@/features/markaz/markaz.interface'
import { IMadrasah } from '@/features/madrasah/interfaces'
import { getAllMadrasahs } from '@/services/madrasahService'
import { updateMarkaz, getMarkazById } from '@/features/markaz/markazService'
import { MdDelete } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { convertToBengali } from '@/utils/convertToBengali'

export default function EditMarkazPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    code: '',
    madrasah: '',
    allMadrasah: [] as string[]
  })

  const [mainMadrasahs, setMainMadrasahs] = useState<IMadrasah[]>([])
  const [additionalMadrasahs, setAdditionalMadrasahs] = useState<IMadrasah[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermForAdd, setSearchTermForAdd] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [markaz, setMarkaz] = useState<IMarkazResponse | null>(null)

  useEffect(() => {
    const fetchMarkaz = async () => {
      try {
        const response = await getMarkazById(params.id)
        if (response.success && response.data) {
          const markazData = response.data as IMarkazResponse
          setMarkaz(markazData)
          setFormData({
            code: markazData.code,
            madrasah: markazData.madrasah._id.toString(),
            allMadrasah: markazData.allMadrasah.map(m => m._id.toString())
          })
          setSearchTerm(`${markazData.madrasah.madrasahNames.bengaliName} - কোড: ${markazData.madrasah.code}`)
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        toast.error('মারকাযের তথ্য লোড করতে সমস্যা হয়েছে')
      }
    }
    fetchMarkaz()
  }, [params.id])

  useEffect(() => {
    const searchMadrasahs = async () => {
      if (searchTerm.length < 3 && searchTerm !== markaz?.madrasah.madrasahNames.bengaliName) {
        setShowDropdown(false)
        return
      }

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '10');
        if(searchTerm) {
          queryParams.append('searchTerm', searchTerm);
        }
        const response = await getAllMadrasahs(queryParams.toString())
        if (response.success) {
          setMainMadrasahs(response.data)
          setShowDropdown(true)
        }
      } catch (error) {
        toast.error('মাদ্রাসা খুঁজতে সমস্যা হয়েছে')
      }
    }

    const debounceTimer = setTimeout(searchMadrasahs, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, markaz])

  useEffect(() => {
    const searchMadrasahsForAdd = async () => {
      if (searchTermForAdd.length < 3) {
        setShowAddDropdown(false)
        return
      }

      try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '10');
        if(searchTermForAdd) {
          queryParams.append('searchTerm', searchTermForAdd);
        }
        const response = await getAllMadrasahs(queryParams.toString())
        if (response.success) {
          setAdditionalMadrasahs(response.data)
          setShowAddDropdown(true)
        }
      } catch (error) {
        toast.error('মাদ্রাসা খুঁজতে সমস্যা হয়েছে')
      }
    }

    const debounceTimer = setTimeout(searchMadrasahsForAdd, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTermForAdd])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!markaz) return

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

      const changes: any = {}

      if (formData.code !== markaz.code) {
        changes.code = formData.code
      }

      if (formData.madrasah !== markaz.madrasah._id.toString()) {
        changes.madrasah = formData.madrasah
      }

      const originalMadrasahs = markaz.allMadrasah.map(m => m._id.toString())
      if (JSON.stringify(originalMadrasahs) !== JSON.stringify(formData.allMadrasah)) {
        changes.allMadrasah = formData.allMadrasah
      }

      if (Object.keys(changes).length === 0) {
        router.back()
        return
      }

      const response = await updateMarkaz(markaz._id.toString(), changes)

      if (response.success) {
        toast.success('মারকায আপডেট করা হয়েছে')
      } else {
        toast.error(response.message || 'মারকায আপডেট করতে সমস্যা হয়েছে')
      }
    } catch (error) {
      toast.error('মারকায আপডেট করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleMadrasahSelect = (madrasah: IMadrasah) => {
    setFormData(prev => ({ ...prev, madrasah: madrasah._id.toString() }))
    setSearchTerm(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`)
    setShowDropdown(false)
  }

  const handleAddMadrasah = (madrasah: IMadrasah) => {
    if (formData.allMadrasah.includes(madrasah._id.toString())) {
      toast.error('এই মাদ্রাসা ইতিমধ্যে যোগ করা হয়েছে')
      return
    }

    setFormData(prev => ({
      ...prev,
      allMadrasah: [...prev.allMadrasah, madrasah._id.toString()]
    }))
    setSearchTermForAdd('')
    setShowAddDropdown(false)
  }

  const handleRemoveMadrasah = (madrasahId: string) => {
    setFormData(prev => ({
      ...prev,
      allMadrasah: prev.allMadrasah.filter(id => id !== madrasahId)
    }))
  }

  if (!markaz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#52B788] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <Card className="bg-white shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-xl text-gray-800">মারকায সম্পাদনা</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base text-gray-800">মারকাযের কোড *</Label>
                  <Input
                    value={convertToBengali(formData.code)}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="মারকাযের কোড লিখুন"
                    required
                    className="h-10 text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base text-gray-800">মারকাযের মাদ্রাসা *</Label>
                  <div className="relative">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="মাদ্রাসার নাম লিখুন"
                      className="h-10 text-gray-700"
                    />
                    {showDropdown && mainMadrasahs.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <div className="max-h-48 overflow-y-auto">
                          {mainMadrasahs.map((madrasah) => (
                            <div
                              key={madrasah._id.toString()}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleMadrasahSelect(madrasah)}
                            >
                              <div className="text-sm">{madrasah.madrasahNames.bengaliName}</div>
                              <div className="text-xs text-gray-500"> কোড - {convertToBengali(madrasah.code)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base text-gray-800">মাদ্রাসা যোগ করুন</Label>
                  <div className="relative mt-2">
                    <Input
                      value={searchTermForAdd}
                      onChange={(e) => setSearchTermForAdd(e.target.value)}
                      placeholder="মাদ্রাসার নাম লিখুন"
                      className="h-10 text-gray-700"
                    />
                    {showAddDropdown && additionalMadrasahs.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <div className="max-h-48 overflow-y-auto">
                          {additionalMadrasahs
                            .filter(m => !formData.allMadrasah.includes(m._id.toString()))
                            .map((madrasah) => (
                              <div
                                key={madrasah._id.toString()}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleAddMadrasah(madrasah)}
                              >
                                <div className="text-sm text-gray-700">{madrasah.madrasahNames.bengaliName}</div>
                                <div className="text-xs text-gray-500">কোড: {convertToBengali(madrasah.code)}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base text-gray-800 ">যোগকৃত মাদ্রাসাসমূহ</Label>
                  <div className="mt-2 border rounded-lg divide-y">
                    {formData.allMadrasah.map((madrasahId) => {
                      const madrasah = additionalMadrasahs.find(m => m._id.toString() === madrasahId) ||
                        mainMadrasahs.find(m => m._id.toString() === madrasahId) ||
                        markaz.allMadrasah.find(m => m._id.toString() === madrasahId)
                      return (
                        <div key={madrasahId} className="flex items-center justify-between p-3 hover:bg-gray-50">
                          <div className="flex-1 mr-4">
                            <div className="font-medium text-gray-800">{madrasah?.madrasahNames?.bengaliName}</div>
                            <div className="text-sm text-gray-500">কোড: {convertToBengali(madrasah?.code)}</div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveMadrasah(madrasahId)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <MdDelete className="w-5 h-5" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="text-gray-700"
                >
                  বাতিল করুন
                </Button>
                <Button
                  type="submit"
                  className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                  disabled={loading}
                >
                  {loading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 