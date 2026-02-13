import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "react-day-picker";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChartFilterType = "3m" | "6m" | "1y" | "3y" | "all" | "custom";

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
      setDateRange(undefined); // 빠른 선택 사용 시 사용자 지정 범위 초기화
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
        {(["3m", "6m", "1y", "3y", "all"] as ChartFilterType[]).map((type) => (
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
            {type === "all" && "전체"}
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
