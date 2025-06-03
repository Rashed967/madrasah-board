import { Autocomplete } from '@/components/ui/autocomplete'
import { useMadrasahSearch } from '@/hooks/useAllMadrasahSearch'
import { X } from 'lucide-react'

interface Madrasah {
  _id: string
  madrasahNames: {
    bengaliName: string
    arabicName: string
    englishName: string
  }
  code: string
}

interface SelectedMadrasah {
  id: string
  name: string
  code: string
}

interface MadrasahSearchProps {
  value?: SelectedMadrasah
  onChange: (madrasah: SelectedMadrasah | null) => void
  placeholder?: string
  className?: string
  label?: string
  formFieldName?: string
  form?: any
}

const MadrasahSearch = ({
  value,
  onChange,
  placeholder = 'মাদ্রাসা খুঁজুন...',
  className,
  label,
  formFieldName,
  form
}: MadrasahSearchProps) => {
  const {
    madrasahList,
    loading,
    hasMore,
    handleSearch,
    handleScroll,
    handleMadrasahChange
  } = useMadrasahSearch({ formFieldName, form })

  const handleSelect = (selectedValue: string) => {
    const selectedMadrasah = madrasahList.find(m => m._id === selectedValue)
    if (selectedMadrasah) {

      const madrasah = {
        id: selectedMadrasah._id,
        name: selectedMadrasah.madrasahNames.bengaliName,
        code: selectedMadrasah.code
      }
      handleMadrasahChange(madrasah)
      onChange(madrasah)
    }
  }

  const handleClear = () => {
    handleMadrasahChange(null)
    onChange(null)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Autocomplete
          value={value?.name || ''}
          onChange={handleSelect}
          onSearch={handleSearch}
          onScroll={handleScroll}
          options={madrasahList.map(madrasah => ({
            label: `${madrasah.madrasahNames.bengaliName} (${madrasah.code})`,
            value: madrasah._id
          }))}
          isLoading={loading}
          placeholder={placeholder}
        />
        {value && (
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

export default MadrasahSearch 