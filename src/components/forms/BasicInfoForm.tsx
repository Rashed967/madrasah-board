import { MadrasahData } from '@/types/madrasah';
import { ChangeEvent, FormEvent } from 'react';
import { InputField } from './InputField';


interface BasicInfoFormProps {
  data: MadrasahData;
  onChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
}

// <InputField
// label="হোল্ডিং নম্বর"
// name="address.holdingNumber"
// value={address.holdingNumber || ''}
// onChange={onChange}
// />


export default function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {/* <label className="block text-sm font-medium text-gray-700">
          মাদ্রাসার নাম (বাংলায়)
        </label> */}
        <InputField
          label="মাদ্রাসার নাম (বাংলায়)"
          name="madrasahNames.bengaliName"
          value={data.madrasahNames.bengaliName}
          onChange={onChange}
        />
      </div>

      <div>

        <InputField
          label="মাদ্রাসার নাম (আরবি)"
          name="madrasahNames.arabicName"
          value={data.madrasahNames.arabicName}
          onChange={onChange}
        />
      </div>

      <div>

        <InputField
          label="মাদ্রাসার নাম (ইংরেজি)"
          name="madrasahNames.englishName"
          value={data.madrasahNames.englishName}
          onChange={onChange}
        />
      </div>

      <div>

        <InputField
          label="যোগাযোগকারীর নাম"
          name="communicatorName"
          value={data.communicatorName}
          onChange={onChange}
        />
      </div>

      <div>

        <InputField
          label="ইমেইল"
          name="email"
          value={data.email}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগ নম্বর ১"
          name="contactNo1"
          value={data.contactNo1}
          onChange={onChange}
        />
      </div>

      <div>

        <InputField
          label="যোগাযোগ নম্বর ২"
          name="contactNo2"
          value={data.contactNo2}
          onChange={onChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          বিবরণ
        </label>
        <textarea
          name="description"
          value={data.description}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-[#52B788] shadow-sm focus:border-[#52B788] ring-1 focus:ring-[#52B788] sm:text-sm h-20 px-3 py-2"
          placeholder="বিবরণ লিখুন"
        />
      </div>
    </form>
  );
}
