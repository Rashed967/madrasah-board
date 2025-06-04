import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Madrasah {
  id: string
  name: string
  code: string
}

interface MadrasahStore {
  selectedMadrasah: Madrasah | null
  setSelectedMadrasah: (madrasah: Madrasah | null) => void
}

export const useMadrasahStore = create<MadrasahStore>()(
  persist(
    (set) => ({
      selectedMadrasah: null,
      setSelectedMadrasah: (madrasah) => {
        console.log('Store: Setting madrasah:', madrasah)
        set({ selectedMadrasah: madrasah })
      }
    }),
    {
      name: 'madrasah-storage'
    }
  )
) 