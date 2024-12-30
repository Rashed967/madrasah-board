import React from 'react';
import { Button } from "@/components/ui/button";
import { MdPrint } from "react-icons/md";

interface PrintButtonsProps {
  onPrintAddresses: () => void;
  onPrintMadrasahList: () => void;
}

export function PrintButtons({ onPrintAddresses, onPrintMadrasahList }: PrintButtonsProps) {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onPrintAddresses}
        className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
      >
        <MdPrint className="h-4 w-4" />
        ঠিকানা প্রিন্ট করুন
      </Button>
      <Button
        onClick={onPrintMadrasahList}
        className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
      >
        <MdPrint className="h-4 w-4" />
        মাদ্রাসার তালিকা প্রিন্ট করুন
      </Button>
    </div>
  );
}
