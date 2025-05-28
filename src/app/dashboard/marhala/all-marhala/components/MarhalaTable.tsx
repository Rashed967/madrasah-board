import { IMarhala } from '@/features/marhala/marhala.interface'
import { MoreHorizontal } from 'lucide-react'
import { MdEdit } from 'react-icons/md'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface MarhalaTableProps {
  marhalaList: IMarhala[]
  onShowDetails: (marhala: IMarhala) => void
  onEditClick: (marhala: IMarhala) => void
}

export default function MarhalaTable({ marhalaList, onShowDetails, onEditClick }: MarhalaTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-scroll">
      <table className="w-full">
        <thead className="bg-[#52b788] text-white">
          <tr>
            <th className="px-4 py-3 text-left font-normal">মারহালা কোড</th>
            <th className="px-4 py-3 text-left font-normal">মারহালা নাম</th>
            <th className="px-4 py-3 text-left font-normal">মারহালার ধরণ</th>
            <th className="px-4 py-3 text-left font-normal">মারহালার ক্যাটাগরি</th>
            <th className="px-4 py-3 text-left font-normal">মারহালার স্তর</th>
            <th className="px-4 py-3 text-left font-normal">কিতাব সংখ্যা</th>
            <th className="px-4 py-3 text-left font-normal">এ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {marhalaList.map((marhala) => (
            <tr key={marhala._id.toString()} className="border-b hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-600">
                {marhala.code}
              </td>
              <td
                className="px-4 py-4 text-sm font-semibold cursor-pointer"
                onClick={() => onShowDetails(marhala)}
              >
                {marhala.name.bengaliName}
                {marhala.name.arabicName && (
                  <span className="block text-gray-500 text-xs mt-1">
                    {marhala.name.arabicName}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {marhala.marhalaType === 'boys' ? 'বালক' : 'বালিকা'}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {marhala.marhalaCategory === 'darsiyat' ? 'দারসিয়াত' : 'হিফজ'}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {Number(marhala.level).toLocaleString('bn-BD')}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {Number(marhala.listOfKitabs.length).toLocaleString('bn-BD')}
              </td>
              <td className="px-4 py-4 text-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 bg-[#52B788] rounded-full text-white">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-200" align="end">
                    <DropdownMenuItem
                      onClick={() => onEditClick(marhala)}
                      className="text-gray-700"
                    >
                      <MdEdit className="mr-2" />
                      সম্পাদনা করুন
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 