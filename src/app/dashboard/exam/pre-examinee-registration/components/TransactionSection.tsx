import React from 'react';
import { SelectField } from '@/components/ui/select';
import TextInputField from '@/components/forms/textInputField';

interface TransactionSectionProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const TransactionSection: React.FC<TransactionSectionProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <SelectField
          label="পেমেন্ট মেথড নির্বাচন করুন"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={onChange}
          error={errors.paymentMethod}
          options={[
            { value: "", label: "পেমেন্ট মেথড নির্বাচন করুন" },
            { value: "bkash", label: "বিকাশ" },
            { value: "nagad", label: "নগদ" },
            { value: "rocket", label: "রকেট" }
          ]}
        /> */}

        {/* <TextInputField
          label="ট্রানজেকশন আইডি"
          name="transactionId"
          value={formData.transactionId}
          onChange={onChange}
          error={errors.transactionId}
        /> */}
      </div>
    </div>
  );
};

export default TransactionSection;
