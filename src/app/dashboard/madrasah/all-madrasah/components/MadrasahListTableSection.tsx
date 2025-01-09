import { MadrasahTable } from '@/components/madrasah/MadrasahTable';
import { IMadrasah } from '@/features/madrasah/interfaces';
import { TableSkeleton } from './TableSkeleton';

interface MadrasahListTableSectionProps {
  madrasahs: IMadrasah[];
  onDelete: (id: string) => Promise<void>;
  getAddressField: (madrasah: IMadrasah, field: string) => string;
  getMadrasahInfoField: (madrasah: IMadrasah, field: string) => string | number;
  isLoading?: boolean;
  isError?: string | null;
  onRetry?: () => void;
}

export function MadrasahListTableSection({
  madrasahs,
  onDelete,
  getAddressField,
  getMadrasahInfoField,
  isLoading,
  isError,
  onRetry
}: MadrasahListTableSectionProps) {
  if (isLoading) {
    return <TableSkeleton rowCount={10} />;
  }

  if (isError) {
    return (
      <div className="mt-6 bg-white rounded-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <p>{isError && 'কোনো মাদ্রাসা পাওয়া যায়নি'}</p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <MadrasahTable
        madrasahs={madrasahs}
        onDelete={onDelete}
        getAddressField={getAddressField}
        getMadrasahInfoField={getMadrasahInfoField}
      />
    </div>
  );
}
