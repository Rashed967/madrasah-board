import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface AutocompleteProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children?: React.ReactNode
}

const Autocomplete = React.forwardRef<HTMLDivElement, AutocompleteProps>(
  ({ className, value, onValueChange, placeholder, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value || '')
    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onValueChange?.(newValue)
      setIsOpen(true)
    }

    const handleItemSelect = (selectedValue: string) => {
      setInputValue(selectedValue)
      onValueChange?.(selectedValue)
      setIsOpen(false)
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    return (
      <div 
        ref={containerRef} 
        className={cn("relative w-full", className)} 
        {...props}
      >
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onClick: () => handleItemSelect(child.props.value)
                } as any)
              }
              return null
            })}
          </div>
        )}
      </div>
    )
  }
)

interface AutocompleteItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AutocompleteItem = React.forwardRef<HTMLDivElement, AutocompleteItemProps>(
  ({ className, value, children, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "cursor-pointer px-3 py-2 hover:bg-gray-100",
          className
        )}
        {...props}
      >
        {children || value}
      </div>
    )
  }
)

Autocomplete.displayName = "Autocomplete"
AutocompleteItem.displayName = "AutocompleteItem"

export { Autocomplete, AutocompleteItem }
