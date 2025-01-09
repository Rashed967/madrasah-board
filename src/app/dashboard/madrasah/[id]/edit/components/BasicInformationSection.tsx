import { IMadrasah } from '@/features/madrasah/interfaces';
import BasicInfoForm from "@/components/forms/BasicInfoForm";

interface BasicInformationSectionProps {
  formData: IMadrasah;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: Record<string, string>;
}

export function BasicInformationSection({
  formData,
  onChange,
  onSubmit,
  errors
}: BasicInformationSectionProps) {
  return (
    <form onSubmit={onSubmit}>
      <BasicInfoForm madrasahData={formData} onChange={onChange} errors={errors} />
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-xs md:text-sm text-white rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </form>
  );
}
