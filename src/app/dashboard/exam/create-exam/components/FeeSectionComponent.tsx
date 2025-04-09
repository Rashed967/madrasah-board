// fee section component

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAllMarhalas } from '@/features/marhala/marhala.service'
import { useEffect, useState } from 'react'

interface Props {
  formData: {
    examFeeForBoys: Array<{
      marhala: string
      examFeeForRegularStudent: number
      examFeeForIrregularStudent: number
      lateExamFeeForRegularStudent: number
      lateExamFeeForIrregularStudent: number
      startRollNumber?: string
    }>
    examFeeForGirls: Array<{
      marhala: string
      examFeeForRegularStudent: number
      examFeeForIrregularStudent: number
      lateExamFeeForRegularStudent: number
      lateExamFeeForIrregularStudent: number
      startRollNumber?: string
    }>
  }
  errors?: Record<string, string>
  onFeeChange: (gender: 'Boys' | 'Girls', marhalaIndex: number, field: string, value: string) => void
  marhalaList: {
    boys: Array<{ id: string; name: string }>
    girls: Array<{ id: string; name: string }>
  }
}

export default function FeeSectionComponent({
  formData,
  errors,
  onFeeChange,
  marhalaList
}: Props) {
  // useEffect to fetch marhalas end
  return (
    <div className="space-y-6 text-black">
      <h2 className="text-lg font-semibold text-gray-800">মারহালা ভিত্তিক পরীক্ষার ফি</h2>

      {/* Boys Section */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-700">বালক শাখা</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">মারহালা</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">শুরুর রোল নম্বর </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">পরীক্ষা ফি (নিয়মিত)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">পরীক্ষা ফি (অনিয়মিত)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">বিলম্ব পরীক্ষা ফি (নিয়মিত)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">বিলম্ব পরীক্ষা ফি (অনিয়মিত)</th>
              </tr>
            </thead>
            <tbody>
              {marhalaList.boys.map((marhala, index) => (
                <tr key={marhala.id} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {marhala.name}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForBoys[index]?.startRollNumber || ''}
                      onChange={(e) => onFeeChange('Boys', index, 'startRollNumber', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForBoys.${index}.startRollNumber`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForBoys.${index}.startRollNumber`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForBoys.${index}.startRollNumber`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForBoys[index]?.examFeeForRegularStudent || ''}
                      onChange={(e) => onFeeChange('Boys', index, 'examFeeForRegularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForBoys.${index}.examFeeForRegularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForBoys.${index}.examFeeForRegularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForBoys.${index}.examFeeForRegularStudent`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForBoys[index]?.examFeeForIrregularStudent || ''}
                      onChange={(e) => onFeeChange('Boys', index, 'examFeeForIrregularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForBoys.${index}.examFeeForIrregularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForBoys.${index}.examFeeForIrregularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForBoys.${index}.examFeeForIrregularStudent`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForBoys[index]?.lateExamFeeForRegularStudent || ''}
                      onChange={(e) => onFeeChange('Boys', index, 'lateExamFeeForRegularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForBoys.${index}.lateExamFeeForRegularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForBoys.${index}.lateExamFeeForRegularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForBoys.${index}.lateExamFeeForRegularStudent`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForBoys[index]?.lateExamFeeForIrregularStudent || ''}
                      onChange={(e) => onFeeChange('Boys', index, 'lateExamFeeForIrregularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForBoys.${index}.lateExamFeeForIrregularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForBoys.${index}.lateExamFeeForIrregularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForBoys.${index}.lateExamFeeForIrregularStudent`]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Girls Section */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-700">বালিকা শাখা</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">মারহালা</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">শুরুর রোল নম্বর</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">পরীক্ষা ফি (নিয়মিত)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">পরীক্ষা ফি (অনিয়মিত)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">বিলম্ব পরীক্ষা ফি (নিয়মিত)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">বিলম্ব পরীক্ষা ফি (অনিয়মিত)</th>
              </tr>
            </thead>
            <tbody>
              {marhalaList.girls.map((marhala, index) => (
                <tr key={marhala.id} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {marhala.name}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForGirls[index]?.startRollNumber || ''}
                      onChange={(e) => onFeeChange('Girls', index, 'startRollNumber', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForGirls.${index}.startRollNumber`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForGirls.${index}.startRollNumber`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForGirls.${index}.startRollNumber`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForGirls[index]?.examFeeForRegularStudent || ''}
                      onChange={(e) => onFeeChange('Girls', index, 'examFeeForRegularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForGirls.${index}.examFeeForRegularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForGirls.${index}.examFeeForRegularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForGirls.${index}.examFeeForRegularStudent`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForGirls[index]?.examFeeForIrregularStudent || ''}
                      onChange={(e) => onFeeChange('Girls', index, 'examFeeForIrregularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForGirls.${index}.examFeeForIrregularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForGirls.${index}.examFeeForIrregularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForGirls.${index}.examFeeForIrregularStudent`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForGirls[index]?.lateExamFeeForRegularStudent || ''}
                      onChange={(e) => onFeeChange('Girls', index, 'lateExamFeeForRegularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForGirls.${index}.lateExamFeeForRegularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForGirls.${index}.lateExamFeeForRegularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForGirls.${index}.lateExamFeeForRegularStudent`]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={formData.examFeeForGirls[index]?.lateExamFeeForIrregularStudent || ''}
                      onChange={(e) => onFeeChange('Girls', index, 'lateExamFeeForIrregularStudent', e.target.value)}
                      className={`w-24 ${errors?.[`examFeeForGirls.${index}.lateExamFeeForIrregularStudent`] ? 'border-red-500' : ''}`}
                    />
                    {errors?.[`examFeeForGirls.${index}.lateExamFeeForIrregularStudent`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`examFeeForGirls.${index}.lateExamFeeForIrregularStudent`]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {errors?.fees && (
        <p className="text-red-500 text-sm">{errors.fees}</p>
      )}
    </div>
  )
}
