import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface MadrasahListHeaderSectionProps {
  onPrintList: () => void;
  onPrintAddresses: () => void;
}

export function MadrasahListHeaderSection({ onPrintList, onPrintAddresses }: MadrasahListHeaderSectionProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-sm md:text-base lg:text-lg font-bold text-gray-800">মাদরাসা তালিকা</h1>
        <p className="text-sm text-gray-600">সকল নিবন্ধিত মাদরাসার তালিকা</p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onPrintList}
          variant="outline"
          className="flex items-center gap-2 text-xs md:text-sm lg:text-base text-gray-700 border border-[#52B788] hover:bg-gray-50"
        >
          <Printer className="h-4 w-4 text-gray-700" />
          <span className="hidden md:inline ">মাদরাসার</span> তালিকা <span className="hidden md:inline">প্রিন্ট</span>
        </Button>
        <Button
          onClick={onPrintAddresses}
          variant="outline"
          className="flex items-center gap-2 text-xs md:text-sm lg:text-base text-gray-700 border border-[#52B788] hover:bg-gray-50"
        >
          <Printer className="h-4 w-4 text-gray-700" />
          ঠিকানা <span className="hidden md:inline"> প্রিন্ট</span> 
        </Button>
      </div>
    </div>
  );
}
