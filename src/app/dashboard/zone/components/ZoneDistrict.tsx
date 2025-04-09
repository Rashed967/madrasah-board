import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface ZoneDistrictProps {
  districts: string[]
  selectedDistricts: string[]
  allDisallowedDistricts: string[]
  onAddDistrict: (district: string) => void
  onRemoveDistrict: (district: string) => void
}


export default function ZoneDistrict({
  districts,
  selectedDistricts,
  allDisallowedDistricts,
  onAddDistrict,
  onRemoveDistrict
}: ZoneDistrictProps) {
  // Filter out districts that are already selected in other zones
  const availableDistricts = districts.filter(
    district => !allDisallowedDistricts.includes(district)
  )
  console.log(availableDistricts.length, allDisallowedDistricts.length, selectedDistricts.length)

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        জেলা নির্বাচন করুন
      </label>

      <Select onValueChange={onAddDistrict}>
        <SelectTrigger className="ring-1 ring-[#52B788]/70">
          <SelectValue placeholder="জেলা নির্বাচন করুন" />
        </SelectTrigger>
        <SelectContent className='max-h-[150px] overflow-y-auto'>
          {availableDistricts.map((district) => (
            <SelectItem
              key={district}
              value={district}
              disabled={selectedDistricts.includes(district)}
            >
              {district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-4 flex flex-wrap gap-2">
        {selectedDistricts.map((district) => (
          <Badge
            key={district}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onRemoveDistrict(district)}
          >
            {district} ✕
          </Badge>
        ))}
      </div>
    </div>
  )
}
