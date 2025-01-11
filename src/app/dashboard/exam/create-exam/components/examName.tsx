// exam name component

import { InputField } from "@/components/forms/InputField";
import IExam from "@/features/exam/exam.interface";

interface ExamNameProps {
        formData: IExam;
        name: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement >) => void;
        error: string;
        label: string;
    }

export default function ExamName({
    formData,
    label,
    name,
    onChange,
    error,
}){
    return (
        <InputField
        label={label}
        name={name}
        value={formData[name as keyof IExam]}
        onChange={onChange}
        error={error}
      />
    )
}