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
        <h1 className="text-2xl font-bold text-gray-800">মাদরাসা তালিকা</h1>
        <p className="text-sm text-gray-600">সকল নিবন্ধিত মাদরাসার তালিকা</p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onPrintList}
          variant="outline"
          className="flex items-center gap-2 text-sm border border-gray-300 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" />
          মাদরাসার তালিকা প্রিন্ট
        </Button>
        <Button
          onClick={onPrintAddresses}
          variant="outline"
          className="flex items-center gap-2 text-sm border border-gray-300 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" />
          ঠিকানা প্রিন্ট
        </Button>
      </div>
    </div>
  );
}
