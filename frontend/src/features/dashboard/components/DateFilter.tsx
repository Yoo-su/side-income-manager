import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths, isAfter, startOfMonth } from "date-fns";

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateFilter({ selectedDate, onDateChange }: DateFilterProps) {
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    if (isAfter(startOfMonth(nextMonth), startOfMonth(new Date()))) return;
    onDateChange(nextMonth);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(parseInt(year));
    if (isAfter(startOfMonth(newDate), startOfMonth(new Date()))) {
      // 미래 날짜 선택 시 현재 월로 조정하거나 경고?
      // 여기서는 그냥 현재 날짜의 연도 변경만 처리하고, 만약 미래라면 현재 시간으로 맞춤
      const now = new Date();
      if (newDate > now) {
        onDateChange(now);
        return;
      }
    }
    onDateChange(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(parseInt(month) - 1);
    if (isAfter(startOfMonth(newDate), startOfMonth(new Date()))) return;
    onDateChange(newDate);
  };

  const isNextDisabled = isAfter(
    startOfMonth(addMonths(selectedDate, 1)),
    startOfMonth(new Date()),
  );

  return (
    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-border shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevMonth}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        <Select
          value={selectedDate.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="h-8 w-[100px] border-none bg-transparent focus:ring-0 text-sm font-semibold">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={(selectedDate.getMonth() + 1).toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="h-8 w-[80px] border-none bg-transparent focus:ring-0 text-sm font-semibold">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem
                key={month}
                value={month.toString()}
                disabled={isAfter(
                  new Date(selectedDate.getFullYear(), month - 1),
                  new Date(),
                )}
              >
                {month}월
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        disabled={isNextDisabled}
        className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
