'use client';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/pagination';
import { getSubDistricts, getPoliceStations } from '@/services/locationService';
import { getAllMadrasahs } from '@/services/madrasahService';

import { generatePrintContent } from "@/utils/printUtils";
import { divisions, Division, District } from '@/data/divisions';
import { IMadrasah } from '@/features/madrasah/interfaces';

import { MadrasahListHeaderSection } from './components/MadrasahListHeaderSection';
import { MadrasahListFilterSection } from './components/MadrasahListFilterSection';
import { MadrasahListTableSection } from './components/MadrasahListTableSection';
import { MadrasahPrintPreview } from './components/MadrasahPrintPreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_PER_PAGE = 10;

export default function AllMadrasah() {
  const [madrasahs, setMadrasahs] = useState<IMadrasah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [selectedDivision, setSelectedDivision] = useState<Division | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | 'all'>('all');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string | null>(null);
  const [selectedPoliceStation, setSelectedPoliceStation] = useState<string | null>(null);
  const [selectedMadrasahType, setSelectedMadrasahType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printType, setPrintType] = useState<'list' | 'addresses'>('list');
  const [printContent, setPrintContent] = useState('');
  const [limitPerPage, setLimitPerPage] = useState(ITEMS_PER_PAGE);

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableSubDistricts, setAvailableSubDistricts] = useState<string[]>([]);
  const [availablePoliceStations, setAvailablePoliceStations] = useState<string[]>([]);

  const getAddressField = (madrasah: IMadrasah, field: string): string => {
    if (typeof madrasah.address === 'string') return '-';
    return madrasah.address[field] || '-';
  };

  const getMadrasahInfoField = (madrasah: IMadrasah, field: string): string | number => {
    if (typeof madrasah.madrasah_information === 'string') return '-';
    if (field === 'muhtamimName') {
      return typeof madrasah.muhtamim === 'string' ? '-' : madrasah.muhtamim?.name || '-';
    }
    return madrasah.madrasah_information[field] || '-';
  };

  const fetchMadrasahs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMadrasahs(currentPage, limitPerPage);
      console.log(response)

      // Filter madrasahs based on selected filters
      let filteredMadrasahs = response.data;

      if (selectedMadrasahType && selectedMadrasahType !== 'all') {
        
        filteredMadrasahs = filteredMadrasahs.filter((m) => {
          
          const type = getMadrasahInfoField(m, 'madrasahType');
          const matches = type === selectedMadrasahType;

          return matches;
        });

      }

      if (selectedDivision && selectedDivision !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => getAddressField(m, 'division') === selectedDivision
        );
      }

      if (selectedDistrict && selectedDistrict !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => getAddressField(m, 'district') === selectedDistrict
        );
      }

      if (selectedSubDistrict && selectedSubDistrict !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => getAddressField(m, 'subDistrict') === selectedSubDistrict
        );
      }

      if (selectedPoliceStation && selectedPoliceStation !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => getAddressField(m, 'policeStation') === selectedPoliceStation
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) =>
            m.madrasahNames.bengaliName.toLowerCase().includes(query) ||
            m.code.toLowerCase().includes(query)
        );
      }

      setMadrasahs(filteredMadrasahs);
      setTotalPages(Math.ceil(response.meta.total / limitPerPage));
      setTotalDocuments(response.meta.total);
    } catch (err) {
      setError('মাদরাসার তালিকা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  }, [selectedDivision, selectedDistrict, selectedSubDistrict, selectedPoliceStation, selectedMadrasahType, searchQuery,limitPerPage, currentPage]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMadrasahs();
  }, [fetchMadrasahs]);

  // Update districts when division changes
  useEffect(() => {
    if (selectedDivision && selectedDivision !== "all") {
      setAvailableDistricts(Object.keys(divisions[selectedDivision]));
      setSelectedDistrict("all");
      setSelectedSubDistrict("all");
      setSelectedPoliceStation("all");
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedDivision]);

  // Update subdistricts when district changes
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all") {
      setAvailableSubDistricts(getSubDistricts(selectedDistrict));
      setSelectedSubDistrict("all");
      setSelectedPoliceStation("all");
    } else {
      setAvailableSubDistricts([]);
    }
  }, [selectedDistrict]);

  // Update police stations when subdistrict changes
  useEffect(() => {
    if (selectedDistrict && selectedSubDistrict && selectedSubDistrict !== "all") {
      setAvailablePoliceStations(getPoliceStations(selectedDistrict, selectedSubDistrict));
      setSelectedPoliceStation("all");
    } else {
      setAvailablePoliceStations([]);
    }
  }, [selectedDistrict, selectedSubDistrict]);

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই মাদরাসাটি মুছে ফেলতে চান?")) {
      try {
        // Implement delete functionality
        toast.success("মাদরাসা সফলভাবে মুছে ফেলা হয়েছে");
        fetchMadrasahs();
      } catch (error) {
        toast.error("মাদরাসা মুছে ফেলতে সমস্যা হয়েছে");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setLimitPerPage(limit);
    console.log(limit)
  };

  const handlePrint = useCallback((type: 'list' | 'addresses') => {
    setPrintType(type);
    setPrintContent(generatePrintContent(madrasahs, type));
    setShowPrintPreview(true);
  }, [madrasahs]);


  return (
    <div className=" mx-auto  py-6 px-2 md:px-4 ">
      {!showPrintPreview ? (
        <div>
          <MadrasahListHeaderSection 
            onPrintList={() => handlePrint('list')}
            onPrintAddresses={() => handlePrint('addresses')}
          />

          <MadrasahListFilterSection
            selectedDivision={selectedDivision}
            selectedDistrict={selectedDistrict}
            selectedSubDistrict={selectedSubDistrict}
            selectedPoliceStation={selectedPoliceStation}
            selectedMadrasahType={selectedMadrasahType}
            searchQuery={searchInput}
            availableDistricts={availableDistricts}
            availableSubDistricts={availableSubDistricts}
            availablePoliceStations={availablePoliceStations}
            onDivisionChange={setSelectedDivision}
            onDistrictChange={setSelectedDistrict}
            onSubDistrictChange={setSelectedSubDistrict}
            onPoliceStationChange={setSelectedPoliceStation}
            onMadrasahTypeChange={setSelectedMadrasahType}
            onSearchQueryChange={(value) => {
              setSearchInput(value);
              if (value === '') setSearchQuery('');
            }}
            onSearch={() => setSearchQuery(searchInput)}
          />

          {/* Pagination info and limit selector */}
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">
              ডাটাবেজে মাদরাসার সংখ্যা: {totalDocuments.toLocaleString('bn-BD')}
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor="limitSelect" className='text-sm text-gray-600'>প্রতি পেজে দেখানো হবে:</label>
              <select 
                id="limitSelect"
                className="bg-white px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:ring-offset-0 text-sm" 
                value={limitPerPage}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              >
                {[10, 20, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700].map((limit) => (
                  <option key={limit} value={limit}>{limit}</option>
                ))}
              </select>
            </div>
          </div>

          <MadrasahListTableSection
            madrasahs={madrasahs}
            onDelete={handleDelete}
            getAddressField={getAddressField}
            getMadrasahInfoField={getMadrasahInfoField}
            isLoading={loading}
            isError={error}
            onRetry={fetchMadrasahs}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <MadrasahPrintPreview
          printContent={printContent}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </div>
  );
}
