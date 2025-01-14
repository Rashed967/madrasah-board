import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ZoneDistrictProps {
  districts: string[];
  selectedDistricts: string[];
  onAddDistrict: (district: string) => void;
  onRemoveDistrict: (district: string) => void;
}

export default function ZoneDistrict({
  districts,
  selectedDistricts,
  onAddDistrict,
  onRemoveDistrict,
}: ZoneDistrictProps) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        জেলা নির্বাচন করুন
      </label>
      <Select onValueChange={onAddDistrict}>
        <SelectTrigger className='ring-1 ring-[#52B788]/70'>
          <SelectValue placeholder="জেলা নির্বাচন করুন" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((district) => (
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

      {selectedDistricts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">নির্বাচিত জেলাসমূহ:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDistricts.map((district) => (
              <span
                key={district}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#52B788]/80 text-white"
              >
                {district}
                <button
                  type="button"
                  onClick={() => onRemoveDistrict(district)}
                  className="ml-2 text-white hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
