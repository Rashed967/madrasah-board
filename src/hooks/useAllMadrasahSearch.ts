import { useState, useEffect } from 'react'
import { getAllMadrasahsForSearch } from '@/services/madrasahService'
import { useForm } from 'react-hook-form'

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

interface UseMadrasahSearchProps {
  formFieldName?: string
  form?: ReturnType<typeof useForm>
}

export const useMadrasahSearch = ({ formFieldName, form }: UseMadrasahSearchProps = {}) => {
  const [madrasahList, setMadrasahList] = useState<Madrasah[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedMadrasah, setSelectedMadrasah] = useState<SelectedMadrasah | null>(null)

  useEffect(() => {
    const loadMadrasahs = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          searchTerm
        }).toString()

        const response = await getAllMadrasahsForSearch(queryParams)
        if (response.success) {
          if (page === 1) {
            setMadrasahList(response.data as Madrasah[])
          } else {
            setMadrasahList(prev => [...prev, ...(response.data as Madrasah[])])
          }
          setHasMore(response.meta.page * response.meta.limit < response.meta.total)
        }
      } catch (error) {
        console.error('Failed to load madrasahs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMadrasahs()
  }, [searchTerm, page])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleScroll = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const handleMadrasahChange = (madrasah: SelectedMadrasah | null) => {
    setSelectedMadrasah(madrasah)
    if (form && formFieldName && madrasah) {
      form.setValue(formFieldName, madrasah.id)
    }
  }

  return {
    madrasahList,
    loading,
    hasMore,
    selectedMadrasah,
    handleSearch,
    handleScroll,
    handleMadrasahChange
  }
}
