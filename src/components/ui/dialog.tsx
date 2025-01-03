import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string ;
  description?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  className?: string;
}

interface DialogChildProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  onSubmit,
  submitText = "সংরক্ষণ করুন"
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className={cn("bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 relative", className)}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Dialog Header */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>

        {/* Dialog Content */}
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}

        {/* Dialog Footer */}
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            বাতিল
          </Button>
          {onSubmit && (
            <Button 
              onClick={() => {
                onSubmit();
                onClose();
              }}
            >
              {submitText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ children, className }: DialogChildProps) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: DialogChildProps) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function DialogDescription({ children, className }: DialogChildProps) {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function DialogContent({ children, className }: DialogChildProps) {
  return <div className={cn("py-4", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: DialogChildProps) {
  return <div className={cn("flex justify-end space-x-2", className)}>{children}</div>;
}
