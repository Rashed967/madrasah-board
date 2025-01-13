import React from 'react';
import NumberInputField from '@/components/forms/NumberInputField';
import marhalaNames from '@/data/marhala.names';

interface ExamineeCountSectionProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExamineeCountSection: React.FC<ExamineeCountSectionProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">পরীক্ষার্থীর সংখ্যা নির্ধারণ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.examineesPerMahala.map((marhala: any, index: number) => (
          <div key={marhala.marhalaName} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <span className="text-sm font-medium">{marhala.marhalaName}</span>
              <NumberInputField
                label=""
                name={`examineesPerMahala.${index}.totalExamineesSlots`}
                type="number"
                value={marhala.totalExamineesSlots}
                onChange={onChange}
                error={errors[`examineesPerMahala.${index}.totalExamineesSlots`]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberInputField
                label="শুরুর নম্বর"
                name={`examineesPerMahala.${index}.startingRegistrationNumber`}
                type="number"
                value={marhala.startingRegistrationNumber}
                onChange={onChange}
                error={errors[`examineesPerMahala.${index}.startingRegistrationNumber`]}
              />
              <NumberInputField
                label="শেষের নম্বর"
                name={`examineesPerMahala.${index}.endingRegistrationNumber`}
                type="number"
                value={marhala.endingRegistrationNumber}
                onChange={onChange}
                error={errors[`examineesPerMahala.${index}.endingRegistrationNumber`]}
                // disabled
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamineeCountSection;
