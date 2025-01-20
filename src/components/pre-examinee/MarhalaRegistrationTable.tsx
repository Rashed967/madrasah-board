import { Input } from "@/components/ui/input";
import { memo } from "react";

interface MarhalaTableProps {
  examineesPerMahala: Array<{
    marhalaName: string;
    totalExamineesSlots: number;
    startingRegistrationNumber: number;
    endingRegistrationNumber: number;
    totalFeesAmount: number;
  }>;
  onExamineeCountChange: (marhalaName: string, count: number) => void;
  totalExaminees: number;
  totalAmount: number;
}

const MarhalaRegistrationTable = memo(({ 
  examineesPerMahala,
  onExamineeCountChange,
  totalExaminees,
  totalAmount
}: MarhalaTableProps) => {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-sm border-b">
            <th className="py-2 px-3 text-left font-medium">মারহালা</th>
            <th className="py-2 px-3 text-center font-medium">পরীক্ষার্থী সংখ্যা</th>
            <th className="py-2 px-3 text-center font-medium">রেজিস্ট্রেশন নম্বর</th>
            <th className="py-2 px-3 text-right font-medium">মোট টাকা</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {examineesPerMahala.map(marhala => (
            <tr key={marhala.marhalaName} className="hover:bg-gray-50">
              <td className="py-2 px-3 text-sm">{marhala.marhalaName}</td>
              <td className="py-2 px-3">
                <Input 
                  type="number" 
                  placeholder="0"
                  value={marhala.totalExamineesSlots || ''}
                  onChange={(e) => onExamineeCountChange(marhala.marhalaName, parseInt(e.target.value) || 0)}
                  className="!h-7 text-center text-sm w-24 mx-auto"
                />
              </td>
              <td className="py-2 px-3">
                <div className="flex items-center justify-center space-x-1 text-xs">
                  <Input 
                    type="number"
                    value={marhala.startingRegistrationNumber || ''}
                    readOnly
                    className="!h-7 !w-20 !px-1 text-center bg-gray-50"
                  />
                  <span className="text-gray-400">-</span>
                  <Input 
                    type="number"
                    value={marhala.endingRegistrationNumber || ''}
                    readOnly
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
            <td className="py-2 px-3 text-center text-sm">
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
  );
});

MarhalaRegistrationTable.displayName = 'MarhalaRegistrationTable';

export default MarhalaRegistrationTable;
