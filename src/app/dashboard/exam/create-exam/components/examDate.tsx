// exam date component

import { InputField } from "@/components/forms/InputField";
import IExam from "@/features/exam/exam.interface";

interface ExamNameProps {
        formData: IExam;
        name: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement >) => void;
        error: string;
        label: string;
        type: string;
    }

export default function ExamDate({
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