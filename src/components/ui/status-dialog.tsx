'use client';

import { Dialog } from '@/components/ui/dialog';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error';
}

export function StatusDialog({ isOpen, onClose, title, message, type }: StatusDialogProps) {
  const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;
  const colorClass = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="sm:max-w-[400px]"
    >
      <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 py-2 sm:py-4">
        <Icon className={`h-12 w-12 sm:h-16 sm:w-16 ${colorClass}`} />
        <p className="text-sm sm:text-lg text-center text-gray-700 whitespace-pre-line px-2">{message}</p>
      </div>
    </Dialog>
  );
}
