import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface MadrasahSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults: any[];
  showDropdown: boolean;
  onMadrasahSelect: (madrasah: any) => void;
}

const MadrasahSearch = memo(({ 
  searchTerm, 
  onSearchChange, 
  searchResults, 
  showDropdown, 
  onMadrasahSelect 
}: MadrasahSearchProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      onSearchChange(e as any);
    }
  };

  return (
    <div className="relative">
      <Label>মাদ্রাসা অনুসন্ধান</Label>
      <div className="flex gap-2">
        <Input 
          placeholder="মাদ্রাসার নাম অথবা কোড"
          className="flex-1 text-xs"
          value={searchTerm}
          onChange={(e) => onSearchChange(e)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-10 w-1/3 mt-1 bg-white border rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {searchResults.map((madrasah: any) => (
              <li
                key={madrasah._id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => onMadrasahSelect(madrasah)}
              >
                <div>{madrasah.name}</div>
                <div className="text-xs text-gray-500">{madrasah.madrasahNames.bengaliName}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

MadrasahSearch.displayName = 'MadrasahSearch';

export default MadrasahSearch;
