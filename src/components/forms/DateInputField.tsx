// exam date component

import { InputField } from "@/components/forms/InputField";
import IExam from "@/features/exam/exam.interface";


export default function DateInputField({
    formData,
    label,
    name,
    onChange,
    error,
    type,
}){
    return (
        <InputField
        label={label}
        name={name}
        type={type}
        value={formData[name as keyof IExam]}
        onChange={onChange}
        error={error}
      />
    )
}