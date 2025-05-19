import { Button } from '@/components/ui/button';

interface PlaceholderFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const PlaceholderForm = ({ onSubmit, onCancel }: PlaceholderFormProps) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        এই ফিচারটি শীঘ্রই আসছে...
      </p>
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-gray-700"
        >
          বাতিল করুন
        </Button>
        <Button
          className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
          onClick={onSubmit}
        >
          পিডিএফ তৈরি করুন
        </Button>
      </div>
    </div>
  );
}; 