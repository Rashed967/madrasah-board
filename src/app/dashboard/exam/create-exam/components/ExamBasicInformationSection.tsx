import TextInputField from '@/components/forms/textInputField'
import DateInputField from '@/components/forms/DateInputField'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface BasicInformationSectionProps {
  formData: {
    examName: string
    registrationStartNumber: number
    endRegistrationDate: string
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ExamBasicInformationSection({
  formData,
  errors,
  onChange
}: BasicInformationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-800">
        <div className='md:col-span-2'>
        <TextInputField
          formData={formData}
          label="পরীক্ষার নাম"
          name="examName"
          onChange={onChange}
          error={errors.examName}
        />
        </div>
        
        <div>
          <Label>নিবন্ধনের শেষ তারিখ</Label>
          <Input
            type="date"
            name="endRegistrationDate"
            value={formData.endRegistrationDate}
            onChange={onChange}
            className={`w-full ${errors?.endRegistrationDate ? 'border-red-500' : ''}`}
          />
          {errors?.endRegistrationDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endRegistrationDate}
            </p>
          )}
        </div>

        <div>
          <Label>রেজিস্ট্রেশন শুরুর নম্বর</Label>
          <Input
            type="number"
            name="registrationStartNumber"
            value={formData.registrationStartNumber}
            onChange={onChange}
            placeholder="রেজিস্ট্রেশন শুরুর নম্বর"
            className={`w-full ${errors?.registrationStartNumber ? 'border-red-500' : ''}`}
          />
          {errors?.registrationStartNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.registrationStartNumber}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
