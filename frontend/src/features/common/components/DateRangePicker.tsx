import {
  format,
  addYears,
  subYears,
  differenceInDays,
  addMonths,
  isSameMonth,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface DateRangePickerProps {
  className?: string;
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  // 팝오버 제어 상태
  const [open, setOpen] = useState(false);

  // '확인' 버튼 클릭 전까지 임시로 저장할 로컬 상태
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);
  const [error, setError] = useState<string | null>(null);

  // 두 달력의 독립적인 월 네비게이션 상태
  const [monthLeft, setMonthLeft] = useState<Date>(new Date());
  const [monthRight, setMonthRight] = useState<Date>(addMonths(new Date(), 1));

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setTempDate(date);
      setError(null);
      if (date?.from) {
        setMonthLeft(date.from);
        if (date.to) {
          // 시작일과 종료일이 같은 달에 있다면, 오른쪽 달력은 다음 달을 표시
          if (isSameMonth(date.from, date.to)) {
            setMonthRight(addMonths(date.from, 1));
          } else {
            setMonthRight(date.to);
          }
        } else {
          setMonthRight(addMonths(date.from, 1));
        }
      } else {
        // 날짜가 선택되지 않았을 때 기본 뷰: 이번 달과 다음 달
        setMonthLeft(new Date());
        setMonthRight(addMonths(new Date(), 1));
      }
    }
  };

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate);
    if (newDate?.from && newDate?.to) {
      const days = differenceInDays(newDate.to, newDate.from);
      if (days > 365 * 3) {
        setError("최대 3년까지만 조회 가능합니다.");
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  // 기간 텍스트 계산 함수 (예: 1년 2개월 5일)
  const getDurationText = (from: Date, to: Date) => {
    const days = differenceInDays(to, from) + 1;
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = (days % 365) % 30;

    const parts = [];
    if (years > 0) parts.push(`${years}년`);
    if (months > 0) parts.push(`${months}개월`);
    if (remainingDays > 0 || parts.length === 0)
      parts.push(`${remainingDays}일`);

    return parts.join(" ");
  };

  const isDateDisabled = (day: Date) => {
    // 1. 기본 제한: 미래 날짜 및 1900년 이전 날짜 선택 불가
    if (day > new Date() || day < new Date("1900-01-01")) {
      return true;
    }

    // 2. 범위 제한: 시작일 선택 후 3년 전후까지만 선택 기능
    if (tempDate?.from && !tempDate.to) {
      const maxDate = addYears(tempDate.from, 3);
      const minDate = subYears(tempDate.from, 3);
      return day > maxDate || day < minDate;
    }

    return false;
  };

  const handleConfirm = () => {
    if (tempDate?.from && tempDate?.to) {
      const days = differenceInDays(tempDate.to, tempDate.from);
      if (days > 365 * 3) {
        setError("최대 3년까지만 조회 가능합니다.");
        return;
      }
    }
    onDateChange?.(tempDate);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal transition-all hover:bg-accent/50",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <span className="flex items-center gap-2">
                  {format(date.from, "PPP", { locale: ko })} -{" "}
                  {format(date.to, "PPP", { locale: ko })}
                </span>
              ) : (
                format(date.from, "PPP", { locale: ko })
              )
            ) : (
              <span>기간 선택</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 border-b bg-muted/30">
            <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              날짜 범위 선택
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              최대 3년까지 조회 가능합니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x">
            <div className="p-1">
              <Calendar
                mode="range"
                defaultMonth={monthLeft}
                month={monthLeft}
                onMonthChange={setMonthLeft}
                selected={tempDate}
                onSelect={handleDateSelect}
                numberOfMonths={1}
                locale={ko}
                disabled={isDateDisabled}
                initialFocus
              />
            </div>
            <div className="p-1">
              <Calendar
                mode="range"
                defaultMonth={monthRight}
                month={monthRight}
                onMonthChange={setMonthRight}
                selected={tempDate} // 임시 선택 날짜 사용
                onSelect={handleDateSelect} // 임시 선택 날짜 업데이트
                numberOfMonths={1}
                locale={ko}
                disabled={isDateDisabled}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border-t bg-muted/10">
            <div className="text-xs text-muted-foreground">
              {error ? (
                <span className="text-destructive font-medium">{error}</span>
              ) : tempDate?.from && tempDate?.to ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {getDurationText(tempDate.from, tempDate.to)}
                  </Badge>
                  <span>선택됨</span>
                </div>
              ) : (
                <span>시작일과 종료일을 선택하세요</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setTempDate(undefined)}
              >
                초기화
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={handleCancel}
              >
                취소
              </Button>
              <Button
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={handleConfirm}
                disabled={!tempDate?.from || !tempDate?.to}
              >
                <Check className="mr-1 h-3 w-3" />
                확인
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
