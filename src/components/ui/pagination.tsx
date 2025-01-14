import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between  p-4 rounded-sm mt-4">
      <div className="text-sm text-gray-600">
        মোট মাদরাসা: {totalPages * 10}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-3 text-xs text-white border-gray-200 bg-[#52B788]"
        >
          <ChevronLeft className="h-4 w-4" />
          পূর্ববর্তী
        </Button>
        <div className="flex items-center gap-1 text-sm">
          <span>পৃষ্ঠা</span>
          <span className="font-medium">{currentPage}</span>
          <span>/</span>
          <span className="font-medium">{totalPages}</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-3 text-xs border-gray-200 bg-[#61BC92]"
        >
          পরবর্তী
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
