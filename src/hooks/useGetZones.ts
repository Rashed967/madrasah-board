import { useState, useEffect } from 'react'
import { get } from '@/core/api/apiService'

interface IZone {
  _id: string
  name: string
  code: string
  allDistricts: string[]
}

interface UseGetZonesReturn {
  zones: IZone[]
  getDistrictsForZones: (zoneIds: string[]) => string[]
  loading: boolean
  error: string | null
}

export const useGetZones = (): UseGetZonesReturn => {
  const [zones, setZones] = useState<IZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchZones = async () => {
    try {
      setLoading(true)
      const response = await get<IZone[]>('/zones?fields=name,code,allDistricts&limit=30')
      if (response.success) {
        setZones(response.data)
      } else {
        setError(response.message || 'Failed to fetch zones')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch zones')
    } finally {
      setLoading(false)
    }
  }

  const getDistrictsForZones = (zoneIds: string[]): string[] => {
    if (zoneIds.length === 0) return []
    
    const selectedZones = zones.filter(zone => zoneIds.includes(zone._id))
    const districts = selectedZones.reduce((acc: string[], zone) => {
      return [...acc, ...zone.allDistricts]
    }, [])
    return [...new Set(districts)].sort()
  }

  useEffect(() => {
    fetchZones()
  }, [])

  return {
    zones,
    getDistrictsForZones,
    loading,
    error
  }
} 