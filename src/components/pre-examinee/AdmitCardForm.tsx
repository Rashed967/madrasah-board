import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { convertToBengali } from '@/utils/convertToBengali'
import { convertBengaliToEnglish } from '@/utils/covertBengaliToEnglish'
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

  // Convert Bengali numbers to English numbers


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const modifiedFormData = {
      registrationNo: convertBengaliToEnglish(formData.registrationNo),
      rollNo: convertBengaliToEnglish(formData.rollNo)
    }
    console.log('Converted form data:', modifiedFormData)
    if (onSubmit) {
      onSubmit(modifiedFormData)
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
        >
          প্রবেশপত্র তৈরী করুন
        </Button>
      </div>
    </div>
  )
} 