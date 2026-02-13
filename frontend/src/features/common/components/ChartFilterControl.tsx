import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export type ChartFilterType = "3m" | "6m" | "1y" | "3y" | "custom";

interface ChartFilterControlProps {
  selectedType: ChartFilterType;
  dateRange?: DateRange;
  onFilterChange: (type: ChartFilterType, range?: DateRange) => void;
  className?: string;
}

export function ChartFilterControl({
  selectedType,
  dateRange,
  onFilterChange,
  className,
}: ChartFilterControlProps) {
  const handleTypeChange = (type: ChartFilterType) => {
    if (type !== "custom") {
      onFilterChange(type);
    }
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      onFilterChange("custom", range);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex items-center space-x-1 rounded-md border bg-white p-1">
        {(["3m", "6m", "1y", "3y"] as ChartFilterType[]).map((type) => (
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
            {type === "3m" && "3개월"}
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
