// exam fee for boys component

import NumberInputField from "@/components/forms/NumberInputField";

export default function ExamFees({ 
    formData, 
    errors, 
    handleFeeChange,
    label,
    name,
    value,

}) {
    return (
        <div className="space-y-4 ">
        <h3 className="text-lg font-medium">ছাত্রদের পরীক্ষার ফি</h3>
        <div className="grid gap-4">
          {formData.examFeeForBoys.map((fee, index) => (
            <div key={fee.marhala} className="grid grid-cols-2 gap-4 items-center">
              <span className="text-sm font-medium">{fee.marhala}</span>
              <NumberInputField
                label={label}
                name={name}
                type="number"
                value={value}
                onChange={(e) => handleFeeChange('Boys', index, e.target.value)}
                error={errors[name]}
              />
            </div>
          ))}
        </div>
      </div>
    )
}