import { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { madrasahServices } from '@/services/madrasahService'
import { getAllMarhalas } from '@/features/marhala/marhala.service'
import {
  PreExamineeRegistrationData,
  IPaymentDetail,
  TPaymentMethod
} from '@/types/preExaminee.types'
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService'
import { useStatusDialog } from '@/hooks/useStatusDialog'

const initialFormState = {
  exam: '',
  madrasah: '',
  examineesPerMahala: [],
  totalFeesAmount: 0,
  transactionDetails: {
    totalAmount: 0,
    paidAmount: 0,
    transactionCategory: '',
    description: '',
    paymentDetails: [
      {
        amount: 0,
        paymentMethod: '' as TPaymentMethod,
        referenceNumber: ''
      }
    ]
  }
}

interface IMarhala {
  marhalaName: string
  totalExamineesSlots: number
  startingRegistrationNumber: number
  endingRegistrationNumber: number
  totalFeesAmount: number
}

export const usePreExamineeForm = (selectedExamDetails: any) => {
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSuccessDialog, showErrorDialog } = useStatusDialog()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedMadrasahDetails, setSelectedMadrasahDetails] =
    useState<any>(null)
  const [latestRegistrationNumber, setLatestRegistrationNumber] = useState(0)
  const [marhalas, setMarhalas] = useState<Array<IMarhala>>([])
  const [paymentError, setPaymentError] = useState('')

  // Debounced search function
  const handleSearch = useCallback(
    async (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLInputElement>
    ) => {
      const value = (e.target as HTMLInputElement).value
  
      
      setSearchTerm(value.toString())
      console.log('value', searchTerm)

      // Only search if it's a keyboard event and the key is Enter
      if ('key' in e && e.key === 'Enter' && value.length >= 2) {
        setIsSearching(true)
        try {
          const queryParams = new URLSearchParams()
          queryParams.append('page', '1');
          queryParams.append('limit', '10');
          if (value) queryParams.append('searchTerm', value);
          console.log(queryParams.toString())
          const response =
            await madrasahServices.getAllMadrasahs(queryParams.toString())
            console.log ('from preExaminee', response)
          // const filteredResults = response.data.filter(
          //   (madrasah: any) =>
          //     madrasah.madrasahNames.bengaliName
          //       .toLowerCase()
          //       .includes(value.toLowerCase()) ||
          //     madrasah.madrasahNames.englishName
          //       ?.toLowerCase()
          //       .includes(value.toLowerCase()) ||
          //     madrasah.code.toLowerCase().includes(value.toLowerCase())
          // )
          setSearchResults(response.data)
          setShowDropdown(true)
        } catch (error) {
          console.error('Error searching madrasahs:', error)
        } finally {
          setIsSearching(false)
        }
      }
    },
    []
  )

  const handleMadrasahSelect = async (madrasah: any) => {
    setFormData((prev) => ({ ...prev, madrasah: madrasah._id }))
    setSelectedMadrasahDetails({
      _id: madrasah._id,
      code: madrasah.code,
      madrasahNames: madrasah.madrasahNames,
      madrasahType: madrasah.madrasah_information.madrasahType,
      address: madrasah.address
    })
    setSearchTerm(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`)
    setShowDropdown(false)

    try {
      // Get marhalas based on madrasah type
      const marhalaType =
        madrasah.madrasah_information.madrasahType.toLowerCase() === 'বালিকা'
          ? 'girls'
          : 'boys'
      const fields = ''
      const populate = false
      const page = 1
      const limit = 30
      const response = await getAllMarhalas(
        fields,
        populate,
        page,
        limit,
        marhalaType
      )

      if (response.success) {
        const formattedMarhalas = response.data.map((marhala: any) => ({
          marhalaName: marhala.name.bengaliName,
          marhalaId: marhala._id,
          totalExamineesSlots: 0,
          startingRegistrationNumber: 0,
          endingRegistrationNumber: 0,
          totalFeesAmount: 0
        }))

        setMarhalas(formattedMarhalas)
        setFormData((prev) => ({
          ...prev,
          examineesPerMahala: formattedMarhalas.map((marhala) => ({
            ...marhala,
            marhalaId: marhala.marhalaId
          }))
        }))
      }
    } catch (error) {
      console.error('Error loading marhalas:', error)
    }
  }

  const handleExamineeCountChange = (marhalaName: string, count: number) => {
    if (!selectedExamDetails) return

    const updatedExamineesPerMahala = formData.examineesPerMahala.map(
      (marhala) => {
        if (marhala.marhalaName === marhalaName) {
          return {
            ...marhala,
            totalExamineesSlots: count,
            totalFeesAmount:
              count * (selectedExamDetails.preRegistrationFee || 0)
          }
        }
        return marhala
      }
    )

    let currentStartNumber =
      selectedExamDetails.currentRegistrationNumber === 0
        ? selectedExamDetails.registrationStartNumber
        : selectedExamDetails.currentRegistrationNumber + 1

    const finalUpdatedExamineesPerMahala = updatedExamineesPerMahala.map(
      (marhala) => {
        if (marhala.totalExamineesSlots > 0) {
          const startingNumber = currentStartNumber
          const endingNumber = startingNumber + marhala.totalExamineesSlots - 1
          currentStartNumber = endingNumber + 1

          return {
            ...marhala,
            startingRegistrationNumber: startingNumber,
            endingRegistrationNumber: endingNumber
          }
        }
        return {
          ...marhala,
          startingRegistrationNumber: 0,
          endingRegistrationNumber: 0
        }
      }
    )

    const totalFeesAmount = finalUpdatedExamineesPerMahala.reduce(
      (sum, marhala) => sum + marhala.totalFeesAmount,
      0
    )

    setFormData((prev) => ({
      ...prev,
      examineesPerMahala: finalUpdatedExamineesPerMahala,
      totalFeesAmount,
      transactionDetails: {
        ...prev.transactionDetails,
        totalAmount: totalFeesAmount
      }
    }))

    const lastMarhalaWithCount = finalUpdatedExamineesPerMahala
      .filter((m) => m.totalExamineesSlots > 0)
      .pop()

    setLatestRegistrationNumber(
      lastMarhalaWithCount
        ? lastMarhalaWithCount.endingRegistrationNumber + 1
        : 0
    )
  }

  const handleTransactionChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updatedTransaction = {
        ...prev.transactionDetails,
        [field]: value
      }

      // Calculate total paid amount from payment details
      if (field === 'paymentDetails') {
        // Type assertion to ensure value is IPaymentDetail[]
        const paymentDetails = value as IPaymentDetail[]
        const totalPaid = paymentDetails.reduce(
          (sum, detail) => sum + (detail.amount || 0),
          0
        )

        if (totalPaid > prev.totalFeesAmount) {
          setPaymentError(
            'পরিশোধিত টাকার পরিমাণ মোট টাকার চেয়ে বেশি হতে পারবে না'
          )
        } else {
          setPaymentError('')
        }

        updatedTransaction.paidAmount = totalPaid
      }

      return {
        ...prev,
        transactionDetails: updatedTransaction
      }
    })
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Check if payment amount is valid
      if (
        formData.transactionDetails.paidAmount >
        formData.transactionDetails.totalAmount
      ) {
        setPaymentError(
          'পরিশোধিত টাকার পরিমাণ মোট টাকার চেয়ে বেশি হতে পারবে না'
        )
        return
      }

      const modifiedFromData: PreExamineeRegistrationData = {
        preExaminneRegistrationDetails: {
          exam: formData.exam,
          madrasah: formData.madrasah,
          examineesPerMahala: formData.examineesPerMahala.map((marhala) => ({
            marhala: marhala.marhalaId,
            totalExamineesSlots: marhala.totalExamineesSlots,
            startingRegistrationNumber: marhala.startingRegistrationNumber,
            endingRegistrationNumber: marhala.endingRegistrationNumber
          }))
        },
        transactionDetails: {
          totalAmount: formData.transactionDetails.totalAmount,
          paidAmount: formData.transactionDetails.paidAmount,
          transactionCategory: 'registrationFee',
          description:
            formData.transactionDetails.description ||
            'Registration fee payment',
          paymentDetails: formData.transactionDetails.paymentDetails.map(
            (payment) => ({
              amount: payment.amount,
              paymentMethod: payment.paymentMethod,
              referenceNumber: payment.referenceNumber || ''
            })
          )
        }
      }

      // Log the modified data for debugging
      console.log(
        'Data being sent to server:',
        JSON.stringify(modifiedFromData, null, 2)
      )

      try {
        setIsSubmitting(true)
        const response =
          await preExamineeRegistrationServices.create(modifiedFromData)
        if (response.success) {
          showSuccessDialog(
            response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করা হয়েছে'
          )
          // Reset form after success
          setFormData(initialFormState)
          setSearchTerm('')
          setSelectedMadrasahDetails(null)
          setMarhalas([])
          setPaymentError('')
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
    [formData, showSuccessDialog, showErrorDialog]
  )

  return {
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
    handleSubmit,
    paymentError
  }
}
