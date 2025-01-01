// import {  } from "@/components/ui/input-field";
import { ChangeEvent, FormEvent } from "react";
import { IMadrasah } from "@/types/global/madrasah.types";
import { InputField } from "./InputField";

interface BasicInfoFormProps {
  madrasahData: Partial<IMadrasah>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function BasicInfoForm({ madrasahData, onChange }: BasicInfoFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  console.log('BasicInfoForm data:', madrasahData);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <InputField
          label="মাদ্রাসার নাম (বাংলায়)"
          name="madrasahNames.bengaliName"
          value={madrasahData?.madrasahNames?.bengaliName || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="মাদ্রাসার নাম (আরবি)"
          name="madrasahNames.arabicName"
          value={madrasahData?.madrasahNames?.arabicName || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="মাদ্রাসার নাম (ইংরেজি)"
          name="madrasahNames.englishName"
          value={madrasahData?.madrasahNames?.englishName || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগকারীর নাম"
          name="communicatorName"
          value={madrasahData?.communicatorName || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="ইমেইল"
          name="email"
          value={madrasahData?.email || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগ নম্বর ১"
          name="contactNo1"
          value={madrasahData?.contactNo1 || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগ নম্বর ২"
          name="contactNo2"
          value={madrasahData?.contactNo2 || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          বিবরণ
        </label>
        <textarea
          name="description"
          value={madrasahData?.description || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border border-[#52B788] shadow-sm focus:border-[#52B788] ring-1 focus:ring-[#52B788] sm:text-sm h-20 px-3 py-2"
          placeholder="বিবরণ লিখুন"
        />
      </div>
    </form>
  );
}
