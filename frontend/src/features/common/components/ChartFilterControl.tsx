import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "react-day-picker";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChartFilterType = "6m" | "1y" | "3y" | "custom";

interface ChartFilterControlProps {
  onFilterChange: (type: ChartFilterType, range?: DateRange) => void;
  className?: string;
  defaultType?: ChartFilterType;
}

export function ChartFilterControl({
  onFilterChange,
  className,
  defaultType = "6m",
}: ChartFilterControlProps) {
  const [selectedType, setSelectedType] =
    useState<ChartFilterType>(defaultType);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleTypeChange = (type: ChartFilterType) => {
    setSelectedType(type);
    if (type !== "custom") {
      setDateRange(undefined); // Reset custom range when quick select is used
      onFilterChange(type);
    }
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setSelectedType("custom");
      onFilterChange("custom", range);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex items-center space-x-1 rounded-md border bg-white p-1">
        {(["6m", "1y", "3y"] as const).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTypeChange(type)}
            className={cn(
              "h-7 px-3 text-xs",
              selectedType === type && "font-semibold text-foreground bg-muted",
            )}
          >
            {type === "6m" && "6개월"}
            {type === "1y" && "1년"}
            {type === "3y" && "3년"}
          </Button>
        ))}
      </div>
      <div className="h-6 w-px bg-border mx-1" />
      <DateRangePicker
        date={dateRange}
        onDateChange={handleRangeChange}
        className={cn(
          "transition-opacity duration-200",
          selectedType === "custom" ? "opacity-100" : "opacity-70",
        )}
      />
    </div>
  );
}
