"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface CheckboxDropdownProps {
  trigger: React.ReactNode
  items: {
    id: string
    label: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }[]
  selectAll?: {
    label: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }
  className?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#52B788] data-[state=checked]:text-white data-[state=checked]:border-[#52B788]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const CheckboxDropdown = React.forwardRef<
  HTMLDivElement,
  CheckboxDropdownProps
>(({ trigger, items, selectAll, className }, ref) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between", className)}
        >
          {trigger}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border rounded-md shadow-md"
        style={{ 
          maxHeight: '200px',
          overflowY: 'auto',
          marginTop: '4px'
        }}
        align="start"
        sideOffset={0}
      >
        {selectAll && (
          <div className="flex items-center space-x-2 p-2 border-b sticky top-0 bg-white z-10">
            <Checkbox
              id="select-all"
              checked={selectAll.checked}
              onCheckedChange={selectAll.onCheckedChange}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {selectAll.label}
            </label>
          </div>
        )}
        <div className="p-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-sm">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={item.onCheckedChange}
              />
              <label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
CheckboxDropdown.displayName = "CheckboxDropdown"

export { Checkbox, CheckboxDropdown } 