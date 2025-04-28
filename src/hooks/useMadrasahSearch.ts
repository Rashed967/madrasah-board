import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import Madrasah from '@/types/madrasah'

interface MadrasahResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    page: number
    limit: number
    total: number
  }
  data: Madrasah[]
}

interface MadrasahSearchProps {
  onMadrasahSelect?: (madrasah: Madrasah | null) => void
}

const fetchMadrasahs = async (searchTerm: string): Promise<Madrasah[]> => {
  const access_token = localStorage.getItem('access_token')
  const { data } = await axios.get<MadrasahResponse>(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/madrasah?limit=10&searchTerm=${searchTerm}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }
  )
  return data.data || []
}

const useMadrasahSearch = ({ onMadrasahSelect }: MadrasahSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMadrasah, setSelectedMadrasah] = useState<Madrasah | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: searchTerm.length > 0 ? ['madrasahs', searchTerm] : ['madrasah'],
    queryFn: () => fetchMadrasahs(searchTerm),
    enabled: searchTerm.length >= 3, // at least 3 characters
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    setSearchTerm(e.target.value)
    setHighlightedIndex(-1)
    setShowSuggestions(true)

    if (selectedMadrasah) {
      setSelectedMadrasah(null)
      if (onMadrasahSelect) onMadrasahSelect(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!data.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % data.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + data.length) % data.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0) {
        handleMadrasahSelect(data[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setShowSuggestions(false)
    }
  }

  const handleMadrasahSelect = (madrasah: Madrasah) => {
    setSelectedMadrasah(madrasah)
    setSearchTerm(`${madrasah.madrasahNames.bengaliName} (${madrasah.code})`)
    setShowSuggestions(false)
    if (onMadrasahSelect) onMadrasahSelect(madrasah)
  }

  const clearSelection = () => {
    setSelectedMadrasah(null)
    setSearchTerm('')
  }

  const triggerSearch = () => {
    refetch();
  };

  return {
    searchTerm,
    handleInputChange,
    handleKeyDown,
    madrasahs: data,
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
  }
}

export default useMadrasahSearch
