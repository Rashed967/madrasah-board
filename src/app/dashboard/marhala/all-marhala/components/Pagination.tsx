interface PaginationProps {
  currentPage: number
  onPreviousPage: () => void
  onNextPage: () => void
  hasNextPage: boolean
}

export default function Pagination({
  currentPage,
  onPreviousPage,
  onNextPage,
  hasNextPage
}: PaginationProps) {
  return (
    <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center mt-2 text-gray-800">
      <div className="text-sm text-gray-600">
        পৃষ্ঠা {Number(currentPage).toLocaleString('bn-BD')}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          পূর্ববর্তী
        </button>
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          পরবর্তী
        </button>
      </div>
    </div>
  )
} 