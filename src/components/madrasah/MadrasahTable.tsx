import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdEdit, MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { type Madrasah } from '@/services/madrasahService';
import { marhalaTypes } from '@/constants/madrasahConstants';

interface MadrasahTableProps {
  madrasahs: Madrasah[];
  onDelete: (id: string) => void;
}

export function MadrasahTable({ madrasahs, onDelete }: MadrasahTableProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-emerald-500 text-white">
              <th className="px-6 py-3 text-left">কোড</th>
              <th className="px-6 py-3 text-left">মাদরাসার নাম</th>
              <th className="px-6 py-3 text-left">ঠিকানা</th>
              <th className="px-6 py-3 text-left">সর্বোচ্চ মারহালা</th>
              <th className="px-6 py-3 text-left">মুহতামিম</th>
              <th className="px-6 py-3 text-left">মাদরাসার ধরণ</th>
              <th className="px-6 py-3 text-left">ইমেইল</th>
              <th className="px-6 py-3 text-left">মোবাইল</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {madrasahs.map((madrasah) => (
              <tr key={madrasah._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4">{madrasah.code}</td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/dashboard/madrasah/${madrasah._id}`}
                    className="text-[#52b788] hover:text-[#52b788]/80 hover:underline"
                  >
                    {madrasah.madrasahNames.bengaliName}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {[
                    madrasah.address.policeStation,
                    madrasah.address.subDistrict,
                    madrasah.address.district
                  ].filter(Boolean).join(', ')}
                </td>
                <td className="px-6 py-4">
                  {marhalaTypes.find(m => m.value === madrasah.madrasah_information.highestMarhala)?.label || madrasah.madrasah_information.highestMarhala}
                </td>
                <td className="px-6 py-4">{madrasah.muhtamim?.name || '-'}</td>
                <td className="px-6 py-4">
                  {madrasah.madrasah_information.madrasahType === 'BOY' ? 'বালক' : 'বালিকা'}
                </td>
                <td className="px-6 py-4">{madrasah.email}</td>
                <td className="px-6 py-4">{madrasah.contactNo1}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-7 w-7 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center p-0"
                      >
                        <BsThreeDots className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-40 bg-white shadow-lg border border-gray-100 rounded-md p-1"
                      sideOffset={5}
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/madrasah/${madrasah._id}/edit`}
                          className="flex items-center px-3 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-600 rounded-md cursor-pointer transition-colors"
                        >
                          <MdEdit className="h-4 w-4 mr-2" />
                          <span>সম্পাদনা</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(madrasah._id)}
                        className="flex items-center px-3 py-2 text-sm hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer transition-colors mt-1"
                      >
                        <MdDelete className="h-4 w-4 mr-2" />
                        <span>মুছে ফেলুন</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
