import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();

  return (
    <DayPicker
      captionLayout="dropdown"
      fromYear={1900}
      toYear={currentYear}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 top-2", // 절대 위치 복원
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 top-2", // 절대 위치 복원
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 aria-selected:rounded-none hover:bg-accent hover:text-accent-foreground", // 선택된 날짜 사각형 유지
        ),
        range_start: "day-range-start aria-selected:rounded-l-md", // 범위 시작일
        range_end: "day-range-end aria-selected:rounded-r-md", // 범위 종료일
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Dropdown: ({
          value,
          onChange,
          options,
        }: {
          value?: string | number | readonly string[];
          onChange?: React.ChangeEventHandler<HTMLSelectElement>;
          options?: Array<{ label: string; value: string | number }>;
        }) => {
          const selected = options?.find((option) => option.value === value);
          const handleValueChange = (newValue: string) => {
            if (onChange) {
              const event = {
                target: { value: newValue },
              } as React.ChangeEvent<HTMLSelectElement>;
              onChange(event);
            }
          };

          return (
            <Select value={value?.toString()} onValueChange={handleValueChange}>
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  // 년/월 선택창 사이 간격 (mx-1)
                  "h-7 w-fit gap-1 pl-2 pr-1 py-0 font-medium focus:ring-0 shadow-none mx-1",
                )}
              >
                <SelectValue>{selected?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-[200px]">
                <ScrollArea className="h-56">
                  {options?.map((option, id: number) => (
                    <SelectItem
                      key={`${option.value}-${id}`}
                      value={option.value?.toString() ?? ""}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
        Chevron: (props) => {
          if (props.orientation === "left") {
            return (
              <ChevronLeft
                className={cn("h-4 w-4", props.className)}
                {...props}
              />
            );
          }
          return (
            <ChevronRight
              className={cn("h-4 w-4", props.className)}
              {...props}
            />
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
