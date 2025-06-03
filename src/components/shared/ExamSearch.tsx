import { Autocomplete } from '@/components/ui/autocomplete'
import { getAllExamsForSearch } from '@/services/examService'
import { useEffect, useState } from 'react'

interface Exam {
  _id: string
  examName: string
}

interface SelectedExam {
  id: string
  name: string
}

interface ExamSearchProps {
  value?: SelectedExam
  onChange: (exam: SelectedExam | null) => void
  placeholder?: string
  className?: string
  label?: string
  formFieldName?: string
  form?: any
}

const ExamSearch = ({
  value,
  onChange,
  placeholder = 'পরীক্ষা খুঁজুন...',
  className,
  label,
  formFieldName,
  form
}: ExamSearchProps) => {
  const [examList, setExamList] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          searchTerm: searchTerm
        }).toString()
        const response = await getAllExamsForSearch(queryParams)
        if (response.success) {
          setExamList(response.data as Exam[])
        }
      } catch (error) {
        console.error('Failed to load exams:', error)
      } finally {
        setLoading(false)
      }
    }

    loadExams()
  }, [searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleSelect = (selectedValue: string) => {
    const selectedExam = examList.find(e => e._id === selectedValue)
    if (selectedExam) {
      const exam = {
        id: selectedExam._id,
        name: selectedExam.examName
      }
      if (form && formFieldName) {
        form.setValue(formFieldName, exam.id)
      }
      onChange(exam)
    }
  }

  const handleClear = () => {
    if (form && formFieldName) {
      form.setValue(formFieldName, '')
    }
    onChange(null)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Autocomplete
          value={value?.name || ''}
          onChange={handleSelect}
          onSearch={handleSearch}
          options={examList.map(exam => ({
            label: exam.examName,
            value: exam._id
          }))}
          isLoading={loading}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default ExamSearch 