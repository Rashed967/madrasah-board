import { Button } from '@/components/ui/button'
import { X, Printer } from 'lucide-react'

interface MadrasahPrintPreviewProps {
  printContent: string
  printType: 'list' | 'addresses'
  onClose: () => void
}

export function MadrasahPrintPreview({
  printContent,
  printType,
  onClose
}: MadrasahPrintPreviewProps) {
  return (
    <div className='max-w-[1300px] mx-auto px-2 py-4'> 
    <div className="flex justify-end gap-4 mb-6 print:hidden">
    <Button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#52B788] hover:bg-[#429b71] text-white"
    >
      <Printer className="h-4 w-4" />
      প্রিন্ট
    </Button>
    <Button
      onClick={onClose}
      variant="outline"
      className="flex items-center gap-2 border-2 border-black"
    >
      <X className="h-4 w-4 border-2 " />
      বাতিল
    </Button>
  </div>
    <div className="min-h-screen bg-white">
      <style>
        {`
          @media print {
            @page {
              size: ${printType === 'list' ? 'A4 landscape' : 'A4 portrait'};
              margin-top: 5mm;
              margin-bottom: 3mm;
              margin-left: 2mm;
              margin-right: 2mm;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-content {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-content * {
              visibility: visible !important;
            }
            .print:hidden {
              display: none !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
            th, td {
              border: 1px solid black !important;
              padding: 5px !important;
              font-size: 14pt !important;
            }


          }
           .print-header-logo {
              position: absolute;
              top: 16px;
              left: 200px;
              z-index: 50;
            }

             .print-header {
              margin-top: 0mm !important;
              margin-bottom: 2mm !important;
              @media print {
                margin-top: -10mm !important;
              }
            }
            .print-header h1 {
              font-size: 18pt !important;
              margin: 0 !important;
              font-weight: bold;
            }
            .print-header h2 {
              font-size: 14pt !important;
              margin: 0 !important;
            }
            .print-header h3 {
              font-size: 12pt !important;
              margin: 0 !important;
            }
            .print-header p {
              font-size: 12pt !important;
              margin: 0mm 0 !important;
            }
            .print-header-divider {
              margin: 1mm 0 !important;
              border-top: 0.5px solid gray !important;
              padding-top: .3mm !important;
              border-bottom: 2px solid black !important;
            }
          @media screen {
            .print-content {
              width: 100%;
            }
          }
        `}
      </style>
      <div className="max-w-[1200px] mx-auto px-2 pt-6 pb-4">
       

        <div
          className="print-content"
          dangerouslySetInnerHTML={{ __html: printContent }}
        />
      </div>
    </div>
    </div>
  )
} 