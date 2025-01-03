import {  SelectField } from "@/components/ui/select";
import { InputField } from "./InputField";
import { divisions, districts, upazilas, policeStations } from '@/data/locations';
import { IMadrasahAddress } from "@/features/madrasah/interfaces";



interface AddressFormProps {
  address: IMadrasahAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}


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
