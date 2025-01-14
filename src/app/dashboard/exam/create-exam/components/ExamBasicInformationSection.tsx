import TextInputField from '@/components/forms/textInputField';
import DateInputField from '@/components/forms/DateInputField';

interface BasicInformationSectionProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExamBasicInformationSection({
  formData,
  errors,
  onChange
}: BasicInformationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800">
        <TextInputField
          formData={formData}
          label="পরীক্ষার নাম"
          name="examName"
          onChange={onChange}
          error={errors.examName}
        />
        <DateInputField
          formData={formData}
          label="শুরুর তারিখ"
          type="date"
          name="startDate"
          onChange={onChange}
          error={errors.startDate}
        />
        <DateInputField
          formData={formData}
          label="শেষের তারিখ"
          type="date"
          name="endDate"
          onChange={onChange}
          error={errors.endDate}
        />
      </div>
    </div>
  );
}