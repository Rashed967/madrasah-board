import { useState, useCallback } from 'react'

import { madrasahServices } from '@/services/madrasahService'
import { getAllMarhalas } from '@/features/marhala/marhala.service'
import {
  PreExamineeRegistrationData,
  PaymentDetail,
  TPaymentMethod
} from '@/types/preExaminee.types'
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService'
import { useStatusDialog } from '@/hooks/useStatusDialog'

export const initialFormState = {
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
        referenceNumber: '',
        paymentDate: ''
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
  const [madrasahSearchInputError, setMadrasahSearchInputError] = useState('')

  // Debounced search function
  const handleSearch = useCallback(
    async (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLInputElement>
    ) => {
      const value = (e.target as HTMLInputElement).value
      setSearchTerm(value.toString())

      if (value.length >= 2) {
        setIsSearching(true)
        try {
          const queryParams = new URLSearchParams()
          queryParams.append('page', '1')
          queryParams.append('limit', '10')
          if (value) queryParams.append('searchTerm', value)
          const response = await madrasahServices.getAllMadrasahs(queryParams.toString())

          setSearchResults(response.data)
          setShowDropdown(true)
        } catch (error) {
          console.error('Error searching madrasahs:', error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    },
    []
  )

  const handleClear = useCallback(() => {
    setSearchTerm('')
    setSearchResults([])
    setShowDropdown(false)
    setSelectedMadrasahDetails(null)
    setFormData((prev) => ({ ...prev, madrasah: '' }))
  }, [])

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
      const marhalaType = madrasah.madrasah_information.madrasahType.toLowerCase() === 'বালিকা'
          ? 'girls'
          : 'boys';
      const fields = '';
      const populate = false;
      const page = 1;
      const limit = 30;
      const response = await getAllMarhalas(
        fields,
        populate,
        page,
        limit,
        marhalaType
      )

      
      if (response.success) {
        
        // First filter marhalas with level higher than madrasah's highest marhala level
        const higherLevelMarhalas = response.data.filter(
          (marhala) => marhala.level > madrasah.madrasah_information.highestMarhala.level
        );
        
        // Then filter marhalas that have fees set for the selected exam
        const marhalasWithFees = higherLevelMarhalas.filter((marhala) => {
          if (!selectedExamDetails) return false;
          
          // Check if the marhala has fees set in the exam
          const examFees = marhalaType === 'girls' 
            ? selectedExamDetails.examFeeForGirls 
            : selectedExamDetails.examFeeForBoys;
            
          return examFees.some(fee => fee.marhala === marhala._id);
        });
        
      
        
        const formattedMarhalas = marhalasWithFees.map((marhala: any) => ({
          marhalaName: marhala.name.bengaliName,
          marhalaId: marhala._id,
          totalExamineesSlots: 0,
          startingRegistrationNumber: 0,
          endingRegistrationNumber: 0,
          totalFeesAmount: 0
        }))
      

        if (formattedMarhalas.length <= 0) {
          setMadrasahSearchInputError("নিবন্ধনের জন্য কোনো মারহালা নেই")
        }else{
          setMadrasahSearchInputError("")
        }
      //  setMarhalas(formattedMarhalas)
        
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

  const handleExamineeCountChange = (
    marhalaId: string,
    { regularExamineesSlots, irregularExamineesSlots }: { regularExamineesSlots: number, irregularExamineesSlots: number },
    useLateRegistrationFee: boolean
  ) => {
    if (!selectedExamDetails) return

    const calculateFeesForMarhala = (marhalaId: string, regularCount: number, irregularCount: number) => {
      // Check if current date is past the registration end date
      const endDate = new Date(selectedExamDetails.endRegistrationDate)
      const currentDate = new Date()
      const isLateRegistration = currentDate > endDate

      // Ensure numbers are valid, default to 0 if undefined
      const safeRegularCount = regularCount || 0
      const safeIrregularCount = irregularCount || 0

      // Use late registration fee if enabled
      let fees = 0;
      if (useLateRegistrationFee) {
        // Use late registration fees
        fees = safeRegularCount * (selectedExamDetails.lateRegistrationFeeForRegularStudent || 0) +
               safeIrregularCount * (selectedExamDetails.lateRegistrationFeeForIrregularStudent || 0);
      } else {
        // Use regular registration fees
        fees = safeRegularCount * (selectedExamDetails.registrationFeeForRegularStudent || 0) +
               safeIrregularCount * (selectedExamDetails.registrationFeeForIrregularStudent || 0);
      }

      return fees
    }

    const updatedExamineesPerMahala = formData.examineesPerMahala.map(
      (marhala) => {
        if (marhala.marhalaId === marhalaId) {
          // Ensure numbers are valid
          const safeRegular = regularExamineesSlots || 0
          const safeIrregular = irregularExamineesSlots || 0
          const totalSlots = safeRegular + safeIrregular

          return {
            ...marhala,
            regularExamineesSlots: safeRegular,
            irregularExamineesSlots: safeIrregular,
            totalFeesAmount: calculateFeesForMarhala(marhalaId, safeRegular, safeIrregular)
          }
        }
        return marhala
      }
    )

    // Calculate registration numbers based on total slots
    let currentStartNumber = selectedExamDetails.currentRegistrationNumber || selectedExamDetails.registrationStartNumber || 1

    const finalUpdatedExamineesPerMahala = updatedExamineesPerMahala.map(
      (marhala) => {
        const totalSlots = (marhala.regularExamineesSlots || 0) + (marhala.irregularExamineesSlots || 0)
        if (totalSlots > 0) {
          const startingNumber = currentStartNumber
          const endingNumber = currentStartNumber + totalSlots - 1
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
      (sum, marhala) => sum + (marhala.totalFeesAmount || 0),
      0
    )

    setFormData((prev) => ({
      ...prev,
      examineesPerMahala: finalUpdatedExamineesPerMahala,
      transactionDetails: {
        ...prev.transactionDetails,
        totalAmount: totalFeesAmount
      }
    }))

    // Update latest registration number
    const lastMarhalaWithCount = finalUpdatedExamineesPerMahala
      .filter((m) => ((m.regularExamineesSlots || 0) + (m.irregularExamineesSlots || 0)) > 0)
      .pop()

    setLatestRegistrationNumber(
      lastMarhalaWithCount
        ? lastMarhalaWithCount.endingRegistrationNumber + 1
        : currentStartNumber
    )
  }

  // New function to recalculate fees when late registration toggle changes
  const recalculateFees = (useLateRegistrationFee: boolean) => {
    if (!selectedExamDetails) return;

    const calculateFeesForMarhala = (regularCount: number, irregularCount: number) => {
      // Ensure numbers are valid, default to 0 if undefined
      const safeRegularCount = regularCount || 0;
      const safeIrregularCount = irregularCount || 0;

      // Use late registration fee if enabled
      let fees = 0;
      if (useLateRegistrationFee) {
        // Use late registration fees
        fees = safeRegularCount * (selectedExamDetails.lateRegistrationFeeForRegularStudent || 0) +
               safeIrregularCount * (selectedExamDetails.lateRegistrationFeeForIrregularStudent || 0);
      } else {
        // Use regular registration fees
        fees = safeRegularCount * (selectedExamDetails.registrationFeeForRegularStudent || 0) +
               safeIrregularCount * (selectedExamDetails.registrationFeeForIrregularStudent || 0);
      }

      return fees;
    };

    const updatedExamineesPerMahala = formData.examineesPerMahala.map(marhala => {
      const regularCount = marhala.regularExamineesSlots || 0;
      const irregularCount = marhala.irregularExamineesSlots || 0;
      
      return {
        ...marhala,
        totalFeesAmount: calculateFeesForMarhala(regularCount, irregularCount)
      };
    });

    const totalFeesAmount = updatedExamineesPerMahala.reduce(
      (sum, marhala) => sum + (marhala.totalFeesAmount || 0),
      0
    );

    setFormData(prev => ({
      ...prev,
      examineesPerMahala: updatedExamineesPerMahala,
      transactionDetails: {
        ...prev.transactionDetails,
        totalAmount: totalFeesAmount
      }
    }));
  };

  const handleTransactionChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updatedTransaction = {
        ...prev.transactionDetails,
        [field]: value
      }

      // Calculate total paid amount from payment details
      if (field === 'paymentDetails') {
        // Type assertion to ensure value is PaymentDetail[]
        const paymentDetails = value as PaymentDetail[]
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
      if ((formData.transactionDetails.paidAmount || 0) > formData.transactionDetails.totalAmount) {
        setPaymentError('পরিশোধিত টাকার পরিমাণ মোট টাকার চেয়ে বেশি হতে পারবে না')
        return
      }

      // Clear any previous payment error
      setPaymentError('')

      const modifiedFromData: PreExamineeRegistrationData = {
        preExaminneRegistrationDetails: {
          exam: formData.exam,
          madrasah: formData.madrasah,
          examineesPerMahala: formData.examineesPerMahala.map((marhala) => ({
            marhala: marhala.marhalaId,
            regularExamineesSlots: marhala.regularExamineesSlots || 0,
            irregularExamineesSlots: marhala.irregularExamineesSlots || 0,
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
              referenceNumber: payment.referenceNumber || '',
              paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0]
            })
          )
        }
      }

      // Log the modified data for debugging


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
    paymentError,
    madrasahSearchInputError,
    recalculateFees,
    setSearchTerm,
    handleClear
  }
}
