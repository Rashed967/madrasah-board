import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React from 'react';

interface Props {
  marhala: {
    _id: string
    name: {
      bengaliName: string
      englishName: string
    }
  }
  onChange: (marhalaId: string, data: {
    regularExamineesSlots: number
    irregularExamineesSlots: number
  }) => void
  value: {
    regularExamineesSlots: number
    irregularExamineesSlots: number
  }
  errors?: Record<string, string>
}

export default function MarhalaRegistrationForm({
  marhala,
  onChange,
  value,
  errors
}: Props) {
  const handleChange = (field: 'regularExamineesSlots' | 'irregularExamineesSlots', inputValue: string) => {
    onChange(marhala._id, {
      ...value,
      [field]: parseInt(inputValue) || 0
    })
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-md font-medium text-gray-700">{marhala.name.bengaliName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>নিয়মিত পরীক্ষার্থী সংখ্যা</Label>
          <Input
            type="number"
            value={value.regularExamineesSlots}
            onChange={(e) => handleChange('regularExamineesSlots', e.target.value)}
            className={errors?.[`${marhala._id}.regularExamineesSlots`] ? 'border-red-500' : ''}
          />
          {errors?.[`${marhala._id}.regularExamineesSlots`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`${marhala._id}.regularExamineesSlots`]}
            </p>
          )}
        </div>
        <div>
          <Label>অনিয়মিত পরীক্ষার্থী সংখ্যা</Label>
          <Input
            type="number"
            value={value.irregularExamineesSlots}
            onChange={(e) => handleChange('irregularExamineesSlots', e.target.value)}
            className={errors?.[`${marhala._id}.irregularExamineesSlots`] ? 'border-red-500' : ''}
          />
          {errors?.[`${marhala._id}.irregularExamineesSlots`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`${marhala._id}.irregularExamineesSlots`]}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 