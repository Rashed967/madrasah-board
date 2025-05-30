'use client'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Pagination } from '@/components/ui/pagination'
import { getSubDistricts, getPoliceStations } from '@/services/locationService'
import { getAllMadrasahs, deleteMadrasah } from '@/services/madrasahService'
import { StatusDialog } from '@/components/ui/status-dialog'

import { generatePrintContent, generatePrintHeader } from '@/utils/printUtils'
import { divisions, Division, District } from '@/data/divisions'
import { getDistricts } from '@/data/locations'
import { IMadrasah } from '@/features/madrasah/interfaces'
import PrintHeader from '@/components/print/PrintHeader'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { MadrasahListFilterSection } from './components/MadrasahListFilterSection'
import { MadrasahListHeaderSection } from './components/MadrasahListHeaderSection'
import { MadrasahListTableSection } from './components/MadrasahListTableSection'
import { getAllZones } from '@/features/zone'
import { useReactToPrint } from 'react-to-print'
import { MadrasahPrintPreview } from './components/MadrasahPrintPreview'


const ITEMS_PER_PAGE = 10

interface ZoneOption {
  name: string
  value: string
}

export default function AllMadrasah() {
  const [madrasahs, setMadrasahs] = useState<IMadrasah[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedSubDistricts, setSelectedSubDistricts] = useState<string[]>([])
  const [selectedPoliceStations, setSelectedPoliceStations] = useState<string[]>([])
  const [selectedMadrasahType, setSelectedMadrasahType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [availableSubDistricts, setAvailableSubDistricts] = useState<string[]>([])
  const [availablePoliceStations, setAvailablePoliceStations] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [zones, setZones] = useState<ZoneOption[]>([])
  const [selectedZone, setSelectedZone] = useState('all')
  const [selectedZoneName, setSelectedZoneName] = useState('সকল জোন')
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedMadrasah, setSelectedMadrasah] = useState<IMadrasah | null>(
    null
  )
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [printType, setPrintType] = useState<'list' | 'addresses'>('list')
  const [printContent, setPrintContent] = useState('')



  const handlePrintPreview = useCallback(
    (type: 'list' | 'addresses') => {
      setPrintType(type)
      setPrintContent(generatePrintContent(madrasahs, type, selectedMadrasahType, selectedZoneName))
      setShowPrintPreview(true)
    },
    [madrasahs]
  )

  // handle print

  const getAddressField = (madrasah: IMadrasah, field: string): string => {
    if (typeof madrasah.address === 'string') return '-'
    return madrasah.address[field] && madrasah.address[field]
  }

  const getMadrasahInfoField = (
    madrasah: IMadrasah,
    field: string
  ): string | number => {
    if (typeof madrasah.madrasah_information === 'string') return '-'
    if (field === 'muhtamimName') {
      return typeof madrasah.muhtamim === 'string'
        ? '-'
        : madrasah.muhtamim?.name || '-'
    }
    if (field === 'highestMarhala') {
      const marhala = madrasah.madrasah_information?.highestMarhala
      if (typeof marhala === 'string') return marhala
      if (marhala && typeof marhala === 'object' && 'name' in marhala) {
        return marhala.name.bengaliName
      }
      return '-'
    }
    return madrasah.madrasah_information[field] || '-'
  }

  const fetchMadrasahs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('page', String(currentPage))
      queryParams.append('limit', String(limit))
      queryParams.append('sortBy', 'code')
      queryParams.append('sortOrder', sortOrder)

      if (selectedDivisions.length > 0) {
        queryParams.append('divisions', selectedDivisions.join(','))
      }
      if (selectedDistricts.length > 0) {
        queryParams.append('districts', selectedDistricts.join(','))
      }
      if (selectedSubDistricts.length > 0) {
        queryParams.append('subDistricts', selectedSubDistricts.join(','))
      }
      if (selectedPoliceStations.length > 0) {
        queryParams.append('policeStations', selectedPoliceStations.join(','))
      }
      if (selectedMadrasahType && selectedMadrasahType !== 'all') {
        queryParams.append('madrasahType', selectedMadrasahType)
      }
      if (searchQuery) {
        queryParams.append('searchTerm', searchQuery)
      }
      if (selectedZone !== 'all') {
        queryParams.append('zone', selectedZone)
      }

      console.log('Fetching page:', currentPage, 'with params:', queryParams.toString())
      const response = await getAllMadrasahs(queryParams.toString())
      
      if (response.data) {
        // Clear existing data and set new data
        setMadrasahs([])
        setMadrasahs(response.data)
        setTotalPages(Math.ceil(response.meta.total / limit))
        setTotalDocuments(response.meta.total)
      }
    } catch (err) {
      setError('মাদরাসার তালিকা লোড করতে সমস্যা হয়েছে')
      toast.error('মাদরাসার তথ্য লোড করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(false)
    }
  }, [
    currentPage,
    limit,
    sortOrder,
    selectedDivisions,
    selectedDistricts,
    selectedSubDistricts,
    selectedPoliceStations,
    selectedMadrasahType,
    searchQuery,
    selectedZone
  ])


  const fetchDistricts = useCallback(async () => {
    if (selectedDivisions.length > 0) {
      try {
        const districts = await Promise.all(
          selectedDivisions.map((division) => getDistricts(division))
        )
        const allDistricts = districts.flat()
        setAvailableDistricts([...new Set(allDistricts)] as string[])
      } catch (error) {
        console.error('Error fetching districts:', error)
        setAvailableDistricts([])
      }
    } else {
      setAvailableDistricts([])
      setSelectedDistricts([])
    }
  }, [selectedDivisions])

  const fetchSubDistricts = useCallback(async () => {
    if (selectedDistricts.length > 0) {
      try {
        const subDistricts = await Promise.all(
          selectedDistricts.map((district) => getSubDistricts(district))
        )
        const allSubDistricts = subDistricts.flat()
        setAvailableSubDistricts([...new Set(allSubDistricts)])
      } catch (error) {
        console.error('Error fetching sub-districts:', error)
        setAvailableSubDistricts([])
      }
    } else {
      setAvailableSubDistricts([])
      setSelectedSubDistricts([])
    }
  }, [selectedDistricts])

  const fetchPoliceStations = useCallback(async () => {
    if (selectedSubDistricts.length > 0 && selectedDistricts.length > 0) {
      try {
        const stations = await Promise.all(
          selectedSubDistricts.map((subDistrict) =>
            getPoliceStations(selectedDistricts[0], subDistrict)
          )
        )
        const allStations = stations.flat()
        setAvailablePoliceStations([...new Set(allStations)])
      } catch (error) {
        console.error('Error fetching police stations:', error)
        setAvailablePoliceStations([])
      }
    } else {
      setAvailablePoliceStations([])
    }
  }, [selectedSubDistricts, selectedDistricts])

  const handleDivisionsChange = useCallback(
    (newDivisions: string[]) => {
      const removedDivisions = selectedDivisions.filter(
        (d) => !newDivisions.includes(d)
      )
      setSelectedDivisions(newDivisions)

      // If any divisions were removed, remove their districts from selection
      if (removedDivisions.length > 0) {
        const remainingDistricts = selectedDistricts.filter((district) => {
          // Keep only districts that belong to remaining divisions
          const belongsToRemainingDivision = newDivisions.some((division) => {
            return divisions[division]?.districts?.some(
              (d) => d.name === district
            )
          })
          return belongsToRemainingDivision
        })
        setSelectedDistricts(remainingDistricts)
      }
    },
    [selectedDivisions, selectedDistricts, divisions]
  )

  const handleDistrictsChange = useCallback(
    (newDistricts: string[]) => {
      const removedDistricts = selectedDistricts.filter(
        (d) => !newDistricts.includes(d)
      )
      setSelectedDistricts(newDistricts)

      // If any districts were removed, remove their subdistricts from selection
      if (removedDistricts.length > 0) {
        const remainingSubDistricts = selectedSubDistricts.filter(
          (subDistrict) => {
            return newDistricts.length > 0 // Keep subdistricts only if there are selected districts
          }
        )
        setSelectedSubDistricts(remainingSubDistricts)
      }
    },
    [selectedDistricts, selectedSubDistricts]
  )

  const handleSubDistrictsChange = useCallback(
    (newSubDistricts: string[]) => {
      const removedSubDistricts = selectedSubDistricts.filter(
        (d) => !newSubDistricts.includes(d)
      )
      setSelectedSubDistricts(newSubDistricts)

      // If any subdistricts were removed, remove their police stations from selection
      if (removedSubDistricts.length > 0) {
        const remainingPoliceStations = selectedPoliceStations.filter(
          (station) => {
            return newSubDistricts.length > 0 // Keep police stations only if there are selected subdistricts
          }
        )
        setSelectedPoliceStations(remainingPoliceStations)
      }
    },
    [selectedSubDistricts, selectedPoliceStations]
  )

  const handleDelete = async (id: string) => {
    const madrasah = madrasahs.find((m) => m._id === id)
    if (!madrasah) return
    setSelectedMadrasah(madrasah)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedMadrasah) return
    try {
      const response = await deleteMadrasah(selectedMadrasah._id)
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: 'মাদরাসা সফলভাবে মুছে ফেলা হয়েছে'
        })
        fetchMadrasahs()
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: response.message || 'মাদরাসা মুছে ফেলতে সমস্যা হয়েছে'
        })
      }
    } catch (error) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: 'মাদরাসা মুছে ফেলতে সমস্যা হয়েছে'
      })
    }
  }

  const handlePageChange = (page: number) => {
    console.log('Changing to page:', page)
    setIsLoading(true)
    setCurrentPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setLimit(limit)
  }

  // handle set order chnage 
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleMadrasahTypeChange = (value: string) => {
    setSelectedMadrasahType(value)
  }

  const handleFilterSubmit = () => {
    setSearchQuery(searchInput)
    fetchMadrasahs()
    fetchDistricts()
    fetchSubDistricts()
    fetchPoliceStations()
  }

  // handle select zone
  const handleZoneChange = (value: string) => {
    setSelectedZone(value === 'all' ? '' : value)
    if (value === 'all') {
      setSelectedZoneName('সকল জোন')
    } else {
      const selectedZoneData = zones.find(zone => zone.value === value)
      setSelectedZoneName(selectedZoneData?.name || '')
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchMadrasahs()
  }, [currentPage, limit, sortOrder, selectedDivisions, selectedDistricts, selectedSubDistricts, selectedPoliceStations, selectedMadrasahType, searchQuery, selectedZone])

  // Fetch districts when divisions change
  useEffect(() => {
    fetchDistricts()
  }, [selectedDivisions, fetchDistricts])

  // Fetch sub-districts when districts change
  useEffect(() => {
    fetchSubDistricts()
  }, [selectedDistricts, fetchSubDistricts])

  // Fetch police stations when sub-districts change
  useEffect(() => {
    fetchPoliceStations()
  }, [selectedSubDistricts, selectedDistricts, fetchPoliceStations])

  // fetch all zones 
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await getAllZones()
        if (response.success) {
          // Transform zone data to match required format
          const formattedZones = response.data.map(zone => ({
            name: zone.name,
            value: zone._id?.toString() || ''
          }))
          setZones(formattedZones)
        }
      } catch (error) {
        console.error('জোন লোড করতে সমস্যা হয়েছে:', error)
      }
    }
    fetchZones()
  }, [])

  return showPrintPreview ? (
    <MadrasahPrintPreview
      printContent={printContent}
      printType={printType}
      onClose={() => setShowPrintPreview(false)}
    />
  ) : (
    <div className="container mx-auto px-4 py-8">
      <MadrasahListHeaderSection
        onPrintList={() => handlePrintPreview('list')}
        onPrintAddresses={() => handlePrintPreview('addresses')}
      />
      
      {/* Pagination info and limit selector */}
      <div className="mt-4 mb-2 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-700">
          মাদরাসার সংখ্যা: {totalDocuments.toLocaleString('bn-BD')}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="limitSelect" className="text-sm text-gray-700">
            প্রতি পেজে দেখানো হবে:
          </label>
          <select
            id="limitSelect"
            className="bg-white px-3 text-gray-700 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:ring-offset-0 text-sm"
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          >
            {[10, 20, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700].map(
              (limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              )
            )}
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
        onSortOrderChange={handleSortOrderChange}
        onMadrasahTypeChange={handleMadrasahTypeChange}
        allZones={zones}
        onZoneChange={handleZoneChange}
        selectedZone={selectedZone}
        selectedZoneName={selectedZoneName}
        sortOrder={sortOrder}
        onSearchQueryChange={(value) => {
          setSearchInput(value)
          setSearchQuery(value)
        }}
        onApplyFilters={handleFilterSubmit}
      />

      <MadrasahListTableSection
        madrasahs={madrasahs}
        onDelete={handleDelete}
        getAddressField={getAddressField}
        getMadrasahInfoField={getMadrasahInfoField}
        isLoading={isLoading}
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
        description={
          selectedMadrasah
            ? `আপনি কি নিশ্চিত যে আপনি "${selectedMadrasah.madrasahNames.bengaliName}" মাদরাসাটি মুছে ফেলতে চান?`
            : ''
        }
      />
      <StatusDialog
        isOpen={statusDialog.isOpen}
        type={statusDialog.type}
        title={statusDialog.title}
        message={statusDialog.message}
        onClose={() => setStatusDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
