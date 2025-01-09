import { IMadrasah } from '@/features/madrasah/interfaces';
import { AddressForm } from '@/components/forms/AddressForm';

interface AddressInformationSectionProps {
  formData: IMadrasah;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function AddressInformationSection({
  formData,
  onChange,
  onSubmit,
  isSubmitting
}: AddressInformationSectionProps) {
  if (typeof formData.address === 'string') return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h5 className="text-base font-semibold mb-2 mt-2 md:mt-4"> ঠিকানার তথ্য</h5>

      <AddressForm
        address={formData.address}
        onChange={onChange}
      />
      <div className="mt-4 flex justify-end">
      <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-white text-xs md:text-sm rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
        >
          
          {isSubmitting ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </div>
    </form>
  );
}
