import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Printer } from "lucide-react";

interface MadrasahPrintPreviewProps {
  printContent: string;
  onClose: () => void;
}

export function MadrasahPrintPreview({ printContent, onClose }: MadrasahPrintPreviewProps) {
  return (
    <Card className="w-10/12 p-4 mx-auto mt-8">
      <div className="flex justify-end">
        <div className="flex gap-2 mb-6 no-print">
          <Button 
            variant="outline" 
            className="text-red-600 border-red-500 hover:bg-red-50"
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-2" />
            বন্ধ করুন
          </Button>
          <Button 
            variant="outline" 
            className="text-emerald-600 border-emerald-500 hover:bg-emerald-50"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            প্রিন্ট করুন
          </Button>
        </div>
      </div>
      <div 
        className="print-preview-content"
        dangerouslySetInnerHTML={{ __html: printContent }}
      />
    </Card>
  );
}
