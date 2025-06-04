// components/MadrasahSearchComponent.tsx
import React, { useState, useEffect, useRef } from 'react'
import { useMadrasah } from '@/contexts/MadrasahSearchContext'
import { getAllExamsForSearch } from '@/services/examService'
import { getAllMadrasahsForSearch } from '@/services/madrasahService'

interface Madrasah {
  _id: string
  madrasahName: string
  [key: string]: any
}

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: Madrasah[]
}

const MadrasahSearch: React.FC = () => {
  const { selectedMadrasah, setSelectedMadrasah } = useMadrasah()
  const [searchTerm, setSearchTerm] = useState('')
  const [madrasahs, setMadrasahs] = useState<Madrasah[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchMadrasahs(searchTerm)
      } else {
        setMadrasahs([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchMadrasahs = async (term: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // এখানে আপনার API endpoint দিন
      const response :any = await getAllMadrasahsForSearch(`searchTerm=${term}`);
      if (!response.success ) {
        throw new Error('সার্চ করতে সমস্যা হয়েছে')
      }
      
      if (response.success) {
        console.log(response.data)
        setMadrasahs(response.data)
        setIsOpen(true)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('সার্চ করতে সমস্যা হয়েছে')
      console.error('Madrasah search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMadrasah = (madrasah: Madrasah) => {
    setSelectedMadrasah(madrasah)
    setSearchTerm(madrasah.madrasahName)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (!e.target.value.trim()) {
      setSelectedMadrasah(null)
    }
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="মাদরাসা খুঁজুন..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute z-10 w-full mt-1 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {isOpen && madrasahs.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {madrasahs.map((madrasah) => (
            <div
              key={madrasah._id}
              onClick={() => handleSelectMadrasah(madrasah)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{madrasah?.madrasahNames?.bengaliName}</div>
              {madrasah.code && (
                <div className="text-sm text-gray-500">কোড: {madrasah.code}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && madrasahs.length === 0 && searchTerm && !isLoading && (
        <div className="absolute z-10 w-full mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg text-gray-500 text-center">
          কোনো মাদরাসা পাওয়া যায়নি
        </div>
      )}

      {selectedMadrasah && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="text-sm text-green-800">
            <strong>নির্বাচিত:</strong> {selectedMadrasah.madrasahName}
          </div>
        </div>
      )}
    </div>
  )
}

export default MadrasahSearch