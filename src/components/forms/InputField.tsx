import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }


  
export const InputField = ({ label, name, value, onChange, type = "text" }: InputFieldProps) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    </div>
  );