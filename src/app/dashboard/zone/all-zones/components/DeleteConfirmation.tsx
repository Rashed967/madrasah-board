import { AlertDialog } from '@/components/ui/alert-dialog';
import { IZone } from '@/features/zone';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedZone: IZone | null;
}

export const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  selectedZone
}: DeleteConfirmationProps) => {
  if (!selectedZone) return null;

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      title="জোন মুছে ফেলার নিশ্চিতকরণ"
      description={`আপনি কি নিশ্চিত যে আপনি "${selectedZone.name}" জোনটি মুছে ফেলতে চান?`}
      onConfirm={onConfirm}
    />
  );
};
