import Madrasah from '@/types/madrasah'
import React from 'react'

interface Props {
  suggestionsRef: React.MutableRefObject<HTMLDivElement>
  madrasahs: Madrasah[]
  highlightedIndex: number
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>
  handleMadrasahSelect: (madrasah: Madrasah) => void
}

const ShowMadrasahSearchSuggestions = ({
  suggestionsRef,
  madrasahs,
  highlightedIndex,
  setHighlightedIndex,
  handleMadrasahSelect
}: Props) => {
  return (
    <div
      ref={suggestionsRef}
      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      {madrasahs.map((madrasah, index) => (
        <div
          key={madrasah._id}
          className={`p-2 cursor-pointer ${
            index === highlightedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleMadrasahSelect(madrasah)}
          onMouseEnter={() => setHighlightedIndex(index)}
        >
          <div className="font-medium">
            {madrasah.madrasahNames.bengaliName}
          </div>
          <div className="text-sm text-gray-600">কোড: {madrasah.code}</div>
        </div>
      ))}
    </div>
  )
}

export default ShowMadrasahSearchSuggestions
