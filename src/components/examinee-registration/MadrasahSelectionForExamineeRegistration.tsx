import { IoSearch } from "react-icons/io5"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import axios from "axios"

interface MadrasahNames {
  bengaliName: string;
  arabicName: string;
  englishName: string;
  _id: string;
  id: string;
}

interface MadrasahAddress {
  _id: string;
  division: string;
  district: string;
  subDistrict_policeStation: string;
  postOffice: string;
  village: string;
  holdingNumber: string;
  id: string;
}

interface MadrasahInformation {
  _id: string;
  madrasahType: string;
  totalStudents: number;
  totalTeacherAndStuff: number;
  id: string;
}

interface Madrasah {
  _id: string;
  madrasahNames: MadrasahNames;
  code: string;
  email: string;
  communicatorName: string;
  contactNo1: string;
  contactNo2: string;
  address: MadrasahAddress;
  madrasah_information: MadrasahInformation;
  id: string;
}

interface MadrasahResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Madrasah[];
}

interface MadrasahSelectionForExamineeRegistrationProps {
  onMadrasahSelect?: (madrasah: Madrasah) => void;
}

const MadrasahSelectionForExamineeRegistration = ({ 
  onMadrasahSelect 
}: MadrasahSelectionForExamineeRegistrationProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [madrasahs, setMadrasahs] = useState<Madrasah[]>([]);
  const [selectedMadrasah, setSelectedMadrasah] = useState<Madrasah | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (term: string) => {
    if (!term.trim() || term.length < 3) {
      setMadrasahs([]);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get<MadrasahResponse>(
        `${process.env.NEXT_PUBLIC_MAIN_URL}/madrasah?limit=10&searchTerm=${term}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        }
      );

      if (response.data && response.data.success && response.data.data) {
        setMadrasahs(response.data.data);
        if (response.data.data.length === 0) {
          setError("কোন মাদ্রাসা পাওয়া যায়নি");
        }
        setShowSuggestions(true);
      } else {
        setError("মাদ্রাসার তথ্য পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Error searching madrasahs:", err);
      setError("মাদ্রাসা খুঁজতে সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If a madrasah is selected and user starts typing, clear the selection
    if (selectedMadrasah) {
      setSelectedMadrasah(null);
      if (onMadrasahSelect) {
        onMadrasahSelect(null);
      }
    }
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500); // 500ms debounce
  };

  const handleMadrasahSelect = (madrasah: Madrasah) => {
    setSelectedMadrasah(madrasah);
    setSearchTerm(`${madrasah.madrasahNames.bengaliName} (${madrasah.code})`);
    setShowSuggestions(false);
    if (onMadrasahSelect) {
      onMadrasahSelect(madrasah);
    }
  };

  const clearSelection = () => {
    setSelectedMadrasah(null);
    setSearchTerm("");
    if (onMadrasahSelect) {
      onMadrasahSelect(null);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-2 relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="মাদ্রাসার কোড বা নাম লিখুন (কমপক্ষে ৩টি অক্ষর)"
            className="w-full pr-8"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              if (madrasahs.length > 0 && !selectedMadrasah) {
                setShowSuggestions(true);
              }
            }}
          />
          {selectedMadrasah && (
            <button 
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={clearSelection}
            >
              ✕
            </button>
          )}
        </div>
        <Button
          type="button"
          className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
          onClick={() => handleSearch(searchTerm)}
          disabled={isLoading}
        >
          <IoSearch className="h-5 w-5" />
        </Button>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {/* Suggestions Dropdown */}
      {showSuggestions && madrasahs.length > 0 && !selectedMadrasah && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {madrasahs.map((madrasah) => (
            <div
              key={madrasah._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMadrasahSelect(madrasah)}
            >
              <div className="font-medium">{madrasah.madrasahNames.bengaliName}</div>
              <div className="text-sm text-gray-600">কোড: {madrasah.code}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MadrasahSelectionForExamineeRegistration;
