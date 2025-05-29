import { SelectField } from '@/components/ui/select'
import { InputField } from './InputField'
import {
  divisions,
  districts,
  upazilas,
  policeStations
} from '@/data/locations'
import { IMadrasahAddress } from '@/features/madrasah/interfaces'
import courierAddressOptions from '@/data/courierAddress.options'
import { useGetZones } from '@/hooks/useGetZones'

// Helper function to convert string array to options format
const toOptions = (arr: string[]) =>
  arr.map((item) => ({ value: item, label: item }))

interface AddressFormProps {
  address: IMadrasahAddress
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const AddressForm = ({ address, onChange }: AddressFormProps) => {
  const { zones, loading } = useGetZones()
  
  const zoneOptions = zones.map(zone => ({
    value: zone._id,
    label: zone.name
  }))

  console.log(address)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 md:mt-4">
      <SelectField
        label="জোন"
        name="address.zone"
        value={address.zone || ''}
        onChange={onChange}
        options={zoneOptions}
      />

      <SelectField
        label="বিভাগ"
        name="address.division"
        value={address.division || ''}
        onChange={onChange}
        options={toOptions(divisions)}
      />

      <SelectField
        label="জেলা"
        name="address.district"
        value={address.district || ''}
        onChange={onChange}
        options={toOptions(districts[address.division || ''] || [])}
      />
      <SelectField
        label="উপজেলা/থানা"
        name="address.subDistrict_policeStation"
        value={address.subDistrict_policeStation || ''}
        onChange={onChange}
        options={toOptions(upazilas[address.district || ''] || [])}
      />
      <InputField
        label="পোস্ট অফিস"
        name="address.postOffice"
        value={address.postOffice || ''}
        onChange={onChange}
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

      <SelectField
        label="কুরিয়ার উপজেলা"
        name="address.courierAddress"
        value={address.courierAddress || ''}
        onChange={onChange}
        options={toOptions(courierAddressOptions)}
      />
    </div>
  )
}
