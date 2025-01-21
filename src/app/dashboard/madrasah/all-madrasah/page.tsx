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
import { getAllMadrasahs, deleteMadrasah } from '@/services/madrasahService';
import { StatusDialog } from '@/components/ui/status-dialog';

import { generatePrintContent } from "@/utils/printUtils";
import { divisions, Division, District } from '@/data/divisions';
import { getDistricts } from '@/data/locations';
import { IMadrasah } from '@/features/madrasah/interfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { MadrasahListFilterSection } from './components/MadrasahListFilterSection';
import { MadrasahListHeaderSection } from './components/MadrasahListHeaderSection';
import { MadrasahListTableSection } from './components/MadrasahListTableSection';
import { MadrasahPrintPreview } from './components/MadrasahPrintPreview';

const ITEMS_PER_PAGE = 10;

export default function AllMadrasah() {
  const [madrasahs, setMadrasahs] = useState<IMadrasah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedSubDistricts, setSelectedSubDistricts] = useState<string[]>([]);
  const [selectedPoliceStations, setSelectedPoliceStations] = useState<string[]>([]);
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMadrasah, setSelectedMadrasah] = useState<IMadrasah | null>(null);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

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
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(currentPage));
      queryParams.append('limit', String(limitPerPage));

      if (selectedDivisions.length > 0) {
        queryParams.append('divisions', selectedDivisions.join(','));
      }
      if (selectedDistricts.length > 0) {
        queryParams.append('districts', selectedDistricts.join(','));
      }
      if (selectedSubDistricts.length > 0) {
        queryParams.append('subDistricts', selectedSubDistricts.join(','));
      }
      if (selectedPoliceStations.length > 0) {
        queryParams.append('policeStations', selectedPoliceStations.join(','));
      }
      if (selectedMadrasahType !== 'all') {
        queryParams.append('madrasahType', selectedMadrasahType);
      }
      if (searchQuery) {
        queryParams.append('searchTerm', searchQuery);
      }

      const response = await getAllMadrasahs(queryParams.toString());
      console.log('Filtered Response:', {
        data: response.data.length,
        meta: response.meta,
        calculatedTotalPages: Math.ceil(response.meta.total / limitPerPage),
        filters: {
          divisions: selectedDivisions,
          districts: selectedDistricts,
          subDistricts: selectedSubDistricts,
          policeStations: selectedPoliceStations,
          madrasahType: selectedMadrasahType,
          searchQuery
        }
      });
      setMadrasahs(response.data);
      setTotalPages(Math.ceil(response.meta.total / limitPerPage));
      setTotalDocuments(response.meta.total);
    } catch (err) {
      setError('মাদরাসার তালিকা লোড করতে সমস্যা হয়েছে');
      toast.error('মাদরাসার তথ্য লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  }, [
    selectedDivisions,
    selectedDistricts,
    selectedSubDistricts,
    selectedPoliceStations,
    selectedMadrasahType,
    searchQuery,
    currentPage,
    limitPerPage,
  ]);

  const fetchDistricts = useCallback(async () => {
    if (selectedDivisions.length > 0) {
      try {
        const districts = await Promise.all(
          selectedDivisions.map(division => getDistricts(division))
        );
        const allDistricts = districts.flat();
        setAvailableDistricts([...new Set(allDistricts)] as string[]);
      } catch (error) {
        console.error('Error fetching districts:', error);
        setAvailableDistricts([]);
      }
    } else {
      setAvailableDistricts([]);
      setSelectedDistricts([]);
    }
  }, [selectedDivisions]);

  const fetchSubDistricts = useCallback(async () => {
    if (selectedDistricts.length > 0) {
      try {
        const subDistricts = await Promise.all(
          selectedDistricts.map(district => getSubDistricts(district))
        );
        const allSubDistricts = subDistricts.flat();
        setAvailableSubDistricts([...new Set(allSubDistricts)]);
      } catch (error) {
        console.error('Error fetching sub-districts:', error);
        setAvailableSubDistricts([]);
      }
    } else {
      setAvailableSubDistricts([]);
      setSelectedSubDistricts([]);
    }
  }, [selectedDistricts]);

  const fetchPoliceStations = useCallback(async () => {
    if (selectedSubDistricts.length > 0 && selectedDistricts.length > 0) {
      try {
        const stations = await Promise.all(
          selectedSubDistricts.map(subDistrict => 
            getPoliceStations(selectedDistricts[0], subDistrict)
          )
        );
        const allStations = stations.flat();
        setAvailablePoliceStations([...new Set(allStations)]);
      } catch (error) {
        console.error('Error fetching police stations:', error);
        setAvailablePoliceStations([]);
      }
    } else {
      setAvailablePoliceStations([]);
    }
  }, [selectedSubDistricts, selectedDistricts]);

  const handleDivisionsChange = useCallback((newDivisions: string[]) => {
    const removedDivisions = selectedDivisions.filter(d => !newDivisions.includes(d));
    setSelectedDivisions(newDivisions);
    
    // If any divisions were removed, remove their districts from selection
    if (removedDivisions.length > 0) {
      const remainingDistricts = selectedDistricts.filter(district => {
        // Keep only districts that belong to remaining divisions
        const belongsToRemainingDivision = newDivisions.some(division => {
          return divisions[division]?.districts?.some(d => d.name === district);
        });
        return belongsToRemainingDivision;
      });
      setSelectedDistricts(remainingDistricts);
    }
  }, [selectedDivisions, selectedDistricts, divisions]);

  const handleDistrictsChange = useCallback((newDistricts: string[]) => {
    const removedDistricts = selectedDistricts.filter(d => !newDistricts.includes(d));
    setSelectedDistricts(newDistricts);
    
    // If any districts were removed, remove their subdistricts from selection
    if (removedDistricts.length > 0) {
      const remainingSubDistricts = selectedSubDistricts.filter(subDistrict => {
        return newDistricts.length > 0; // Keep subdistricts only if there are selected districts
      });
      setSelectedSubDistricts(remainingSubDistricts);
    }
  }, [selectedDistricts, selectedSubDistricts]);

  const handleSubDistrictsChange = useCallback((newSubDistricts: string[]) => {
    const removedSubDistricts = selectedSubDistricts.filter(d => !newSubDistricts.includes(d));
    setSelectedSubDistricts(newSubDistricts);
    
    // If any subdistricts were removed, remove their police stations from selection
    if (removedSubDistricts.length > 0) {
      const remainingPoliceStations = selectedPoliceStations.filter(station => {
        return newSubDistricts.length > 0; // Keep police stations only if there are selected subdistricts
      });
      setSelectedPoliceStations(remainingPoliceStations);
    }
  }, [selectedSubDistricts, selectedPoliceStations]);

  const handleDelete = async (id: string) => {
    const madrasah = madrasahs.find(m => m._id === id);
    if (!madrasah) return;
    setSelectedMadrasah(madrasah);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMadrasah) return;
    try {
      const response = await deleteMadrasah(selectedMadrasah._id);
      if(response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'মাদরাসা সফলভাবে মুছে ফেলা হয়েছে'
        });
        fetchMadrasahs();
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মাদরাসা মুছে ফেলতে সমস্যা হয়েছে'
        });
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'মাদরাসা মুছে ফেলতে সমস্যা হয়েছে'
      });
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

  const handleFilterSubmit = () => {
    setSearchQuery(searchInput);
    fetchMadrasahs();
    fetchDistricts();
    fetchSubDistricts();
    fetchPoliceStations();
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchMadrasahs();
  }, [currentPage]);

  // Fetch districts when divisions change
  useEffect(() => {
    fetchDistricts();
  }, [selectedDivisions, fetchDistricts]);

  // Fetch sub-districts when districts change
  useEffect(() => {
    fetchSubDistricts();
  }, [selectedDistricts, fetchSubDistricts]);

  // Fetch police stations when sub-districts change
  useEffect(() => {
    fetchPoliceStations();
  }, [selectedSubDistricts, selectedDistricts, fetchPoliceStations]);

  return (
    <div className=" mx-auto  py-6 px-2 md:px-4 ">
      {!showPrintPreview ? (
        <div>
          <MadrasahListHeaderSection 
            onPrintList={() => handlePrint('list')}
            onPrintAddresses={() => handlePrint('addresses')}
          />
          
          {/* Pagination info and limit selector */}
          <div className="mt-4 mb-2 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-700">
              মাদরাসার সংখ্যা: {totalDocuments.toLocaleString('bn-BD')}
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor="limitSelect" className='text-sm text-gray-700'>প্রতি পেজে দেখানো হবে:</label>
              <select 
                id="limitSelect"
                className="bg-white px-3 text-gray-700 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:ring-offset-0 text-sm" 
                value={limitPerPage}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              >
                {[10, 20, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700].map((limit) => (
                  <option key={limit} value={limit}>{limit}</option>
                ))}
              </select>
            </div>
          </div>

          <MadrasahListFilterSection
            selectedDivisions={selectedDivisions}
            selectedDistricts={selectedDistricts}
            selectedSubDistricts={selectedSubDistricts}
            selectedPoliceStations={selectedPoliceStations}
            selectedMadrasahType={selectedMadrasahType}
            searchQuery={searchQuery}
            searchInput={searchInput}
            availableDistricts={availableDistricts}
            availableSubDistricts={availableSubDistricts}
            availablePoliceStations={availablePoliceStations}
            onDivisionsChange={handleDivisionsChange}
            onDistrictsChange={handleDistrictsChange}
            onSubDistrictsChange={handleSubDistrictsChange}
            onPoliceStationsChange={setSelectedPoliceStations}
            onMadrasahTypeChange={setSelectedMadrasahType}
            onSearchQueryChange={(value) => {
              setSearchInput(value);
              setSearchQuery(value);
            }}
            onApplyFilters={handleFilterSubmit}
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
          <AlertDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleConfirmDelete}
            title="মাদরাসা মুছে ফেলার নিশ্চিতকরণ"
            description={selectedMadrasah ? `আপনি কি নিশ্চিত যে আপনি "${selectedMadrasah.madrasahNames.bengaliName}" মাদরাসাটি মুছে ফেলতে চান?` : ''}
          />
          <StatusDialog
            isOpen={statusDialog.isOpen}
            type={statusDialog.type}
            title={statusDialog.title}
            message={statusDialog.message}
            onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
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
