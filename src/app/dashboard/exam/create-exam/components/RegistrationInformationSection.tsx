// Registration information section component

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  formData: {
    registrationFeeForRegularStudent: number
    registrationFeeForIrregularStudent: number
    lateRegistrationFeeForRegularStudent: number
    lateRegistrationFeeForIrregularStudent: number
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: Record<string, string>
}

export default function RegistrationInformationSection({
  formData,
  onChange,
  errors
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">রেজিস্ট্রেশন ফি</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-black">
        <div>
          <Label className='text-black'>নিবন্ধন ফি (নিয়মিত)</Label>
          <Input
            type="number"
            name="registrationFeeForRegularStudent"
            value={formData.registrationFeeForRegularStudent}
            onChange={onChange}
            placeholder="নিবন্ধন ফি (নিয়মিত)"
            className={`text-black w-full ${errors?.registrationFeeForRegularStudent ? 'border-red-500' : ''}`}
          />
          {errors?.registrationFeeForRegularStudent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.registrationFeeForRegularStudent}
            </p>
          )}
        </div>

        <div>
          <Label>নিবন্ধন ফি (অনিয়মিত)</Label>
          <Input
            type="number"
            name="registrationFeeForIrregularStudent"
            value={formData.registrationFeeForIrregularStudent}
            onChange={onChange}
            placeholder="নিবন্ধন ফি (অনিয়মিত)"
            className={`w-full ${errors?.registrationFeeForIrregularStudent ? 'border-red-500' : ''}`}
          />
          {errors?.registrationFeeForIrregularStudent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.registrationFeeForIrregularStudent}
            </p>
          )}
        </div>

        <div>
          <Label>বিলম্ব নিবন্ধন ফি (নিয়মিত)</Label>
          <Input
            type="number"
            name="lateRegistrationFeeForRegularStudent"
            value={formData.lateRegistrationFeeForRegularStudent}
            onChange={onChange}
            placeholder="বিলম্ব নিবন্ধন ফি (নিয়মিত)"
            className={`w-full ${errors?.lateRegistrationFeeForRegularStudent ? 'border-red-500' : ''}`}
          />
          {errors?.lateRegistrationFeeForRegularStudent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lateRegistrationFeeForRegularStudent}
            </p>
          )}
        </div>

        <div>
          <Label>বিলম্ব নিবন্ধন ফি (অনিয়মিত)</Label>
          <Input
            type="number"
            name="lateRegistrationFeeForIrregularStudent"
            value={formData.lateRegistrationFeeForIrregularStudent}
            onChange={onChange}
            placeholder="বিলম্ব নিবন্ধন ফি (অনিয়মিত)"
            className={`w-full ${errors?.lateRegistrationFeeForIrregularStudent ? 'border-red-500' : ''}`}
          />
          {errors?.lateRegistrationFeeForIrregularStudent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lateRegistrationFeeForIrregularStudent}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
