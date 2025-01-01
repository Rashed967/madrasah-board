import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { divisions, districts, upazilas, policeStations } from '@/data/locations';
import { MadrasahAddress } from "@/types/address";

interface AddressFormProps {
  address: MadrasahAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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

export const AddressForm = ({ address, onChange }: AddressFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SelectField
        label="বিভাগ"
        name="address.division"
        value={address.division || ''}
        onChange={onChange}
        options={divisions}
      />
      <SelectField
        label="জেলা"
        name="address.district"
        value={address.district || ''}
        onChange={onChange}
        options={districts[address.division || ''] || []}
      />
      <SelectField
        label="উপজেলা"
        name="address.subDistrict"
        value={address.subDistrict || ''}
        onChange={onChange}
        options={upazilas[address.district || ''] || []}
      />
      <SelectField
        label="থানা"
        name="address.policeStation"
        value={address.policeStation || ''}
        onChange={onChange}
        options={policeStations[address.subDistrict || ''] || []}
      />
      <InputField
        label="গ্রাম/মহল্লা"
        name="address.village"
        value={address.village || ''}
        onChange={onChange}
      />
      <InputField
        label="হোল্ডিং নম্বর"
        name="address.holdingNumber"
        value={address.holdingNumber || ''}
        onChange={onChange}
      />
    </div>
  );
};
