import { create } from 'zustand'
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService'
import { IPreExamineeRegistration } from '@/features/preExamineeRegistration/interfaces'

interface PreExamineeApiResponse {
  success: boolean
  data: {
    meta: {
      page: number
      limit: number
      total: number
    }
    data: IPreExamineeRegistration[]
  }
  message: string
}

interface PreExamineeStore {
  preExaminees: IPreExamineeRegistration[]
  loading: boolean
  error: string | null
  fetchPreExaminees: (examId: string, madrasaId: string) => Promise<void>
}

export const usePreExamineeStore = create<PreExamineeStore>((set) => ({
  preExaminees: [],
  loading: false,
  error: null,
  fetchPreExaminees: async (examId: string, madrasaId: string) => {
    set({ loading: true, error: null, preExaminees: [] })
    try {
      const response = await preExamineeRegistrationServices.getByExamAndMadrasah(examId, madrasaId) as PreExamineeApiResponse
      console.log('Pre-examinee response:', response)
      if (response.success && response.data?.data) {
        set({ preExaminees: response.data.data, loading: false })
      } else {
        set({ preExaminees: [], error: response.message || 'কোনো ডেটা পাওয়া যায়নি', loading: false })
      }
    } catch (error: any) {
      set({ preExaminees: [], error: error.message, loading: false })
    }
  }
}))
