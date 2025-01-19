import { ChangeEvent, KeyboardEvent } from 'react';
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchChange(e as any);
    }
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="জোন খুঁজুন..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 text-gray-700"
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
          className="w-64 h-10 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#52B788]/70"
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
