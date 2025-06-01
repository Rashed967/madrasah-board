import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { convertToBengali } from '@/utils/convertToBengali'
import { memo, useEffect, useRef } from 'react'
import React from 'react'

interface MadrasahSearchProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchResults: any[]
  showDropdown: boolean
  onMadrasahSelect: (madrasah: any) => void
  madrasahSearchInputError: string
  isExamSelected: boolean
  onClear?: () => void
}

const MadrasahSearch = memo(
  ({
    searchTerm,
    onSearchChange,
    searchResults,
    showDropdown,
    onMadrasahSelect,
    madrasahSearchInputError,
    isExamSelected,
    onClear
  }: MadrasahSearchProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          // You'll need to implement a way to hide the dropdown from the parent component
          // This could be through a prop like onDropdownClose
          if (onClear) onClear()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [onClear])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault() // Prevent form submission
        onSearchChange(e as any)
      }
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <Label>মাদ্রাসা অনুসন্ধান </Label>
        <div className="relative">
          <Input
            placeholder="মাদ্রাসার নাম অথবা কোড"
            className="flex-1 text-xs pr-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e)}
            onKeyDown={handleKeyDown}
            disabled={!isExamSelected}
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={onClear}
            >
              ✕
            </button>
          )}
          <span className="text-xs text-red-500 italic">
            {madrasahSearchInputError}{' '}
          </span>
        </div>

        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            <ul className="py-1 max-h-[120px] overflow-y-auto">
              {searchResults.map((madrasah: any) => (
                <li
                  key={madrasah._id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => onMadrasahSelect(madrasah)}
                >
                  <div>{madrasah.name}</div>
                  <div className="text-xs text-gray-500">
                    {madrasah.madrasahNames.bengaliName} -{' '}
                    {convertToBengali(madrasah.code)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

MadrasahSearch.displayName = 'MadrasahSearch'

export default MadrasahSearch
