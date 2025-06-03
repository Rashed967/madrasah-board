import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'
import { X } from 'lucide-react'

interface AutocompleteProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onScroll?: () => void
  options?: { label: string; value: string }[]
  isLoading?: boolean
  placeholder?: string
}

const Autocomplete = React.forwardRef<HTMLDivElement, AutocompleteProps>(
  (
    { className, value, onChange, onSearch, onScroll, options = [], isLoading, placeholder, ...props },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value || '')
    const containerRef = React.useRef<HTMLDivElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onSearch?.(newValue)
      setIsOpen(true)
    }

    const handleItemSelect = (selectedValue: string) => {
      setInputValue(selectedValue)
      onChange?.(selectedValue)
      setIsOpen(false)
    }

    const handleClear = () => {
      setInputValue('')
      onChange?.('')
      setIsOpen(false)
    }

    const handleScroll = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
          onScroll?.()
        }
      }
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
        className={cn('relative w-full', className)}
        {...props}
      >
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            onFocus={() => setIsOpen(true)}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        {isOpen && (
          <div 
            ref={listRef}
            className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-y-auto"
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">লোড হচ্ছে...</div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    console.log('Selected:', option)
                    handleItemSelect(option.label)
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">কোন ফলাফল পাওয়া যায়নি</div>
            )}
          </div>
        )}
      </div>
    )
  }
)

interface AutocompleteItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AutocompleteItem = React.forwardRef<
  HTMLDivElement,
  AutocompleteItemProps
>(({ className, value, children, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn('cursor-pointer px-3 py-2 hover:bg-gray-100', className)}
      {...props}
    >
      {children || value}
    </div>
  )
})

Autocomplete.displayName = 'Autocomplete'
AutocompleteItem.displayName = 'AutocompleteItem'

export { Autocomplete, AutocompleteItem }
