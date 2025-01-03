import { IMadrasah } from '@/features/madrasah/interfaces';
import { InputField } from './FormFields';

interface EducationSecretarySectionProps {
  formData: IMadrasah;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function EducationSecretarySection({
  formData,
  onChange,
  onSubmit,
  isSubmitting
}: EducationSecretarySectionProps) {
  const secretary = formData.educational_secretory && typeof formData.educational_secretory !== 'string' 
    && formData.educational_secretory;

  if (!secretary) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">শিক্ষা সচিবের তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="নাম"
          name="educational_secretory.name"
          value={formData.educational_secretory?.name || ''}
          onChange={onChange}
        />
        <InputField
          label="মোবাইল নম্বর"
          name="educational_secretory.contactNo"
          value={formData.educational_secretory?.contactNo || ''}
          onChange={onChange}
        />
        <InputField
          label="এনআইডি নম্বর"
          name="educational_secretory.nidNumber"
          value={formData.educational_secretory?.nidNumber || ''}
          onChange={onChange}
        />
        <InputField
          label="সর্বোচ্চ শিক্ষাগত যোগ্যতা"
          name="educational_secretory.highestEducationalQualification"
          value={formData.educational_secretory?.highestEducationalQualification || ''}
          onChange={onChange}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </div>
    </form>
  );
}
