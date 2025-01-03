import { IMadrasah } from '@/features/madrasah/interfaces';
import { InputField } from './FormFields';
import { marhala_types_with_label_Values } from "@/constants/madrasahConstants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import marhalaNames from '@/data/marhala.names';
import { SelectField } from '@/components/ui/select';
import { madrasahTypes } from '@/data/madrasahTypes';

interface MadrasahInformationSectionProps {
  formData: IMadrasah;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function MadrasahInformationSection({
  formData,
  onChange,
  onSelectChange,
  onSubmit,
  isSubmitting
}: MadrasahInformationSectionProps) {

  const madrasah_info = formData.madrasah_information && typeof formData.madrasah_information !== 'string' 
    && formData.madrasah_information;

  // if (!madrasah_info) return null;


  return (
    <form onSubmit={onSubmit} className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <SelectField
        label="সর্বোচ্চ মারহালা"
        name="madrasah_information.highestMarhala"
        value={formData.madrasah_information?.highestMarhala || 'কোনো মারহালা নেই'}
        onChange={onChange}
        options={marhalaNames}
      />  

        <SelectField
          label="মাদ্রাসার ধরণ"
          name="madrasah_information.madrasahType"
          value={formData.madrasah_information?.madrasahType || 'কোনো মাদ্রাসা নেই'}
          onChange={onChange}
          options={madrasahTypes}
        />
     
        <InputField
          label="মোট শিক্ষার্থী"
          name="madrasah_information.totalStudents"
          value={formData.madrasah_information?.totalStudents.toString() || 0}
          onChange={onChange}
          type="number"
        />

        <InputField
          label="মোট শিক্ষক ও কর্মচারী"
          name="madrasah_information.totalTeacherAndStuff"
          value={formData.madrasah_information?.totalTeacherAndStuff.toString() || 0}
          onChange={onChange}
          type="number"
        /> 
      </div>
      <div className="mt-4 flex justify-end">
      <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
        >
          
          {isSubmitting ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </div>
    </form>
  );
}
