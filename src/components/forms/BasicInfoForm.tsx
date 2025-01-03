// import {  } from "@/components/ui/input-field";
import { ChangeEvent } from "react";
import { IMadrasah } from "@/features/madrasah/interfaces";
import { InputField } from "./InputField";

interface BasicInfoFormProps {
  madrasahData: Partial<IMadrasah>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: Record<string, string>;
}

export default function BasicInfoForm({ madrasahData, onChange, errors = {} }: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

     
      <div>
        <InputField
          label="মাদ্রাসার নাম (বাংলায়)"
          name="madrasahNames.bengaliName"
          value={madrasahData?.madrasahNames?.bengaliName || ''}
          onChange={onChange}
          error={errors['madrasahNames.bengaliName']}
        />
      </div>

      <div>
        <InputField
          label="মাদ্রাসার নাম (আরবি)"
          name="madrasahNames.arabicName"
          value={madrasahData?.madrasahNames?.arabicName || ''}
          onChange={onChange}
          error={errors['madrasahNames.arabicName']}
        />
      </div>

      <div>
        <InputField
          label="মাদ্রাসার নাম (ইংরেজি)"
          name="madrasahNames.englishName"
          value={madrasahData?.madrasahNames?.englishName || ''}
          onChange={onChange}
          error={errors['madrasahNames.englishName']}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগকারীর নাম"
          name="communicatorName"
          value={madrasahData?.communicatorName || ''}
          onChange={onChange}
          error={errors['communicatorName']}
        />
      </div>

      <div>
        <InputField
          label="ইমেইল"
          name="email"
          value={madrasahData?.email || ''}
          onChange={onChange}
          error={errors['email']}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগ নম্বর ১"
          name="contactNo1"
          value={madrasahData?.contactNo1 || ''}
          onChange={onChange}
          error={errors['contactNo1']}
        />
      </div>

      <div>
        <InputField
          label="যোগাযোগ নম্বর ২"
          name="contactNo2"
          value={madrasahData?.contactNo2 || ''}
          onChange={onChange}
          error={errors['contactNo2']}
        />
      </div>

      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          বিবরণ
        </label>
        <textarea
          name="description"
          value={madrasahData?.description || ''}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md border ${
            errors['description'] ? 'border-red-500' : 'border-[#52B788]'
          } shadow-sm focus:border-[#52B788] ring-1 focus:ring-[#52B788] sm:text-sm h-20 px-3 py-2`}
          placeholder="বিবরণ লিখুন"
        />
        {errors['description'] && (
          <p className="mt-1 text-sm text-red-500">{errors['description']}</p>
        )}
      </div>
    </div>
  );
}
