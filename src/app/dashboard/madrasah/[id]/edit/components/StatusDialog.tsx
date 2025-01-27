import { Dialog } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function StatusDialog({
  isOpen,
  onClose,
  title,
  message,
  type
}: StatusDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="mt-4 text-center">
        <p className="text-gray-600">{message}</p>
      </div>
    </Dialog>
  );
}


{/* <div className="flex flex-col items-center gap-2">
{type === 'success' ? (
  <CheckCircle2 className="h-8 w-8 text-green-500" />
) : (
  <AlertCircle className="h-8 w-8 text-red-500" />
)}
<span className="text-lg font-semibold">{title}</span>
</div> */}