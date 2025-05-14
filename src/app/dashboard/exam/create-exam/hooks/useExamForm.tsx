import { useEffect, useState } from 'react'
import { examServices } from '@/services/examService'
import { ExamValidationSchemas } from '@/features/exam'
import globalValidateRequest from '@/middleware/globalValidateRequest'
import { getAllMarhalas } from '@/features/marhala/marhala.service'

export function useExamForm() {
  // initial from state
  const initialFormState = {
    examName: '',
    endRegistrationDate: '',
    registrationStartNumber: 0,
    registrationFeeForRegularStudent: 0,
    registrationFeeForIrregularStudent: 0,
    lateRegistrationFeeForRegularStudent: 0,
    lateRegistrationFeeForIrregularStudent: 0,
    examFeeForBoys: [], // Will be populated when marhalaList is loaded
    examFeeForGirls: [] // Will be populated when marhalaList is loaded
  }

  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  const [marhalaList, setMarhalaList] = useState<{
    boys: Array<{ id: string; name: string }>
    girls: Array<{ id: string; name: string }>
  }>({ boys: [], girls: [] })

  useEffect(() => {
    const loadMarhalaData = async () => {
      try {
        const response = await getAllMarhalas()
        if (response.success) {
          const boysMarhalas = response.data.filter(m => m.marhalaType === 'boys')
          const girlsMarhalas = response.data.filter(m => m.marhalaType === 'girls')
          
          setMarhalaList({
            boys: boysMarhalas.map(m => ({ id: m._id.toString(), name: m.name.bengaliName })),
            girls: girlsMarhalas.map(m => ({ id: m._id.toString(), name: m.name.bengaliName }))
          })

          setFormData((prev) => ({
            ...prev,
            examFeeForBoys: boysMarhalas.map(() => ({
              examFeeForRegularStudent: 0,
              examFeeForIrregularStudent: 0,
              lateExamFeeForRegularStudent: 0,
              lateExamFeeForIrregularStudent: 0,
              startRollNumber: 0
            })),
            examFeeForGirls: girlsMarhalas.map(() => ({
              examFeeForRegularStudent: 0,
              examFeeForIrregularStudent: 0,
              lateExamFeeForRegularStudent: 0,
              lateExamFeeForIrregularStudent: 0,
              startRollNumber: 0
            }))
          }))
        }
      } catch (error) {
        console.error('Error loading marhala data:', error)
      }
    }

    loadMarhalaData()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFeeChange = (
    gender: 'Boys' | 'Girls',
    marhalaIndex: number,
    field: string,
    value: string
  ) => {
    const arrayField = `examFeeFor${gender}` as 'examFeeForBoys' | 'examFeeForGirls'
    setFormData((prev) => ({
      ...prev,
      [arrayField]: prev[arrayField].map((fee, idx) =>
        idx === marhalaIndex ? { ...fee, [field]: Number(value) } : fee
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Filter out marhala entries with startRollNumber 0
    const filteredExamFeeForBoys = formData.examFeeForBoys
      .filter((fee) => Number(fee.startRollNumber) !== 0)
      .map((fee, index) => ({
        marhala: marhalaList.boys[index].id,
        examFeeForRegularStudent: Number(fee.examFeeForRegularStudent),
        examFeeForIrregularStudent: Number(fee.examFeeForIrregularStudent),
        lateExamFeeForRegularStudent: Number(fee.lateExamFeeForRegularStudent),
        lateExamFeeForIrregularStudent: Number(fee.lateExamFeeForIrregularStudent),
        startRollNumber: Number(fee.startRollNumber)
      }))

    const filteredExamFeeForGirls = formData.examFeeForGirls
      .filter((fee) => Number(fee.startRollNumber) !== 0)
      .map((fee, index) => ({
        marhala: marhalaList.girls[index].id,
        examFeeForRegularStudent: Number(fee.examFeeForRegularStudent),
        examFeeForIrregularStudent: Number(fee.examFeeForIrregularStudent),
        lateExamFeeForRegularStudent: Number(fee.lateExamFeeForRegularStudent),
        lateExamFeeForIrregularStudent: Number(fee.lateExamFeeForIrregularStudent),
        startRollNumber: Number(fee.startRollNumber)
      }))

    // Check if at least one marhala is selected
    if (filteredExamFeeForBoys.length === 0 && filteredExamFeeForGirls.length === 0) {
      setErrors({
        fees: 'কমপক্ষে একটি মারহালার শুরুর রোল নম্বর নির্ধারণ করতে হবে'
      })
      setIsSubmitting(false)
      return
    }

    const exam = {
      examName: formData.examName,
      endRegistrationDate: new Date(formData.endRegistrationDate),
      registrationStartNumber: Number(formData.registrationStartNumber),
      registrationFeeForRegularStudent: Number(formData.registrationFeeForRegularStudent),
      registrationFeeForIrregularStudent: Number(formData.registrationFeeForIrregularStudent),
      lateRegistrationFeeForRegularStudent: Number(formData.lateRegistrationFeeForRegularStudent),
      lateRegistrationFeeForIrregularStudent: Number(formData.lateRegistrationFeeForIrregularStudent),
      examFeeForBoys: filteredExamFeeForBoys,
      examFeeForGirls: filteredExamFeeForGirls
    }

    const validationErrors = globalValidateRequest(
      ExamValidationSchemas.createExamValidationSchema,
      exam
    )

    if (Object.keys(validationErrors || {}).length > 0) {
      setErrors(validationErrors || {})
      setIsSubmitting(false)
      return
    }

    try {
      const response = await examServices.createExam(exam)
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল',
          message: response.message || 'পরীক্ষা সফলভাবে তৈরি করা হয়েছে'
        })

        // Reset form
        setFormData({
          ...initialFormState,
          examFeeForBoys: marhalaList.boys.map((m) => ({
            marhala: m.name,
            examFeeForRegularStudent: 0,
            examFeeForIrregularStudent: 0,
            lateExamFeeForRegularStudent: 0,
            lateExamFeeForIrregularStudent: 0
          })),
          examFeeForGirls: marhalaList.girls.map((m) => ({
            marhala: m.name,
            examFeeForRegularStudent: 0,
            examFeeForIrregularStudent: 0,
            lateExamFeeForRegularStudent: 0,
            lateExamFeeForIrregularStudent: 0
          }))
        })
        setErrors({})
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে'
        })
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    statusDialog,
    handleChange,
    handleFeeChange,
    handleSubmit,
    setStatusDialog,
    marhalaList
  }
}
