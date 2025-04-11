"use client";
import React from 'react';

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
import { initialFormState, usePreExamineeForm } from '@/hooks/usePreExamineeForm'
import { useStatusDialog } from '@/hooks/useStatusDialog'
import {
  ExamType,
  PaymentDetail,
  PreExamineeRegistrationData
} from '@/types/preExaminee.types'
import { getBoardInfo } from '@/features/boardInfo/boardInfor.service'
import 'jspdf-autotable'
import IBoardInfo from '@/features/boardInfo/boardInfo.interface'

import { generatePreExamineeReceipt } from '@/utils/pdfGenerator'
import IPreExamineeRegistration from '@/features/preExamineeRegistration/interfaces'
import { getAllMarhalas } from '@/features/marhala/marhala.service'
import { IMarhala } from '@/features/marhala/marhala.interface'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

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


export default function PreExamineeRegistrationPage() {
  const [exams, setExams] = useState([])
  const [selectedExamDetails, setSelectedExamDetails] =
    useState<ExamType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [boardInfo, setBoardInfo] = useState<IBoardInfo | null>(null)
  const [marhalas, setMarhalas] = useState<IMarhala[]>([])
  const [useLateRegistrationFee, setUseLateRegistrationFee] = useState(false)
  const [isLateRegistrationEnabled, setIsLateRegistrationEnabled] = useState(false)
  const [isExamSelected, setIsExamSelected] = useState(false)


  const { statusDialog, showSuccessDialog, showErrorDialog, closeDialog } =
    useStatusDialog()

  const {
    formData,
    setFormData,
    searchTerm,
    searchResults,
    isSearching,
    showDropdown,
    selectedMadrasahDetails,
    latestRegistrationNumber,
    handleSearch,
    handleMadrasahSelect,
    handleExamineeCountChange,
    handleTransactionChange,
    handleSubmit: handleFormSubmit,
    paymentError,
    madrasahSearchInputError,
    recalculateFees,
    setSearchTerm
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
        showErrorDialog(error.message || 'পরীক্ষা ডাটা লোড করতে সমস্যা হয়েছে')
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

  useEffect(() => {
    // Check if current date is past the registration end date
    if (selectedExamDetails?.endRegistrationDate) {
      const endDate = new Date(selectedExamDetails.endRegistrationDate)
      const currentDate = new Date()
      setIsLateRegistrationEnabled(currentDate > endDate)
    }
  }, [selectedExamDetails?.endRegistrationDate])

  const handleExamChange = useCallback(
    (value: string) => {
      const examDetails = exams.find((exam) => exam._id === value)
      console.log(examDetails)
      setIsLateRegistrationEnabled(false)
      setUseLateRegistrationFee(false)
      if (examDetails) {
        setIsExamSelected(true)
        setSelectedExamDetails(examDetails)
        setFormData((prev) => ({
          ...prev,
          exam: value
        }))
      }
    },
    [exams, setFormData]
  )

  console.log('boardInfo', boardInfo)
   const generatePDF = useCallback(
    (registrationData: IPreExamineeRegistration) => {
      console.log('boardInfo', boardInfo)
      try {
        if (!boardInfo) {
          throw new Error('Board information is required')
        }


        // Map the examineesPerMahala data correctly
        const mappedExamineesPerMahala = registrationData.examineesPerMahala.map(item => ({
          ...item,
          marhalaName: item.marhala?.name?.bengaliName || '',
          totalExamineesSlots: (item.regularExamineesSlots || 0) + (item.irregularExamineesSlots || 0),
          startingRegistrationNumber: item.startingRegistrationNumber || 0,
          endingRegistrationNumber: item.endingRegistrationNumber || 0
        }))

        generatePreExamineeReceipt({
          registrationData: {
            ...registrationData,
            examineesPerMahala: mappedExamineesPerMahala,
            transactionDetails: {
              ...registrationData.transactionDetails,
              totalAmount: registrationData.transactionDetails?.totalAmount || 0,
              paidAmount: registrationData.transactionDetails?.paidAmount || 0
            }
          },
          boardInfo,
          examName: selectedExamDetails?.examName || '',
          preRegistrationFee: registrationData.transactionDetails?.totalAmount || 0,
          madrasahDetails: {
            name: selectedMadrasahDetails?.madrasahNames?.bengaliName || '',
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
          isLateRegistrationFeeTaken: useLateRegistrationFee,
          examineesPerMahala: formData.examineesPerMahala
            .filter((marhala) => (marhala.regularExamineesSlots || 0) + (marhala.irregularExamineesSlots || 0) > 0)
            .map((marhala) => ({
              marhala: marhala.marhalaId,
              regularExamineesSlots: marhala.regularExamineesSlots || 0,
              irregularExamineesSlots: marhala.irregularExamineesSlots || 0,
              startingRegistrationNumber: marhala.startingRegistrationNumber,
              endingRegistrationNumber: marhala.endingRegistrationNumber
            })),
            
        },
        transactionDetails: {
          totalAmount: formData.transactionDetails.totalAmount,
          paidAmount: formData.transactionDetails.paidAmount,
          transactionCategory: 'registrationFee',
          description: formData.transactionDetails.description || '',
          paymentDetails: formData.transactionDetails.paymentDetails.map(
            (payment) => ({
              amount: payment.amount,
              paymentMethod: payment.paymentMethod,
              referenceNumber: payment.referenceNumber || '',
              paymentDate: (payment as PaymentDetail).paymentDate || new Date().toISOString().split('T')[0]
            })
          )
        },
        
      }

      console.log('Data being sent to server:', JSON.stringify(modifiedFromData, null, 2))
      const validationErrors = globalValidateRequest(
        PreExamineeRegistrationValidation.createPreExamineeRegistrationValidationSchema,
        modifiedFromData
      )

      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors)
        showErrorDialog(errorMessages.flat().join(', '))
        return
      }

      if (formData.transactionDetails.paidAmount > formData.transactionDetails.totalAmount) {
        showErrorDialog(
          'পরিশোধিত টাকার পরিমান মোট টাকার চেয়ে বেশি হতে পারবে না'
        )
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
          // reset the form
          setFormData(initialFormState)
          setSearchTerm('')
          setUseLateRegistrationFee(false)
          generatePDF(response.data as IPreExamineeRegistration)
        }
      } catch (error) {
        showErrorDialog(
          error?.response?.data?.message ||
            'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করতে সমস্যা হয়েছে'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, showSuccessDialog, showErrorDialog, generatePDF]
  )

  const totalExaminees = useMemo(
    () =>
      formData.examineesPerMahala.reduce(
        (sum, marhala) => sum + ((marhala.regularExamineesSlots || 0) + (marhala.irregularExamineesSlots || 0)),
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
            নিবন্ধন ফি গ্রহণ
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

              {/* Madrasah Search component */}
              <MadrasahSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                searchResults={searchResults}
                showDropdown={showDropdown}
                onMadrasahSelect={handleMadrasahSelect}
                madrasahSearchInputError={madrasahSearchInputError}
                isExamSelected={isExamSelected}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Switch
                  checked={useLateRegistrationFee}
                  onCheckedChange={(checked) => {
                    console.log('Toggle button clicked, new value:', checked);
                    setUseLateRegistrationFee(checked);
                    // Recalculate fees when toggle changes
                    recalculateFees(checked);
                  }}
                  disabled={!isLateRegistrationEnabled}
                />
                <Label>বিলম্ব ফি প্রয়োগ করুন</Label>
                {!isLateRegistrationEnabled && (
                  <p className="text-sm text-gray-500 ml-2">
                    রেজিস্ট্রেশনের শেষ তারিখ অতিক্রম না হওয়া পর্যন্ত বিলম্ব ফি প্রয়োগ করা যাবে না
                  </p>
                )}
              </div>

              <h3 className="font-medium mb-3">
                মারহালা-ভিত্তিক নিবন্ধন সংখ্যা
              </h3>
              {/* MarhalaRegistrationTable component */}
              {(() => { console.log('Passing useLateRegistrationFee to MarhalaRegistrationTable:', useLateRegistrationFee); return null; })()}
              <MarhalaRegistrationTable
                examineesPerMahala={formData.examineesPerMahala}
                onExamineeCountChange={handleExamineeCountChange}
                totalExaminees={totalExaminees}
                totalAmount={formData.transactionDetails.totalAmount}
                useLateRegistrationFee={useLateRegistrationFee}
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
