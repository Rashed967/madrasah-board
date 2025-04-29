'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createZone, getAllSelectedDistricts } from '@/features/zone/zone.services'

export default function useCreateZone() {
  const queryClient = useQueryClient()

  // সব ডিসঅ্যালাউড জেলা আনার জন্য
  const { data: disallowedDistricts = [], refetch: refetchDisallowedDistricts } = useQuery({
    queryKey: ['disallowedDistricts'],
    queryFn: async () => {
      const res = await getAllSelectedDistricts()
      if (res.success && Array.isArray(res.data)) {
        return res.data
      }
      return []
    }
  })

  // জোন তৈরি করার জন্য মিউটেশন
  const {
    mutate: createZoneMutation,
    isPending: isCreatingZone
  } = useMutation({
    mutationFn: createZone,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['disallowedDistricts'] })
    }
  })

  return {
    disallowedDistricts,
    refetchDisallowedDistricts,
    createZoneMutation,
    isCreatingZone
  }
}
