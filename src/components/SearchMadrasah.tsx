'use client'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react'
import { IoSearch } from 'react-icons/io5'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import useMadrasahSearch from '@/hooks/useMadrasahSearch'
import ShowMadrasahSearchSuggestions from './MadrasahSearchSuggestions'
import Madrasah from '@/types/madrasah'

interface Props {
  onMadrasahSelect?: (madrasah: Madrasah | null) => void
  isButtonVisible?: boolean
  labelText?: string
}

const SearchMadrasah = forwardRef<{ reset: () => void }, Props>(
  ({ onMadrasahSelect, isButtonVisible = true, labelText }: Props, ref) => {
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          suggestionsRef.current &&
          !suggestionsRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    const {
      searchTerm,
      handleInputChange,
      handleKeyDown,
      madrasahs,
      isLoading,
      error,
      selectedMadrasah,
      showSuggestions,
      highlightedIndex,
      setShowSuggestions,
      handleMadrasahSelect,
      clearSelection,
      setHighlightedIndex,
      triggerSearch,
      setSearchTerm
    } = useMadrasahSearch({
      // suggestionsRef,
      // searchTimeoutRef,
      onMadrasahSelect
      // inputRefFocus
    })

    useImperativeHandle(ref, () => ({
      reset: () => {
        setSearchTerm('') // সার্চ টার্ম ক্লিয়ার
        clearSelection() // সিলেক্টেড মাদরাসা ক্লিয়ার
      }
    }))

    return (
      <div className="space-y-2 relative w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            {labelText && <Label>{labelText}</Label>}
            <Input
              ref={inputRef}
              type="text"
              placeholder="মাদ্রাসার কোড বা নাম লিখুন (কমপক্ষে ৩টি অক্ষর)"
              className="w-full pr-8"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (madrasahs.length > 0 && !selectedMadrasah) {
                  setShowSuggestions(true)
                }
              }}
            />
            {selectedMadrasah && (
              <button
                type="button"
                className="absolute right-2 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={clearSelection}
              >
                ✕
              </button>
            )}
          </div>
          <Button
            type="button"
            className={`bg-[#52B788] hover:bg-[#52B788]/90 text-white ${isButtonVisible && 'hidden'}`}
            onClick={() => triggerSearch()}
            disabled={isLoading}
          >
            <IoSearch className="h-5 w-5" />
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error.message}</p>}

        {/* Suggestions Dropdown */}
        {showSuggestions && madrasahs.length > 0 && !selectedMadrasah && (
          <ShowMadrasahSearchSuggestions
            handleMadrasahSelect={handleMadrasahSelect}
            highlightedIndex={highlightedIndex}
            madrasahs={madrasahs}
            setHighlightedIndex={setHighlightedIndex}
            suggestionsRef={suggestionsRef}
          />
        )}
      </div>
    )
  }
)

SearchMadrasah.displayName = 'SearchMadrasah'

export default SearchMadrasah
