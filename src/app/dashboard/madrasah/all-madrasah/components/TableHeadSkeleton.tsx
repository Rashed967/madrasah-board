interface ColumnWidth {
  width: string;
  align?: 'left' | 'right';
}

interface TableHeadSkeletonProps {
  columns?: ColumnWidth[];
}

const defaultColumns: ColumnWidth[] = [
  { width: 'w-1/4' },
  { width: 'w-1/2' },
  { width: 'w-full' },
  { width: 'w-1/3' },
  { width: 'w-1/4' },
  { width: 'w-1/2' },
  { width: 'w-full' },
  { width: 'w-1/3' },
  { width: 'w-1/4', align: 'right' }
];

export function TableHeadSkeleton({ columns = defaultColumns }: TableHeadSkeletonProps) {
  return (
    <thead className="bg-gray-200">
      <tr>
        {columns.map((column, index) => (
          <th key={index} className={`px-6 py-4 text-${column.align || 'left'}`}>
            <div className={`h-4 bg-gray-200 rounded ${column.width}`}></div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
