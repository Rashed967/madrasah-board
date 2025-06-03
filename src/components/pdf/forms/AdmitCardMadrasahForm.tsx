import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SelectField } from '@/components/ui/select'
import { PDFFormData } from '@/types/pdfGenerator.types'
import { useForm } from 'react-hook-form'

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

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <SelectField
              label="পরীক্ষা"
              name="examId"
              value={form.watch('examId') || ''}
              onChange={(e) => form.setValue('examId', e.target.value)}
              options={exams.map(exam => ({
                label: exam.name,
                value: exam._id
              }))}
              error={examsError}
              disabled={examsLoading}
            />

            <SelectField
              label="মাদ্রাসা"
              name="madrasahId"
              value={form.watch('madrasahId') || ''}
              onChange={(e) => form.setValue('madrasahId', e.target.value)}
              options={[]} // TODO: Add madrasah list
              disabled={false}
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