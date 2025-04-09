'use client'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusDialog } from '@/components/ui/status-dialog'
import { IoAddCircle } from 'react-icons/io5'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { examServices } from '@/services/examService'
import { PreExamineeRegistrationValidation } from '@/features/preExamineeRegistration/validation'
import globalValidateRequest from '@/middleware/globalValidateRequest'
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService'
import { usePreExamineeForm } from '@/hooks/usePreExamineeForm'
import { useStatusDialog } from '@/hooks/useStatusDialog'
import {
  ExamType,
  IPaymentDetail,
  PreExamineeRegistrationData
} from '@/types/preExaminee.types'
import { VaultIcon } from 'lucide-react'
import { getBoardInfo } from '@/features/boardInfo/boardInfor.service'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import IBoardInfo from '@/features/boardInfo/boardInfo.interface'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'
import { generatePreExamineeReceipt } from '@/utils/pdfGenerator'
import IPreExamineeRegistration from '@/features/preExamineeRegistration/interfaces'
import { getAllMarhalas } from '@/features/marhala/marhala.service'
import { IMarhala } from '@/features/marhala/marhala.interface'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any
    lastAutoTable: {
      finalY: number
    }
  }
}

// Dynamically import components
const ExamSelection = dynamic(
  () =>
    import('@/components/pre-examinee/ExamSelection').then(
      (mod) => mod.default
    ),
  {
    loading: () => <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
  }
)

const MadrasahSearch = dynamic(
  () =>
    import('@/components/pre-examinee/MadrasahSearch').then(
      (mod) => mod.default
    ),
  {
    loading: () => <div className="h-20 bg-gray-100 animate-pulse rounded-md" />
  }
)

const MarhalaRegistrationTable = dynamic(
  () =>
    import('@/components/pre-examinee/MarhalaRegistrationTable').then(
      (mod) => mod.default
    ),
  {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-md" />
  }
)

const TransactionForm = dynamic(
  () =>
    import('@/components/pre-examinee/TransactionForm').then(
      (mod) => mod.default
    ),
  {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
  }
)

// Helper function to convert English numbers to Bengali
const toBengaliNumber = (num: number | string) => {
  const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return num.toString().replace(/[0-9]/g, (d) => bengaliNumbers[parseInt(d)])
}

// Helper function to convert number to Bengali words
const numberToBengaliWords = (number: number) => {
  const units = [
    '',
    'এক',
    'দুই',
    'তিন',
    'চার',
    'পাঁচ',
    'ছয়',
    'সাত',
    'আট',
    'নয়'
  ]
  const teens = [
    'দশ',
    'এগার',
    'বার',
    'তের',
    'চৌদ্দ',
    'পনের',
    'ষোল',
    'সতের',
    'আঠার',
    'ঊনিশ'
  ]
  const tens = [
    '',
    'দশ',
    'বিশ',
    'ত্রিশ',
    'চল্লিশ',
    'পঞ্চাশ',
    'ষাট',
    'সত্তর',
    'আশি',
    'নব্বই'
  ]
  const scales = ['', 'হাজার', 'লক্ষ', 'কোটি']

  if (number === 0) return 'শূন্য'

  const processGroup = (n: number, scaleIndex: number): string => {
    if (n === 0) return ''

    let words = ''

    if (n > 99) {
      words += units[Math.floor(n / 100)] + 'শত '
      n %= 100
    }

    if (n > 19) {
      words += tens[Math.floor(n / 10)] + ' '
      if (n % 10 > 0) words += units[n % 10] + ' '
    } else if (n > 9) {
      words += teens[n - 10] + ' '
    } else if (n > 0) {
      words += units[n] + ' '
    }

    if (scaleIndex > 0 && words !== '') {
      words += scales[scaleIndex] + ' '
    }

    return words
  }

  let result = ''
  let remaining = number
  let scaleIndex = 0

  while (remaining > 0) {
    const group = remaining % 1000
    if (group > 0) {
      result = processGroup(group, scaleIndex) + result
    }
    remaining = Math.floor(remaining / 1000)
    scaleIndex++
  }

  return result.trim()
}

export default function PreExamineeRegistrationPage() {
  const [exams, setExams] = useState([])
  const [selectedExamDetails, setSelectedExamDetails] =
    useState<ExamType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [boardInfo, setBoardInfo] = useState<IBoardInfo | null>(null)
  const [marhalas, setMarhalas] = useState<IMarhala[]>([])

  const { statusDialog, showSuccessDialog, showErrorDialog, closeDialog } =
    useStatusDialog()

  const {
    formData,
    setFormData,
    searchTerm,
    searchResults,
    showDropdown,
    handleSearch,
    handleMadrasahSelect,
    handleExamineeCountChange,
    handleTransactionChange,
    selectedMadrasahDetails
  } = usePreExamineeForm(selectedExamDetails)

  // fetch all exams from database
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const queryParams = new URLSearchParams()
        queryParams.append('page', '1')
        queryParams.append('limit', '15')
        queryParams.append('sortBy', 'createdAt')
        queryParams.append('sortOrder', 'desc')
        queryParams.append('isCompleted', 'false')
        const response = await examServices.getAllExamForPreRegistration(queryParams.toString())
        setExams(response.data)
      } catch (error) {
        showErrorDialog('পরীক্ষা ডাটা লোড করতে সমস্যা হয়েছে')
      }
    }
    fetchExams()
  }, [])

  // Fetch board info
  useEffect(() => {
    const fetchBoardInfo = async () => {
      try {
        const response = await getBoardInfo()
        if (response.success) {
          setBoardInfo(response.data)
        }
      } catch (error) {
        console.error('Error fetching board info:', error)
      }
    }
    fetchBoardInfo()
  }, [])

  // Fetch marhalas when selectedExamDetails changes
  useEffect(() => {
    const fetchMarhalas = async () => {
      const response = await getAllMarhalas()
      if (response.success) {
        setMarhalas(response.data)
      }
    }

    if (selectedExamDetails) {
      fetchMarhalas()
    }
  }, [selectedExamDetails])

  const handleExamChange = useCallback(
    (value: string) => {
      const examDetails = exams.find((exam) => exam._id === value)
      if (examDetails) {
        setSelectedExamDetails(examDetails)
        setFormData((prev) => ({
          ...prev,
          exam: value
        }))
      }
    },
    [exams, setFormData]
  )

   const generatePDF = useCallback(
    (registrationData: IPreExamineeRegistration) => {
      try {
        // Format short address
        const shortAddress = selectedMadrasahDetails?.address
          ? `${selectedMadrasahDetails.address.village}${selectedMadrasahDetails.address.district ? `, ${selectedMadrasahDetails.address.district}` : ''}${selectedMadrasahDetails.address.division ? `, ${selectedMadrasahDetails.address.division}` : ''}`
          : ''
          console.log(registrationData)

        generatePreExamineeReceipt({
          registrationData: {
            ...registrationData,
            examineesPerMahala: registrationData.examineesPerMahala.map(
              (item) => ({
                ...item,
                marhalaName: item.marhala.name.bengaliName
              })
            )
          },
          boardInfo,
          examName: selectedExamDetails?.examName || '',
          preRegistrationFee: selectedExamDetails?.preRegistrationFee || 0,
          madrasahDetails: {
            name: selectedMadrasahDetails?.madrasahNames.bengaliName || '',
            code: selectedMadrasahDetails?.code || '',
            address: {
              village: selectedMadrasahDetails?.address?.village || '',
              district: selectedMadrasahDetails?.address?.district || '',
              division: selectedMadrasahDetails?.address?.division || ''
            }
          }
        })
      } catch (error) {
        console.error('Error generating PDF:', error)
        showErrorDialog('পিডিএফ জেনারেট করতে সমস্যা হয়েছে')
      }
    },
    [boardInfo, selectedExamDetails, showErrorDialog, selectedMadrasahDetails]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      const modifiedFromData: PreExamineeRegistrationData = {
        preExaminneRegistrationDetails: {
          exam: formData.exam,
          madrasah: formData.madrasah,
          examineesPerMahala: formData.examineesPerMahala
            .filter((marhala) => marhala.totalExamineesSlots > 0)
            .map((marhala) => {
              const marhalaData = marhalas.find(
                (m) => m._id === marhala.marhalaId
              )
              return {
                marhala: marhala.marhalaId,
                marhalaName: marhalaData ? marhalaData.name.bengaliName : '',
                totalExamineesSlots: marhala.totalExamineesSlots,
                startingRegistrationNumber: marhala.startingRegistrationNumber,
                endingRegistrationNumber: marhala.endingRegistrationNumber
              }
            })
        },

        transactionDetails: {
          totalAmount: formData.transactionDetails.totalAmount,
          paidAmount: formData.transactionDetails.paidAmount,
          transactionCategory: 'registrationFee',
          description: formData.transactionDetails.description,
          paymentDetails: formData.transactionDetails.paymentDetails.map(
            (payment) => ({
              amount: payment.amount,
              paymentMethod: payment.paymentMethod,
              referenceNumber: payment.referenceNumber
            })
          )
        }
      }

      console.log(modifiedFromData)
      const validationErrors = globalValidateRequest(
        PreExamineeRegistrationValidation.createPreExamineeRegistrationValidationSchema,
        modifiedFromData
      )

      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors)
        showErrorDialog(errorMessages.flat().join(', '))
        return
      }

      try {
        setIsSubmitting(true)
        const response =
          await preExamineeRegistrationServices.create(modifiedFromData)
        if (response.success) {
          console.log(response)
          showSuccessDialog(
            response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করা হয়েছে'
          )
          generatePDF(response.data as IPreExamineeRegistration)
        }
      } catch (error: any) {
        showErrorDialog(
          error?.response?.data?.message ||
            'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করতে সমস্যা হয়েছে'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, showSuccessDialog, showErrorDialog, generatePDF, marhalas]
  )

  const totalExaminees = useMemo(
    () =>
      formData.examineesPerMahala.reduce(
        (sum, marhala) => sum + (marhala.totalExamineesSlots || 0),
        0
      ),
    [formData.examineesPerMahala]
  )

  return (
    <div className="container max-w-4xl mx-auto mt-8 px-4 text-gray-800 mb-4">
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={closeDialog}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />

      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            পরীক্ষার্থী প্রি-নিবন্ধন
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Select Exam component */}
              <ExamSelection
                exams={exams}
                selectedExam={formData.exam}
                onExamChange={handleExamChange}
              />

              {/* <div className="col-span-2"> */}
                {/* Madrasah Search component */}
                <MadrasahSearch
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  searchResults={searchResults}
                  showDropdown={showDropdown}
                  onMadrasahSelect={handleMadrasahSelect}
                />
              {/* </div> */}
            </div>

            <div>
              <h3 className="font-medium mb-3">
                মারহালা-ভিত্তিক নিবন্ধন সংখ্যা
              </h3>
              {/* MarhalaRegistrationTable component */}
              <MarhalaRegistrationTable
                examineesPerMahala={formData.examineesPerMahala}
                onExamineeCountChange={handleExamineeCountChange}
                totalExaminees={totalExaminees}
                totalAmount={formData.totalFeesAmount}
              />
            </div>

            {/* TransactionForm component */}
            <TransactionForm
              transactionDetails={formData.transactionDetails}
              onTransactionChange={handleTransactionChange}
            />

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                disabled={isSubmitting}
              >
                <IoAddCircle className="mr-2" />
                {isSubmitting ? 'প্রক্রিয়াধীন...' : 'নিবন্ধন করুন'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
