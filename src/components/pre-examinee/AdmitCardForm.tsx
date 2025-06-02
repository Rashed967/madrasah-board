import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog } from '@/components/ui/dialog'
import { useState } from 'react'

interface AdmitCardFormProps {
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

export default function AdmitCardForm({ onSubmit, onCancel }: AdmitCardFormProps) {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    rollNumber: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    if (onSubmit) {
      onSubmit(formData)
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
        <Label htmlFor="registrationNumber">নিবন্ধন নং</Label>
        <Input
          id="registrationNumber"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          placeholder="নিবন্ধন নং লিখুন"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rollNumber">রোল নং</Label>
        <Input
          id="rollNumber"
          name="rollNumber"
          value={formData.rollNumber}
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