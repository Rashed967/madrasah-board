// UpdatedAdmitCardMadrasahForm.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { PDFFormData } from '@/types/pdfGenerator.types'
import ExamSearch from '@/components/shared/ExamSearch'
import MadrasahSearch from '@/components/shared/MadrasahSearch'
import { useMadrasah } from '@/contexts/MadrasahSearchContext'
import { useGetExams } from '@/hooks/useGetExams'
import { useExam } from '@/contexts/ExamSearchContext'
import { getMadrasahWiseAdmitCardInfo } from '@/services/admitCardSerive'
import { useState } from 'react'
import { downloadPdf } from '@/utils/pdfDownloader'
import toast from 'react-hot-toast'

interface AdmitCardMadrasahFormProps {
  exams: any[]
  examsLoading: boolean
  examsError: any
  onCancel: () => void
}

const AdmitCardMadrasahForm = ({
  exams,
  examsLoading,
  examsError,
  onCancel
}: AdmitCardMadrasahFormProps) => {
  const { selectedMadrasah } = useMadrasah() // Context থেকে মাদরাসার তথ্য পাওয়া
  const {selectedExam} = useExam()
  

  const handleSubmit = async (e: React.FormEvent) => {
    try{
      e.preventDefault()
    const formData = {
      examId: selectedExam._id,
      madrasahId: selectedMadrasah._id
    }
    const resonse = await getMadrasahWiseAdmitCardInfo(formData);

    if(!resonse.success){
      toast.error(resonse.message || 'ডেটা লোড করতে সমস্যা হয়েছে')
      return
    }

    await downloadPdf({
      endpoint: '/admit-card-by-madrasah',
      data: resonse.data,
      fileName: `মাদ্রাসা ভিত্তিক প্রবেশপত্র - ${selectedMadrasah.name}.pdf`
    })

    toast.success('প্রবেশপত্র ডাউনলোড করা হয়েছে')
    } catch (error: any) {
      toast.error(error?.message || 'ডেটা লোড করতে সমস্যা হয়েছে')
    }

  

  }

  return (
    <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পরীক্ষা
              </label>
              {/* কোনো props পাঠানোর প্রয়োজন নেই */}
            <ExamSearch />
            </div>

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

    </Card>
  )
}

export default AdmitCardMadrasahForm