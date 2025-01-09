import Link from 'next/link';
import { IMadrasah } from '@/features/madrasah/interfaces';
import { marhala_types_with_label_Values } from '@/constants/madrasahConstants';
import { MadrasahTableRowActions } from './MadrasahTableRowActions';

interface MadrasahTableRowProps {
  madrasah: IMadrasah;
  onDelete: (id: string) => Promise<void>;
  getAddressField: (madrasah: IMadrasah, field: string) => string;
  getMadrasahInfoField: (madrasah: IMadrasah, field: string) => string | number;
}

export function MadrasahTableRow({
  madrasah,
  onDelete,
  getAddressField,
  getMadrasahInfoField,
}: MadrasahTableRowProps) {
  return (
    <tr key={madrasah._id} className="border-b hover:bg-gray-50">
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
          getAddressField(madrasah, 'policeStation'),
          getAddressField(madrasah, 'subDistrict'),
          getAddressField(madrasah, 'district')
        ].filter(Boolean).join(', ')}
      </td>
      <td className="px-6 py-4">
        {marhala_types_with_label_Values.find(m => m.value === getMadrasahInfoField(madrasah, 'highestMarhala'))?.label || getMadrasahInfoField(madrasah, 'highestMarhala')}
      </td>
      <td className="px-6 py-4">{getMadrasahInfoField(madrasah, 'muhtamimName')}</td>
      <td className="px-6 py-4">
        {getMadrasahInfoField(madrasah, 'madrasahType') === 'BOY' ? 'বালক' : 'বালিকা'}
      </td>
      <td className="px-6 py-4">{madrasah.email || '-'}</td>
      <td className="px-6 py-4">{madrasah.contactNo1 || '-'}</td>
      <td className="px-6 py-4 text-right">
        <MadrasahTableRowActions
          madrasahId={madrasah._id.toString()}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
