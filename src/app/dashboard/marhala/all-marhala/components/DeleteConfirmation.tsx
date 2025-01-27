import { AlertDialog } from '@/components/ui/alert-dialog';
import { IMarhala } from '@/features/marhala/marhala.interface';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedMarhala: IMarhala | null;
}

export const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  selectedMarhala
}: DeleteConfirmationProps) => {
  if (!selectedMarhala) return null;

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      title="মারহালা মুছে ফেলার নিশ্চিতকরণ"
      description={`আপনি কি নিশ্চিত যে আপনি "${selectedMarhala?.name?.bengaliName}" মারহালাটি মুছে ফেলতে চান?`}
      onConfirm={onConfirm}
    />
  );
};
