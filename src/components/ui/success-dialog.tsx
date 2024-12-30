'use client';

import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessDialog({ isOpen, onClose, message }: SuccessDialogProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-6 text-center align-middle shadow-xl transition-all">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>

          <Dialog.Title className="mt-4 text-xl font-medium text-gray-900">
            Success!
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-gray-500">
            {message}
          </Dialog.Description>

          <div className="mt-4">
            <button
              type="button"
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              onClick={onClose}
            >
              Ok
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
