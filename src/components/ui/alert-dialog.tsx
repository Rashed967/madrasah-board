import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function AlertDialog({
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  confirmText = "মুছে ফেলুন",
  cancelText = "বাতিল"
}: AlertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
