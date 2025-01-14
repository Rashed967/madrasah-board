import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
}

export const InputField = ({ label, name, value, onChange, type = "text", error }: InputFieldProps) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            className={error ? "border-red-500 text-gray-800" : "text-gray-800"}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
);