import { useState } from 'react';
import { StatusDialogState } from '@/types/preExaminee.types';

export const useStatusDialog = () => {
  const [statusDialog, setStatusDialog] = useState<StatusDialogState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showSuccessDialog = (message: string) => {
    setStatusDialog({
      isOpen: true,
      type: 'success',
      title: 'সফল!',
      message
    });
  };

  const showErrorDialog = (message: string) => {
    setStatusDialog({
      isOpen: true,
      type: 'error',
      title: 'ব্যার্থ!',
      message
    });
  };

  const closeDialog = () => {
    setStatusDialog(prev => ({ ...prev, isOpen: false }));
  };

  return {
    statusDialog,
    showSuccessDialog,
    showErrorDialog,
    closeDialog
  };
};
