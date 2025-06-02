import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { convertToBengali } from '@/utils/convertToBengali'
import { convertBengaliToEnglish } from '@/utils/covertBengaliToEnglish'
import { getPersonalAdmitCardInfo } from '@/services/admitCardSerive'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useState } from 'react'

interface AdmitCardFormProps {
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

export default function AdmitCardForm({ onSubmit, onCancel }: AdmitCardFormProps) {
  const [formData, setFormData] = useState({
    registrationNo: "",
    rollNo: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const modifiedFormData = {
        registrationNo: convertBengaliToEnglish(formData.registrationNo),
        rollNo: convertBengaliToEnglish(formData.rollNo)
      }
      
      // First get student info
      const studentInfo = await getPersonalAdmitCardInfo(modifiedFormData)
      console.log('Student Info:', studentInfo)
      
      if (!studentInfo.success) {
        return toast.error(studentInfo.message || "Something went wrong")
      }

      // Then get PDF
      const response = await fetch('http://localhost:5490/api/pdf/admit-card-personal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentInfo.data)
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Convert response to blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `admit-card-${formData.registrationNo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('প্রবেশপত্র ডাউনলোড করা হয়েছে')
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="registrationNo">নিবন্ধন নং</Label>
        <Input
          id="registrationNo"
          name="registrationNo"
          type="text"
          value={convertToBengali(formData.registrationNo)}
          onChange={handleChange}
          placeholder="নিবন্ধন নং লিখুন"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rollNo">রোল নং</Label>
        <Input
          id="rollNo"
          name="rollNo"
          type="text"
          value={convertToBengali(formData.rollNo)}
          onChange={handleChange}
          placeholder="রোল নং লিখুন"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            বাতিল করুন
          </Button>
        )}
        <Button 
          type="submit" 
          className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          প্রবেশপত্র তৈরী করুন
        </Button>
      </div>
    </div>
  )
} 