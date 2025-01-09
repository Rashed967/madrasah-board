import { IMadrasah } from '@/features/madrasah/interfaces';
import { InputField } from './FormFields';

interface MuhtamimInformationSectionProps {
  formData: IMadrasah;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function MuhtamimInformationSection({
  formData,
  onChange,
  onSubmit,
  isSubmitting
}: MuhtamimInformationSectionProps) {
  const muhtamim = formData.muhtamim && typeof formData.muhtamim !== 'string' 
    && formData.muhtamim;

  if (!muhtamim) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-2 md:mt-4">
      <h5 className="text-base font-semibold mb-2">মুহতামিমের তথ্য</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="muhtamim.name"
          value={formData.muhtamim?.name || ''}
          onChange={onChange}
        />
        <InputField
          label="মোবাইল নম্বর"
          name="muhtamim.contactNo"
          value={formData.muhtamim?.contactNo || ''}
          onChange={onChange}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="muhtamim.nidNumber"
          value={formData.muhtamim?.nidNumber || ''}
          onChange={onChange}
        />
        <InputField
          label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
          name="muhtamim.highestEducationalQualification"
          value={formData.muhtamim?.highestEducationalQualification || ''}
          onChange={onChange}
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
