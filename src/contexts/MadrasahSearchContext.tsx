// contexts/MadrasahContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Madrasah {
  _id: string
  madrasahName: string
  [key: string]: any // অন্যান্য ফিল্ডের জন্য
}

interface MadrasahContextType {
  selectedMadrasah: Madrasah | null
  setSelectedMadrasah: (madrasah: Madrasah | null) => void
}

const MadrasahContext = createContext<MadrasahContextType | undefined>(undefined)

export const MadrasahProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMadrasah, setSelectedMadrasah] = useState<Madrasah | null>(null)

  return (
    <MadrasahContext.Provider value={{ selectedMadrasah, setSelectedMadrasah }}>
      {children}
    </MadrasahContext.Provider>
  )
}

export const useMadrasah = () => {
  const context = useContext(MadrasahContext)
  if (context === undefined) {
    throw new Error('useMadrasah must be used within a MadrasahProvider')
  }
  return context
}