import { IMadrasah } from '@/features/madrasah/interfaces';
import { InputField } from './FormFields';
import { SelectField } from '@/components/ui/select';
import chairmanMutawalliDesignation from '@/data/chairman_mutawalli.designation';

interface MutawalliInformationSectionProps {
  formData: IMadrasah;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function MutawalliInformationSection({
  formData,
  onChange,
  onSubmit,
  isSubmitting
}: MutawalliInformationSectionProps) {
  const mutawalli = formData.chairman_mutawalli && typeof formData.chairman_mutawalli !== 'string' 
    && formData.chairman_mutawalli;

  if (!mutawalli) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-base font-semibold mb-4 mt-2 md:mt-4">সভাপতি/মুতাওয়াল্লির তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="chairman_mutawalli.name"
          value={formData.chairman_mutawalli?.name || ''}
          onChange={onChange}
        />
        <InputField
          label="মোবাইল নম্বর"
          name="chairman_mutawalli.contactNo"
          value={formData.chairman_mutawalli?.contactNo || ''}
          onChange={onChange}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="chairman_mutawalli.nidNumber"
          value={formData.chairman_mutawalli?.nidNumber || ''}
          onChange={onChange}
        />
        <SelectField
          label="পদবি"
          name="chairman_mutawalli.designation"
          value={formData.chairman_mutawalli?.designation || ''}
          onChange={onChange}
          options={chairmanMutawalliDesignation}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-white text-xs md:text-sm rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </div>
    </form>
  );
}
