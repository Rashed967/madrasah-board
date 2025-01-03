import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = ""
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#52b788]"
        placeholder={placeholder}
      />
    </div>
  );
}


  interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options: string[];
  }

  const SelectField = ({ label, name, value, onChange, options }: SelectFieldProps) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select 
        value={value} 
        onValueChange={(newValue) => 
          onChange({ 
            target: { 
              name, 
              value: newValue 
            } 
          } as React.ChangeEvent<HTMLSelectElement>)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="নির্বাচন করুন" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
