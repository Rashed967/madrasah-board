"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MultiSelectProps {
  selected: string[]
  setSelected: (selected: string[]) => void
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
}

export function MultiSelect({
  selected,
  setSelected,
  options,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectables = options.filter((option) => !selected.includes(option.value))

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={className} ref={containerRef}>
      <div 
        className="border rounded-md p-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <input
          placeholder={placeholder}
          className="border-none outline-none bg-transparent w-full cursor-pointer"
          readOnly
        />
      </div>
      
      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((item) => {
            const option = options.find((o) => o.value === item)
            return (
              <Badge key={item} variant="secondary">
                {option?.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(selected.filter((i) => i !== item))
                  }}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Dropdown */}
      {open && selectables.length > 0 && (
        <div className="mt-1 border rounded-md bg-white shadow-lg max-h-[200px] overflow-auto">
          {selectables.map((option) => (
            <div
              key={option.value}
              className="px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelected([...selected, option.value])
                setOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
