import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Search, Check, Filter } from "lucide-react";
import { Division, District, divisions } from '@/data/divisions';

interface MadrasahListFilterSectionProps {
  selectedDivisions: string[];
  selectedDistricts: string[];
  selectedSubDistricts: string[];
  selectedPoliceStations: string[];
  selectedMadrasahType: string;
  searchQuery: string;
  searchInput: string;
  availableDistricts: string[];
  availableSubDistricts: string[];
  availablePoliceStations: string[];
  onDivisionsChange: (divisions: string[]) => void;
  onDistrictsChange: (districts: string[]) => void;
  onSubDistrictsChange: (subDistricts: string[]) => void;
  onPoliceStationsChange: (policeStations: string[]) => void;
  onMadrasahTypeChange: (type: string) => void;
  onSearchQueryChange: (query: string) => void;
  onApplyFilters: () => void;
}

export function MadrasahListFilterSection({
  selectedDivisions,
  selectedDistricts,
  selectedSubDistricts,
  selectedPoliceStations,
  selectedMadrasahType,
  searchQuery,
  searchInput,
  availableDistricts,
  availableSubDistricts,
  availablePoliceStations,
  onDivisionsChange,
  onDistrictsChange,
  onSubDistrictsChange,
  onPoliceStationsChange,
  onMadrasahTypeChange,
  onSearchQueryChange,
  onApplyFilters,
}: MadrasahListFilterSectionProps) {
  return (
    <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center items-center">
        <div>
          <Select
            value={selectedDivisions[selectedDivisions.length - 1] || "default"}
            onValueChange={(value) => {
              if (value === "default") {
                onDivisionsChange([]);
                return;
              }
              const newValue = selectedDivisions.includes(value) 
                ? selectedDivisions.filter(d => d !== value)
                : [...selectedDivisions, value];
              onDivisionsChange(newValue);
            }}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="বিভাগ">
                {selectedDivisions[selectedDivisions.length - 1] || "বিভাগ"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="default">বিভাগ</SelectItem>
              {Object.keys(divisions).map((division) => (
                <SelectItem key={division} value={division}>
                  <div className="flex items-center">
                    {selectedDivisions.includes(division) && 
                     division !== selectedDivisions[selectedDivisions.length - 1] && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {division}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedDistricts[selectedDistricts.length - 1] || "default"}
            onValueChange={(value) => {
              if (value === "default") {
                onDistrictsChange([]);
                return;
              }
              const newValue = selectedDistricts.includes(value) 
                ? selectedDistricts.filter(d => d !== value)
                : [...selectedDistricts, value];
              onDistrictsChange(newValue);
            }}
            disabled={selectedDivisions.length === 0}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="জেলা">
                {selectedDistricts[selectedDistricts.length - 1] || "জেলা"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="default">জেলা</SelectItem>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  <div className="flex items-center">
                    {selectedDistricts.includes(district) && 
                     district !== selectedDistricts[selectedDistricts.length - 1] && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {district}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedSubDistricts[selectedSubDistricts.length - 1] || "default"}
            onValueChange={(value) => {
              if (value === "default") {
                onSubDistrictsChange([]);
                return;
              }
              const newValue = selectedSubDistricts.includes(value) 
                ? selectedSubDistricts.filter(d => d !== value)
                : [...selectedSubDistricts, value];
              onSubDistrictsChange(newValue);
            }}
            disabled={selectedDistricts.length === 0}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="উপজেলা">
                {selectedSubDistricts[selectedSubDistricts.length - 1] || "উপজেলা"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="default">উপজেলা</SelectItem>
              {availableSubDistricts.map((subDistrict) => (
                <SelectItem key={subDistrict} value={subDistrict}>
                  <div className="flex items-center">
                    {selectedSubDistricts.includes(subDistrict) && 
                     subDistrict !== selectedSubDistricts[selectedSubDistricts.length - 1] && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {subDistrict}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedPoliceStations[selectedPoliceStations.length - 1] || "default"}
            onValueChange={(value) => {
              if (value === "default") {
                onPoliceStationsChange([]);
                return;
              }
              const newValue = selectedPoliceStations.includes(value) 
                ? selectedPoliceStations.filter(d => d !== value)
                : [...selectedPoliceStations, value];
              onPoliceStationsChange(newValue);
            }}
            disabled={selectedSubDistricts.length === 0}
          >
            <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="থানা">
                {selectedPoliceStations[selectedPoliceStations.length - 1] || "থানা"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="default">থানা</SelectItem>
              {availablePoliceStations.map((policeStation) => (
                <SelectItem key={policeStation} value={policeStation}>
                  <div className="flex items-center">
                    {selectedPoliceStations.includes(policeStation) && 
                     policeStation !== selectedPoliceStations[selectedPoliceStations.length - 1] && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {policeStation}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

            {/* filter by madrasah type */}
        {/* <div>
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
        </div> */}

        <div>
          <div className="px-2">
            <input
              type="text"
              placeholder="মাদরাসার নাম অথবা কোড..."
              className="w-full px-2 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              value={searchInput}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div>
        </div>

        {/* filter button */}

        <div >
        <button
          onClick={onApplyFilters}
          className="bg-[#52B788] text-white px-4 py-2 rounded-md hover:bg-[#40916C] transition-colors duration-200 text-sm flex items-center gap-2"
        >
          <Filter size={16} />
          ফিল্টার করুন
        </button>
      </div>
      </div>
      

    </div>
  );
}
