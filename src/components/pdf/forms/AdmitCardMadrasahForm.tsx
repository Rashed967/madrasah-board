// UpdatedAdmitCardMadrasahForm.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { PDFFormData } from '@/types/pdfGenerator.types'
import { useForm } from 'react-hook-form'
import ExamSearch from '@/components/shared/ExamSearch'
import MadrasahSearch from '@/components/shared/MadrasahSearch'
import { useMadrasah } from '@/contexts/MadrasahSearchContext'

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
  const { selectedMadrasah } = useMadrasah() // Context থেকে মাদরাসার তথ্য পাওয়া

  const handleSubmit = (data: PDFFormData) => {
    console.log('Selected Madrasah:', selectedMadrasah)
    
    // Create a new object with all form data
    const formData = {
      ...data,
      madrasahId: selectedMadrasah?._id || '',
      madrasahName: selectedMadrasah?.madrasahName || '',
      madrasahCode: selectedMadrasah?.code || ''
    }

    // Log the complete form data before submission
    console.log('Form Data:', formData)

    // Only submit if we have a selected madrasah
    if (!selectedMadrasah) {
      alert('দয়া করে একটি মাদরাসা নির্বাচন করুন!')
      return
    }

    onSubmit(formData)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মাদরাসা
              </label>
              {/* কোনো props পাঠানোর প্রয়োজন নেই */}
              <MadrasahSearch />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              বাতিল
            </Button>
            <Button 
              className="bg-[#52B788] hover:bg-[#52B788]/90 text-white" 
              type="submit"
            >
              প্রবেশপত্র তৈরি করুন
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

export default AdmitCardMadrasahForm