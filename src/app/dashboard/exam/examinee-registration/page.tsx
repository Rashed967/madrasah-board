'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IoSearch } from 'react-icons/io5'
import ExamSelectionForExamineeRegistrationPage from '@/components/examinee-registration/ExamSelectionForExamineeRegistrationPage'
import MadrasahSelectionForExamineeRegistration from '@/components/examinee-registration/MadrasahSelectionForExamineeRegistration'
import ExamineeRegistrationTable from '@/components/examinee-registration/ExamineeRegistrationTable'
import { getAllExams } from '@/actions/exam'
import axios from 'axios'

interface Exam {
  _id: string
  examName: string
  endRegistrationDate: string
  registrationStartNumber: number
  currentRegistrationNumber: number
  registrationFeeForRegularStudent: number
  registrationFeeForIrregularStudent: number
  lateRegistrationFeeForRegularStudent: number
  lateRegistrationFeeForIrregularStudent: number
}

interface ExamResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: Exam[]
}

interface MadrasahNames {
  bengaliName: string
  arabicName: string
  englishName: string
  _id: string
  id: string
}

interface MadrasahAddress {
  _id: string
  division: string
  district: string
  subDistrict_policeStation: string
  postOffice: string
  village: string
  holdingNumber: string
  id: string
}

interface MadrasahInformation {
  _id: string
  madrasahType: string
  totalStudents: number
  totalTeacherAndStuff: number
  id: string
}

interface Madrasah {
  _id: string
  madrasahNames: MadrasahNames
  code: string
  email: string
  communicatorName: string
  contactNo1: string
  contactNo2: string
  address: MadrasahAddress
  madrasah_information: MadrasahInformation
  id: string
}

const ExamineeRegistrationPage = () => {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<string>('')
  const [selectedMadrasah, setSelectedMadrasah] = useState<Madrasah | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true)
        const accessToken = localStorage.getItem('access_token')

        const response = await axios.get<ExamResponse>(
          `${process.env.NEXT_PUBLIC_MAIN_URL}/exams`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          }
        )

        if (response.data && response.data.success && response.data.data) {
          setExams(response.data.data)
        } else {
          setError('পরীক্ষার তথ্য পাওয়া যায়নি')
        }
      } catch (err) {
        console.error('Error fetching exams:', err)
        setError('পরীক্ষার তথ্য লোড করতে সমস্যা হয়েছে')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExams()
  }, [])

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId)
    
  }

  const handleMadrasahSelect = (madrasah: Madrasah | null) => {
    setSelectedMadrasah(madrasah)
    
  }

  return (
    <div className="container w-full mx-auto mt-8 px-4 text-gray-800">
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            পরীক্ষার্থী নিবন্ধন
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-4">
              {/* Select Dropdown */}
              <ExamSelectionForExamineeRegistrationPage
                exams={exams}
                onExamSelect={handleExamSelect}
              />
              {/* Search Input with Button */}
              <MadrasahSelectionForExamineeRegistration
                onMadrasahSelect={handleMadrasahSelect}
              />
            </div>
          </form>

          {/* Table Component */}
          <ExamineeRegistrationTable
            selectedExamId={selectedExamId}
            selectedMadrasahId={selectedMadrasah?._id}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ExamineeRegistrationPage
