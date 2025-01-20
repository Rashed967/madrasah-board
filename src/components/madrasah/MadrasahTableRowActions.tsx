import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";

interface MadrasahTableRowActionsProps {
  madrasahId: string;
  onDelete: (id: string) => Promise<void>;
}

export function MadrasahTableRowActions({
  madrasahId,
  onDelete,
}: MadrasahTableRowActionsProps) {
  return (
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
            href={`/dashboard/madrasah/${madrasahId}/edit`}
            className="flex items-center px-3 py-2 text-green-800 text-sm hover:bg-emerald-50 hover:text-emerald-600 rounded-md cursor-pointer transition-colors"
          >
            <MdEdit className="h-4 w-4 mr-2" />
            <span>সম্পাদনা</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(madrasahId)}
          className="flex items-center px-3 py-2 text-red-800 text-sm hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer transition-colors mt-1"
        >
          <MdDelete className="h-4 w-4 mr-2" />
          <span>মুছে ফেলুন</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
