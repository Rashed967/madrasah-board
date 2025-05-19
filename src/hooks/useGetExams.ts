import { useState, useEffect } from 'react'
import { get } from '@/core/api/apiService'
import { IExam } from '@/types/exam'

interface UseGetExamsReturn {
  exams: IExam[]
  loading: boolean
  error: string | null
  searchExams: (query: string) => void
}

export const useGetExams = (): UseGetExamsReturn => {
  const [exams, setExams] = useState<IExam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchExams = async () => {
    try {
      setLoading(true)
      const response = await get<IExam[]>('/exams?fields=examFeeForBoys,examFeeForGirls,examName')
      if (response.success) {
        setExams(response.data)
      } else {
        setError(response.message || 'Failed to fetch exams')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch exams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const searchExams = (query: string) => {
    setSearchQuery(query)
  }

  const filteredExams = exams.filter(exam => 
    exam?.examName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return {
    exams: filteredExams,
    loading,
    error,
    searchExams
  }
} 