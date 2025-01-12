// Registration information section component

import NumberInputField from "@/components/forms/NumberInputField";

interface RegistrationInformationSectionProps {
    formData: any;
    errors: any;
    onChange: any;
}

export default function RegistrationInformationSection({ formData, onChange, errors }: RegistrationInformationSectionProps) {     

return ( 
<div className="space-y-4"> 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberInputField
               label="রেজিস্ট্রেশন শুরুর নম্বর"
               name="registrationStartNumber"
               type="number"
               value={formData.registrationStartNumber}
               onChange={onChange}
               error={errors.registrationStartNumber}
             />

             <NumberInputField
               label="প্রি-রেজিস্ট্রেশন ফি"
               name="preRegistrationFee"
               type="number"
               value={formData.preRegistrationFee || 0}
               onChange={onChange}
               error={errors.preRegistrationFee}
             />
            </div>
</div>
)}