import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { PDFFormData } from '@/types/pdfGenerator.types'
import { useForm } from 'react-hook-form'
import MadrasahSearch from '@/components/shared/MadrasahSearch'
import ExamSearch from '@/components/shared/ExamSearch'

interface AdmitCardMadrasahFormProps {
  exams: any[]
  examsLoading: boolean
  examsError: any
  onSubmit: (data: PDFFormData) => void
  onCancel: () => void
}

const AdmitCardMadrasahForm = ({
  exams,
  examsLoading,
  examsError,
  onSubmit,
  onCancel
}: AdmitCardMadrasahFormProps) => {
  const form = useForm<PDFFormData>()

  const handleSubmit = (data: PDFFormData) => {
    onSubmit(data)
  }

  const handleExamChange = (exam: { id: string; name: string } | null) => {
    if (exam) {
      form.setValue('examId', exam.id)
      form.setValue('examName', exam.name)
    } else {
      form.setValue('examId', '')
      form.setValue('examName', '')
    }
  }

  const handleMadrasahChange = (madrasah: { id: string; name: string; code: string } | null) => {
    if (madrasah) {
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
            <ExamSearch
              label="পরীক্ষা"
              onChange={handleExamChange}
              placeholder="পরীক্ষা খুঁজুন..."
              formFieldName="examId"
              form={form}
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