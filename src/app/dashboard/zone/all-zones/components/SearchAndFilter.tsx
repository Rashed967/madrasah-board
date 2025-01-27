import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedZoneName: string;
  onZoneNameChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  zoneNames: string[];
}

export const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedZoneName,
  onZoneNameChange,
  zoneNames
}: SearchAndFilterProps) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="জোন খুঁজুন..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
        </div>
      </div>
      <div className="flex-1">
        <select
          value={selectedZoneName}
          onChange={onZoneNameChange}
          className="w-64 h-10 rounded-md border border-gray-300 px-4 py-2 text-sm"
        >
          <option value="">সব জোন</option>
          {zoneNames.map((zoneName) => (
            <option key={zoneName} value={zoneName}>
              {zoneName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
