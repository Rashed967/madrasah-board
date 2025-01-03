interface TableBodySkeletonProps {
  rowCount?: number;
}

export function TableBodySkeleton({ rowCount = 5 }: TableBodySkeletonProps) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {Array.from({ length: rowCount }).map((_, index) => (
        <tr key={index}>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
