import { TableBodySkeleton } from './TableBodySkeleton';
import { TableHeadSkeleton } from './TableHeadSkeleton';

interface TableSkeletonProps {
  rowCount?: number;
}

export function TableSkeleton({ rowCount = 5 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeadSkeleton />
          <TableBodySkeleton rowCount={rowCount} />
        </table>
      </div>
    </div>
  );
}
