

import { IMadrasah } from '@/features/madrasah/interfaces';
import { MadrasahTableRow } from './MadrasahTableRow';

interface MadrasahTableProps {
  madrasahs: IMadrasah[];
  onDelete: (id: string) => Promise<void>;
  getAddressField: (madrasah: IMadrasah, field: string) => string;
  getMadrasahInfoField: (madrasah: IMadrasah, field: string) => string | number;
}

export function MadrasahTable({ madrasahs, onDelete, getAddressField, getMadrasahInfoField }: MadrasahTableProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
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
              <MadrasahTableRow
                key={madrasah._id.toString()}
                madrasah={madrasah}
                onDelete={onDelete}
                getAddressField={getAddressField}
                getMadrasahInfoField={getMadrasahInfoField}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
