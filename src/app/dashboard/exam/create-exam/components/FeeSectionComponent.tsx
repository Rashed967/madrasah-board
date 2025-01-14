// fee section component

import NumberInputField from "@/components/forms/NumberInputField";


interface FeeSectionComponentProps {
    formData: any;
    errors: Record<string, string>;
    onFeeChange: (gender: string, index: number, value: string) => void;
  }


export default function FeeSectionComponent({ formData, errors, onFeeChange }: FeeSectionComponentProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-800">
{/* Boys Fee Section */}
<div className="space-y-4 ">
  <h3 className="text-lg font-medium">ছাত্রদের পরীক্ষার ফি</h3>
  <div className="grid gap-4">
    {formData.examFeeForBoys.map((fee, index) => (
      <div key={fee.marhala} className="grid grid-cols-2 gap-4 items-center">
        <span className="text-sm font-medium">{fee.marhala}</span>
        <NumberInputField
          label=""
          name={`examFeeForBoys.${index}.amount`}
          type="number"
          value={fee.amount}
          onChange={(e) => onFeeChange('Boys', index, e.target.value)}
          error={errors[`examFeeForBoys.${index}.amount`]}
        />
      </div>
    ))}
  </div>
</div>


    <hr className="md:hidden" />
{/* Girls Fee Section */}
<div className="space-y-4 ">
  <h3 className="text-lg font-medium">ছাত্রীদের পরীক্ষার ফি</h3>
  <div className="grid gap-4">
    {formData.examFeeForGirls.map((fee, index) => (
      <div key={fee.marhala} className="grid grid-cols-2 gap-4 items-center">
        <span className="text-sm font-medium">{fee.marhala}</span>
        <NumberInputField
          label=""
          name={`examFeeForGirls.${index}.amount`}
          type="number"
          value={fee.amount}
          onChange={(e) => onFeeChange('Girls', index, e.target.value)}
          error={errors[`examFeeForGirls.${index}.amount`]}
        />
      </div>
    ))}
  </div>
</div>
</div>
    )
};
