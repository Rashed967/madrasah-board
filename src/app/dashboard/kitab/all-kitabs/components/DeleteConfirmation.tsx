import { AlertDialog } from '@/components/ui/alert-dialog';
import { IKitab } from '@/features/kitab/kitab.interface';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedKitab: IKitab | null;
}

export const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  selectedKitab
}: DeleteConfirmationProps) => {
  if (!selectedKitab) return null;

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      title="কিতাব মুছে ফেলার নিশ্চিতকরণ"
      description={`আপনি কি নিশ্চিত যে আপনি "${selectedKitab.name.bengaliName}" কিতাবটি মুছে ফেলতে চান?`}
      onConfirm={onConfirm}
    />
  );
};
