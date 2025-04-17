import { Input } from '@/components/ui/input'
import { memo } from 'react';
import React from 'react';

interface MarhalaTableProps {
  examineesPerMahala: Array<{
    marhalaName: string
    marhalaId: string
    regularExamineesSlots: number
    irregularExamineesSlots: number
    startingRegistrationNumber: number
    endingRegistrationNumber: number
    totalFeesAmount: number
  }>
  
  onExamineeCountChange: (marhalaId: string, data: { regularExamineesSlots: number, irregularExamineesSlots: number }, useLateRegistrationFee: boolean) => void
  totalExaminees: number
  totalAmount: number
  useLateRegistrationFee: boolean
}

const MarhalaRegistrationTable = memo(
  ({
    examineesPerMahala,
    onExamineeCountChange,
    totalExaminees,
    totalAmount,
    useLateRegistrationFee
  }: MarhalaTableProps) => {
    console.log('MarhalaRegistrationTable rendered with useLateRegistrationFee:', useLateRegistrationFee)
    return (
      <div className="border rounded-lg overflow-x-auto">
        <style>{`
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type='number'] {
            -moz-appearance: textfield;
          }
        `}</style>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-sm border-b">
              <th className="py-2 px-3 text-left font-medium">মারহালা</th>
              <th className="py-2 px-3 text-center font-medium">
                নিয়মিত পরীক্ষার্থী
              </th>
              <th className="py-2 px-3 text-center font-medium">
                অনিয়মিত পরীক্ষার্থী
              </th>
              <th className="py-2 px-3 text-center font-medium">
                রেজিস্ট্রেশন নম্বর
              </th>
              <th className="py-2 px-3 text-right font-medium">মোট টাকা</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {examineesPerMahala.map((marhala) => (
              <tr key={marhala.marhalaId} className="hover:bg-gray-50">
                <td className="py-2 px-3 text-sm">{marhala.marhalaName}</td>
                <td className="py-2 px-3">
                  <Input
                    type="number"
                    placeholder="0"
                    value={marhala.regularExamineesSlots}
                    onChange={(e) =>
                      onExamineeCountChange(marhala.marhalaId, {
                        regularExamineesSlots: parseInt(e.target.value) || 0,
                        irregularExamineesSlots: marhala.irregularExamineesSlots
                      }, useLateRegistrationFee)
                    }
                    className="!h-7 text-center text-sm w-24 mx-auto bg-white"
                  />
                </td>
                <td className="py-2 px-3">
                  <Input
                    type="number"
                    placeholder="0"
                    value={marhala.irregularExamineesSlots}
                    onChange={(e) =>
                      onExamineeCountChange(marhala.marhalaId, {
                        regularExamineesSlots: marhala.regularExamineesSlots,
                        irregularExamineesSlots: parseInt(e.target.value) || 0
                      }, useLateRegistrationFee)
                    }
                    className="!h-7 text-center text-sm w-24 mx-auto bg-white"
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center justify-center space-x-1 text-xs">
                    <Input
                      type="number"
                      value={marhala.startingRegistrationNumber || ''}
                      readOnly
                      disabled
                      className="!h-7 !w-20 !px-1 text-center bg-gray-50"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      value={marhala.endingRegistrationNumber || ''}
                      readOnly
                      disabled
                      className="!h-7 !w-20 !px-1 text-center bg-gray-50"
                    />
                  </div>
                </td>
                <td className="py-2 px-3 text-right text-sm text-gray-600">
                  {marhala.totalFeesAmount.toLocaleString()}/-
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t">
            <tr>
              <td className="py-2 px-3 text-sm font-medium">মোট</td>
              <td colSpan={2} className="py-2 px-3 text-center text-sm">
                {totalExaminees} জন
              </td>
              <td className="py-2 px-3 text-center text-sm"></td>
              <td className="py-2 px-3 text-right text-sm font-medium">
                {totalAmount.toLocaleString()}/-
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
)

MarhalaRegistrationTable.displayName = 'MarhalaRegistrationTable'

export default MarhalaRegistrationTable
