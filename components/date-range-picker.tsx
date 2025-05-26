"use client"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React, { JSX } from "react"
import { Calendar } from "./ui/calendar"

type StrictDateRange = {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value: StrictDateRange
  onChange: (date: StrictDateRange) => void
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps): JSX.Element {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: value.from,
    to: value.to,
  })

  React.useEffect(() => {
    setDate(value)
  }, [value])

  function handleSelect(range: DateRange | undefined) {
    if (range?.from && range.to) {
      setDate(range)
      onChange({ from: range.from, to: range.to })
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
    <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"default"}
            className={cn(
              "w-[300px] justify-start text-left font-normal border-2 rounded-md",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a value</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={2}
            defaultMonth={value.from}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
