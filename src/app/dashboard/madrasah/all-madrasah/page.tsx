'use client';

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

const ITEMS_PER_PAGE = 10;

export default function AllMadrasah() {
  const [madrasahs, setMadrasahs] = useState<IMadrasah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState<Division | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | 'all'>('all');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string | null>(null);
  const [selectedPoliceStation, setSelectedPoliceStation] = useState<string | null>(null);
  const [selectedMadrasahType, setSelectedMadrasahType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printType, setPrintType] = useState<'list' | 'addresses'>('list');
  const [printContent, setPrintContent] = useState('');

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
      const response = await getAllMadrasahs();
      
      // Log raw data for inspection
      console.log('Raw madrasah data:', response.data.map(m => ({
        id: m._id,
        name: m.madrasahNames.bengaliName,
        type: m.madrasah_information?.madrasahType,
        rawInfo: m.madrasah_information
      })));
      
      // Log all madrasah types
      console.log('All madrasah types:', response.data.map(m => ({
        id: m._id,
        name: m.madrasahNames.bengaliName,
        type: m.madrasah_information?.madrasahType
      })));
      
      // Filter madrasahs based on selected filters
      let filteredMadrasahs = response.data;

      if (selectedMadrasahType && selectedMadrasahType !== 'all') {
        console.log('Starting filter with type:', selectedMadrasahType);
        
        filteredMadrasahs = filteredMadrasahs.filter((m) => {
          // Log raw madrasah info for debugging
          console.log('Checking madrasah:', {
            id: m._id,
            name: m.madrasahNames.bengaliName,
            rawType: m.madrasah_information?.madrasahType,
            info: m.madrasah_information,
            isString: typeof m.madrasah_information === 'string'
          });
          
          const type = getMadrasahInfoField(m, 'madrasahType');
          const matches = type === selectedMadrasahType;
          
          console.log('Type comparison:', {
            id: m._id,
            originalType: m.madrasah_information?.madrasahType,
            convertedType: type,
            selectedType: selectedMadrasahType,
            matches
          });
          
          return matches;
        });

        console.log('Filter results:', {
          selectedType: selectedMadrasahType,
          totalMatches: filteredMadrasahs.length,
          matchedMadrasahs: filteredMadrasahs.map(m => ({
            id: m._id,
            name: m.madrasahNames.bengaliName,
            type: m.madrasah_information?.madrasahType,
            convertedType: getMadrasahInfoField(m, 'madrasahType')
          }))
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
      setTotalPages(Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to fetch madrasahs');
      console.error('Error fetching madrasahs:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDivision, selectedDistrict, selectedSubDistrict, selectedPoliceStation, selectedMadrasahType, searchQuery]);

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

  const handlePrint = useCallback((type: 'list' | 'addresses') => {
    console.log('Madrasahs data for print:', madrasahs);
    setPrintType(type);
    setPrintContent(generatePrintContent(madrasahs, type));
    setShowPrintPreview(true);
  }, [madrasahs]);


  return (
    <div className="container mx-auto  py-6 px-2 md:px-4 ">
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
            searchQuery={searchQuery}
            availableDistricts={availableDistricts}
            availableSubDistricts={availableSubDistricts}
            availablePoliceStations={availablePoliceStations}
            onDivisionChange={setSelectedDivision}
            onDistrictChange={setSelectedDistrict}
            onSubDistrictChange={setSelectedSubDistrict}
            onPoliceStationChange={setSelectedPoliceStation}
            onMadrasahTypeChange={setSelectedMadrasahType}
            onSearchQueryChange={setSearchQuery}
          />

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
