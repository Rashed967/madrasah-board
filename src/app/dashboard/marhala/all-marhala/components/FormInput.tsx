import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormInputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required = false
}: FormInputProps) {
  return (
    <div>
      <Label>{label} {required && '*'}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
} 