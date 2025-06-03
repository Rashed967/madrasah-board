import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SelectField } from '@/components/ui/select'
import { PDFFormData } from '@/types/pdfGenerator.types'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { getAllExamsForSearch } from '@/services/examService'
import MadrasahSearch from '@/components/shared/MadrasahSearch'

interface AdmitCardMadrasahFormProps {
  exams: any[]
  examsLoading: boolean
  examsError: any
  onSubmit: (data: PDFFormData) => void
  onCancel: () => void
}

interface Exam {
  _id: string
  examName: string
}

const AdmitCardMadrasahForm = ({
  exams,
  examsLoading,
  examsError,
  onSubmit,
  onCancel
}: AdmitCardMadrasahFormProps) => {
  const form = useForm<PDFFormData>()
  const [examList, setExamList] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true)
        const response = await getAllExamsForSearch()
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
  }, [])

  const handleSubmit = (data: PDFFormData) => {
    onSubmit(data)
  }

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedExamId = e.target.value
    console.log('Selected Exam ID:', selectedExamId)
    form.setValue('examId', selectedExamId)
  }

  const handleMadrasahChange = (madrasah: { id: string; name: string; code: string } | null) => {
      if (madrasah) {
        console.log('Selected Madrasah:', madrasah)
          form.setValue('madrasahId', madrasah.id)
          form.setValue('madrasahName', madrasah.name)
        } else {
    form.setValue('madrasahId', '')
      form.setValue('madrasahName', '')
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <SelectField
              label="পরীক্ষা"
              name="examId"
              value={form.watch('examId') || ''}
              onChange={handleExamChange}
              options={examList.map(exam => ({
                label: exam.examName,
                value: exam._id
              }))}
              error={examsError}
              disabled={loading}
            />

            <MadrasahSearch
              label="মাদ্রাসা"
              onChange={handleMadrasahChange}
              placeholder="মাদ্রাসা খুঁজুন..."
              formFieldName="madrasahId"
              form={form}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              বাতিল
            </Button>
            <Button className="bg-[#52B788] hover:bg-[#52B788]/90 text-white" type="submit">
              প্রবেশপত্র তৈরি করুন
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

export default AdmitCardMadrasahForm 