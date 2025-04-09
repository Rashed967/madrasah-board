'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Autocomplete, AutocompleteItem } from '@/components/ui/autocomplete'
import { X } from 'lucide-react'
import { usePreExamineeStore } from '@/store/usePreExamineeStore'
import ExamineeRegistrationModal from '@/components/ExamineeRegistrationModal'
import { examineeRegistrationService } from '@/services/examineeRegistrationService'
import { examServices } from '@/services/examService'
import { madrasahServices } from '@/services/madrasahService'
import { IMadrasah } from '@/features/madrasah/interfaces'
import IExam from '@/features/exam/exam.interface'
import { Types } from 'mongoose';
import { TExamineeStatus } from '@/features/examineeRegistration/ExamineeRegistration.interface'
import { RegesteredExamineValidation } from '@/features/examineeRegistration/ExamineeRegistration.validation'

export default function ExamineRegistrationPage() {
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedMadrasah, setSelectedMadrasah] = useState('')
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedPreExaminee, setSelectedPreExaminee] = useState<any>(null)
  const [selectedMarhala, setSelectedMarhala] = useState<any>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null)
  const { preExaminees, loading, error, fetchPreExaminees } = usePreExamineeStore()
  const [selectedMadrasahId, setSelectedMadrasahId] = useState<string | null>(null)

  const initialFormData = {
    exam: '',
    madrasah: '',
    marhala: '',
    preExamineeRegistration: '',
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    mobile: '',
    status: 'pending' as TExamineeStatus,
    image: ''
  }

  const [formData, setFormData] = useState(initialFormData)

  // এক্সাম এবং মাদ্রাসা স্টেট
  const [exams, setExams] = useState<IExam[]>([])
  const [madrasahs, setMadrasahs] = useState<IMadrasah[]>([])
  const [searchMadrasah, setSearchMadrasah] = useState('')
  const [loadingExams, setLoadingExams] = useState(false)
  const [loadingMadrasahs, setLoadingMadrasahs] = useState(false)
  const [showMadrasahDropdown, setShowMadrasahDropdown] = useState(false)

  // এক্সাম লোড করা
  useEffect(() => {
    const loadExams = async () => {
      setLoadingExams(true)
      try {
        const queryParams = new URLSearchParams()
        queryParams.append('page', '1')
        queryParams.append('limit', '15')
        queryParams.append('sortBy', 'createdAt')
        queryParams.append('sortOrder', 'desc')
        queryParams.append('isCompleted', 'false')
        const response = await examServices.getAllExamForPreRegistration(queryParams.toString())
        if (response.success && response.data) {
          setExams(response.data)
        }
      } catch (error) {
        console.error('এক্সাম লোড করতে সমস্যা হয়েছে:', error)
      }
      setLoadingExams(false)
    }

    loadExams()
  }, [])

  // মাদ্রাসা সার্চ করা
  useEffect(() => {
    const loadMadrasahs = async () => {
      if (searchMadrasah.length < 2 || selectedMadrasahId) {
        setMadrasahs([])
        setShowMadrasahDropdown(false)
        return
      }

      setLoadingMadrasahs(true)
      try {
        const queryParams = new URLSearchParams()
        queryParams.append('page', '1')
        queryParams.append('limit', '10')
        if(searchMadrasah) {
          queryParams.append('searchTerm', searchMadrasah)
        }
        const response = await madrasahServices.getAllMadrasahs(queryParams.toString()) 
        if (response.success && response.data) {
          setMadrasahs(response.data)
          setShowMadrasahDropdown(true)
        }
      } catch (error) {
        console.error('মাদ্রাসা খুঁজতে সমস্যা হয়েছে:', error)
      }
      setLoadingMadrasahs(false)
    }

    const debounceTimer = setTimeout(loadMadrasahs, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchMadrasah, selectedMadrasahId])

  useEffect(() => {
    if (selectedExam && selectedMadrasah) {
      fetchPreExaminees(selectedExam, selectedMadrasah)
    }
  }, [selectedExam, selectedMadrasah])

  // useEffect(() => {
  //   if (preExaminees?.length > 0) {
  //     console.log('Pre Examinees Data:', preExaminees)
  //   }
  // }, [preExaminees])

  const handleMadrasahSelect = (madrasah: IMadrasah) => {
    setSelectedMadrasah(madrasah._id)
    setSelectedMadrasahId(madrasah._id)
    setSearchMadrasah(`${madrasah.madrasahNames?.bengaliName} - কোড: ${madrasah.code}`)
    setShowMadrasahDropdown(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setSelectedMadrasahId(null)
    }
    if (e.key === 'Enter' && selectedExam && selectedMadrasah) {
      handleSearch()
    }
  }

  const handleSearch = async () => {
    if (!selectedExam || !selectedMadrasah) {
      return;
    }

    try {
      await fetchPreExaminees(selectedExam, selectedMadrasah);
      // console.log('Pre-examinee data:', preExaminees);
    } catch (error) {
      console.error('প্রি-রেজিস্ট্রেশন ডেটা লোড করতে সমস্যা হয়েছে:', error)
    }
  }

  const handleRegistrationSubmit = async (formData: any) => {
    try {
      const registrationData = {
        exam: selectedExam,
        madrasah: selectedMadrasah,
        preExamineeRegistration: selectedPreExaminee._id,
        marhala: formData.marhala,
        examineeName: {
          bengaliName: formData.nameBangla,
          arabicName: formData.nameArabic,
          englishName: formData.nameEnglish
        },
        fatherName: {
          bengaliName: formData.fatherNameBangla,
          arabicName: formData.fatherNameArabic,
          englishName: formData.fatherNameEnglish
        },
        motherName: {
          bengaliName: formData.motherNameBangla,
          arabicName: formData.motherNameArabic,
          englishName: formData.motherNameEnglish
        },
        nid_or_birth_certificate_number: formData.nationalId,
        birthDate: formData.dateOfBirth,
        status: 'নির্বাচিত' as TExamineeStatus,
        image: formData.image || ''
      }

      // Convert to ObjectId
      const validationData = {
        ...registrationData,
        exam: registrationData.exam,
        madrasah: selectedMadrasah,
        preExamineeRegistration: registrationData.preExamineeRegistration,
        marhala: formData.marhala
      }

      // Validate the data
      const validationResult = RegesteredExamineValidation.createRegesteredExamineValidationSchema.safeParse({
        body: validationData
      });

      if (!validationResult.success) {
        console.error('ভ্যালিডেশন ত্রুটি:', validationResult.error);
        return;
      }

      // Prepare data for service with required objects
      const dataToSend = {
        ...registrationData,
        exam: new Types.ObjectId(registrationData.exam),
        madrasah: new Types.ObjectId(registrationData.madrasah),
        preExamineeRegistration: new Types.ObjectId(registrationData.preExamineeRegistration),
        marhala: new Types.ObjectId(registrationData.marhala)
      }

      console.log('Data to send:', dataToSend)

      const response = await examineeRegistrationService.create(dataToSend)
      
      if (response.success) {
        setShowSuccessModal(true)
        
        // Check if all slots are filled
        await fetchPreExaminees(selectedExam, selectedMadrasah)
        const updatedPreExaminee = preExaminees.find(
          (pe: any) => pe._id === selectedPreExaminee._id
        )
        
        const selectedMarhalaData = updatedPreExaminee?.examineesPerMahala.find(
          (marhala: any) => marhala.marhala._id === formData.marhala
        )

        if (selectedMarhalaData) {
          setRemainingSlots(selectedMarhalaData.remainingSlots)
          if (selectedMarhalaData.remainingSlots === 0) {
            // Wait for 2 seconds to show success message, then close modal
            setTimeout(() => {
              setShowRegistrationModal(false)
              setShowErrorModal(true)
            }, 2000)
          }
        }

        // Hide success message after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000)
      } else {
        console.error('নিবন্ধন ব্যর্থ হয়েছে:', response.message)
      }
    } catch (error) {
      console.error('নিবন্ধন ত্রুটি:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <div className="text-center">
              <div className="mb-4 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">নিবন্ধন সফল হয়েছে!</h3>
              <p className="text-gray-600">পরীক্ষার্থীর নিবন্ধন সফলভাবে সম্পন্ন হয়েছে।</p>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <div className="text-center">
              <div className="mb-4 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                স্লট শেষ
              </h2>
              <p className="text-gray-600">
                এই মারহালার জন্য সকল স্লট পূরণ হয়ে গেছে।
              </p>
              <Button
                onClick={() => setShowErrorModal(false)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">
          পরীক্ষার্থী নিবন্ধন ফরম
        </h1>
        <p className="text-gray-500 mt-2">
          প্রি-নিবন্ধনের ভিত্তিতে পরীক্ষার্থী নিবন্ধন করুন
        </p>
      </div>

      <Card className="bg-white shadow-md rounded-lg max-w-4xl mx-auto mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label className="text-base">পরীক্ষা নির্ধারণ *</Label>
              <Select
                value={selectedExam}
                onValueChange={setSelectedExam}
                disabled={loadingExams}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={loadingExams ? "লোড হচ্ছে..." : "পরীক্ষা নির্বাচন"} />
                </SelectTrigger>
                <SelectContent className='max-h-[120px] overflow-y-auto'>
                  {exams.map((exam) => (
                    <SelectItem
                      key={exam._id.toString()}
                      value={exam._id.toString()}
                    >
                      {exam.examName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 col-span-2">
              <Label className="text-base">মাদরাসা নির্ধারণ *</Label>
              <div className="relative">
                <Input
                  placeholder={loadingMadrasahs ? "খোঁজা হচ্ছে..." : "মাদরাসার নাম লিখুন"}
                  value={searchMadrasah}
                  onChange={(e) => setSearchMadrasah(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={loadingMadrasahs}
                  className="h-10 text-gray-700"
                />
                {showMadrasahDropdown && madrasahs.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <ul className="py-1 max-h[120px] overflow-y-auto">
                      {madrasahs.map((madrasah) => (
                        <li
                          key={madrasah._id.toString()}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                          onClick={() => handleMadrasahSelect(madrasah)}
                        >
                          <div>{madrasah.madrasahNames?.bengaliName}</div>
                          <div className="text-xs text-blue-400">
                            কোড: {madrasah.code}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSearch}
              disabled={!selectedExam || !selectedMadrasah || loading}
              className="px-6 py-2 bg-[#52b788] text-white rounded hover:bg-[#52b788]/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "খোঁজা হচ্ছে..." : "অনুসন্ধান করুন"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#52b788] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">❌</div>
          <p className="text-red-600">{error}</p>
        </div>
      ) : preExaminees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">এন্ট্রি তারিখ</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">মারহালা</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">মোট স্লট</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">অবশিষ্ট স্লট</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preExaminees.filter((preExaminee, index, self) =>
                index === self.findIndex((t) => (
                  t._id === preExaminee._id
                ))
              ).map((preExaminee) =>
                preExaminee.examineesPerMahala.map((marhala: any, index: number) => (
                  <tr key={`${preExaminee._id}-${index}`}>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {new Date(preExaminee.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {marhala?.marhala?.name?.bengaliName || 'অজানা মারহালা'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {marhala?.totalExamineesSlots || 0}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {marhala?.remainingSlots || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => {
                          if (marhala.remainingSlots === 0) {
                            setShowErrorModal(true)
                          } else {
                            setSelectedPreExaminee(preExaminee)
                            setSelectedMarhala(marhala.marhala)
                            setShowRegistrationModal(true)
                          }
                        }}
                        disabled={marhala.remainingSlots === 0}
                        className="px-4 py-2 bg-[#52b788] text-white rounded hover:bg-[#52b788]/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        নিবন্ধন
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {showRegistrationModal && selectedPreExaminee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowRegistrationModal(false)
                setSelectedMarhala(null)
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <ExamineeRegistrationModal
              preExaminee={selectedPreExaminee}
              onClose={() => setShowRegistrationModal(false)}
              onSubmit={handleRegistrationSubmit}
              selectedMarhala={selectedMarhala}
              showSuccessMessage={showSuccessModal}
              remainingSlots={remainingSlots}
            />
          </div>
        </div>
      )}
    </div>
  )
}
