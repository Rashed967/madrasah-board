import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Search } from "lucide-react";
import { Division, District, divisions } from '@/data/divisions';

interface MadrasahListFilterSectionProps {
  selectedDivision: Division | 'all';
  selectedDistrict: District | 'all';
  selectedSubDistrict: string | null;
  selectedPoliceStation: string | null;
  selectedMadrasahType: string;
  searchQuery: string;
  availableDistricts: string[];
  availableSubDistricts: string[];
  availablePoliceStations: string[];
  onDivisionChange: (division: Division | 'all') => void;
  onDistrictChange: (district: District | 'all') => void;
  onSubDistrictChange: (subDistrict: string) => void;
  onPoliceStationChange: (policeStation: string) => void;
  onMadrasahTypeChange: (type: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
}

export function MadrasahListFilterSection({
  selectedDivision,
  selectedDistrict,
  selectedSubDistrict,
  selectedPoliceStation,
  selectedMadrasahType,
  searchQuery,
  availableDistricts,
  availableSubDistricts,
  availablePoliceStations,
  onDivisionChange,
  onDistrictChange,
  onSubDistrictChange,
  onPoliceStationChange,
  onMadrasahTypeChange,
  onSearchQueryChange,
  onSearch,
}: MadrasahListFilterSectionProps) {
  return (
    <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div>
          <Select
            value={selectedDivision}
            onValueChange={(value) => onDivisionChange(value as Division | 'all')}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="সকল বিভাগ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">বিভাগ</SelectItem>
              {Object.keys(divisions).map((division) => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-gray-800">

          <Select
            value={selectedDistrict}
            onValueChange={(value) => onDistrictChange(value as District | 'all')}
            disabled={!selectedDivision || selectedDivision === 'all'}
            
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="সকল জেলা" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">জেলা</SelectItem>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedSubDistrict || undefined}
            onValueChange={onSubDistrictChange}
            disabled={!selectedDistrict || selectedDistrict === 'all'}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="সকল উপজেলা" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">উপজেলা</SelectItem>
              {availableSubDistricts.map((subDistrict) => (
                <SelectItem key={subDistrict} value={subDistrict}>
                  {subDistrict}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedPoliceStation || undefined}
            onValueChange={onPoliceStationChange}
            disabled={!selectedSubDistrict || selectedSubDistrict === 'all'}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="সকল থানা" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">থানা</SelectItem>
              {availablePoliceStations.map((station) => (
                <SelectItem key={station} value={station}>
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedMadrasahType}
            onValueChange={onMadrasahTypeChange}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="সকল ধরণ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ধরণ</SelectItem>
              <SelectItem value="বালক">বালক</SelectItem>
              <SelectItem value="বালিকা">বালিকা</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="px-2">
            <input
              type="text"
              placeholder="মাদরাসার নাম অথবা কোড..."
              className="w-full px-2 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch();
                }
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
