import { IMadrasah } from '@/features/madrasah/interfaces'
import { InputField } from '@/components/forms/InputField'
import PdfUpload from '@/app/dashboard/madrasah/register-madrasah/components/ImageUpload'
import { Textarea } from '@/components/ui/textarea'
import { FaFilePdf } from 'react-icons/fa'
import { IoEyeOutline } from 'react-icons/io5'

interface BasicInformationSectionProps {
  formData: IMadrasah
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  errors: Record<string, string>
}

export function BasicInformationSection({
  formData,
  onChange,
  onSubmit,
  errors
}: BasicInformationSectionProps) {
  const handlePdfChange = (field: string, value: string) => {
    const event = {
      target: {
        name: field,
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>
    onChange(event)
  }

  console.log(formData)

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h5 className="text-base font-semibold mb-2 mt-2 md:mt-4">
        মৌলিক তথ্য
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="বাংলা নাম"
          name="madrasahNames.bengaliName"
          value={formData.madrasahNames?.bengaliName || ''}
          onChange={onChange}
          error={errors['madrasahNames.bengaliName']}
        />

        <InputField
          label="ইংরেজি নাম"
          name="madrasahNames.englishName"
          value={formData.madrasahNames?.englishName || ''}
          onChange={onChange}
          error={errors['madrasahNames.englishName']}
        />

        <InputField
          label="আরবি নাম"
          name="madrasahNames.arabicName"
          value={formData.madrasahNames?.arabicName || ''}
          onChange={onChange}
          error={errors['madrasahNames.arabicName']}
        />

        <InputField
          label="ইমেইল"
          name="email"
          value={formData.email || ''}
          onChange={onChange}
          error={errors.email}
        />

        <InputField
          label="যোগাযোগকারীর নাম"
          name="communicatorName"
          value={formData.communicatorName || ''}
          onChange={onChange}
          error={errors.communicatorName}
        />

        <InputField
          label="যোগাযোগের নম্বর ১"
          name="contactNo1"
          value={formData.contactNo1 || ''}
          onChange={onChange}
          error={errors.contactNo1}
        />

        <InputField
          label="যোগাযোগের নম্বর ২"
          name="contactNo2"
          value={formData.contactNo2 || ''}
          onChange={onChange}
          error={errors.contactNo2}
        />
      </div>

      <Textarea
        label="বিবরণ"
        name="description"
        value={formData.description || ''}
        onChange={onChange}
        error={errors.description}
      />

      <div className="mt-6">
        <h6 className="text-base font-semibold mb-4">ইলহাক ফর্ম </h6>
        {formData.ilhakPdf && (
          <div className="mb-4 max-w-sm">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <FaFilePdf className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-900">ইলহাক পিডিএফ</h6>
                  </div>
                </div>
                <a
                  href={formData.ilhakPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#52b788] bg-[#52b788]/10 rounded-md hover:bg-[#52b788]/20 transition-colors duration-200"
                >
                  <IoEyeOutline className="w-4 h-4" />
                  দেখুন
                </a>
              </div>
            </div>
          </div>
        )}
        <PdfUpload
          label="নতুন ইলহাক পিডিএফ আপলোড করুন"
          value={formData.ilhakPdf || ''}
          onChange={handlePdfChange}
          fieldName="ilhakPdf"
          onPdfUpload={(url) => handlePdfChange('ilhakPdf', url)}
          error={errors.ilhakPdf}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-[#52b788] text-white text-xs md:text-sm rounded-md hover:bg-[#52b788]/90 transition-colors duration-200"
        >
          আপডেট করুন
        </button>
      </div>
    </form>
  )
}
