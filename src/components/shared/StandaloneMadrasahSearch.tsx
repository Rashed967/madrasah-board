import { Autocomplete } from '@/components/ui/autocomplete'
import { useMadrasahSearch } from '@/hooks/useAllMadrasahSearch'
import { useMadrasahStore } from '@/store/madrasahStore'
import { X } from 'lucide-react'
import { useEffect } from 'react'

const StandaloneMadrasahSearch = () => {
  const { selectedMadrasah, setSelectedMadrasah } = useMadrasahStore()
  const {
    madrasahList,
    loading,
    hasMore,
    handleSearch,
    handleScroll
  } = useMadrasahSearch()

  // Debug log when selectedMadrasah changes
  useEffect(() => {
    console.log('StandaloneMadrasahSearch - selectedMadrasah changed:', selectedMadrasah)
  }, [selectedMadrasah])

  const handleSelect = (selectedValue: string) => {
    console.log('handleSelect called with value:', selectedValue)
    const selectedMadrasah = madrasahList.find(m => m._id === selectedValue)
    if (selectedMadrasah) {
      console.log('Found madrasah:', selectedMadrasah)
      const madrasah = {
        id: selectedMadrasah._id,
        name: selectedMadrasah.madrasahNames.bengaliName,
        code: selectedMadrasah.code
      }
      console.log('Setting madrasah in store:', madrasah)
      setSelectedMadrasah(madrasah)
    }
  }

  const handleClear = () => {
    console.log('Clearing madrasah selection')
    setSelectedMadrasah(null)
  }

  return (
    <div>
      <div className="relative">
        <Autocomplete
          value={selectedMadrasah?.name || ''}
          onChange={handleSelect}
          onSearch={handleSearch}
          onScroll={handleScroll}
          options={madrasahList.map(madrasah => ({
            label: `${madrasah.madrasahNames.bengaliName} (${madrasah.code})`,
            value: madrasah._id
          }))}
          isLoading={loading}
          placeholder="মাদ্রাসা খুঁজুন..."
        />
        {selectedMadrasah && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  )
}

export default StandaloneMadrasahSearch 