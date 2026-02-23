import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";
import { TrendChart } from "./TrendChart";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ChartFilterControl,
  type ChartFilterType,
} from "@/features/common/components/ChartFilterControl";
import type { DateRange } from "react-day-picker";

import type { MonthlyStat, SourcePerformance } from "../types";

interface DashboardChartSectionProps {
  className?: string;
  trendData?: MonthlyStat[];
  isTrendLoading: boolean;
  rankingData?: SourcePerformance[];
  isRankingLoading?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  filterType: ChartFilterType;
  dateRange?: DateRange;
  onFilterChange: (type: ChartFilterType, range?: DateRange) => void;
}

type ViewMode = "total" | "comparison";

/**
 * 월별 추이 분석 및 수입원별 매출 비교 차트 섹션
 * - 전체 흐름: 월별 수익/지출 추이 (TrendChart)
 * - 비교 분석: 상위 수입원간 매출 변화 비교 (LineChart)
 */
export function DashboardChartSection({
  className,
  trendData,
  isTrendLoading,
  startDate,
  endDate,
  limit,
  filterType,
  dateRange,
  onFilterChange,
}: DashboardChartSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("total");

  // 비교 분석 데이터 조회 (비교 탭 활성화 시에만)
  const { data: comparisonData, isLoading: isComparisonLoading } = useQuery({
    queryKey: ["dashboard", "revenue-by-source", limit, startDate, endDate],
    queryFn: () =>
      dashboardApi.getMonthlyRevenueBySource(limit, startDate, endDate),
    enabled: viewMode === "comparison",
    staleTime: 5 * 60 * 1000,
  });

  // 비교 차트용 Series 데이터 변환
  const getComparisonSeries = () => {
    if (!comparisonData) return [];

    // 수입원별 그룹화
    const grouped = comparisonData.reduce(
      (acc, curr) => {
        if (!acc[curr.sourceName]) {
          acc[curr.sourceName] = [];
        }
        acc[curr.sourceName].push({
          x:
            curr.month.length === 7
              ? curr.month.substring(2).replace("-", ".")
              : curr.month,
          y: curr.revenue,
        });
        return acc;
      },
      {} as Record<string, { x: string; y: number }[]>,
    );

    return Object.entries(grouped).map(([name, data]) => ({
      name,
      data: data.sort((a, b) => a.x.localeCompare(b.x)), // 날짜순 정렬
    }));
  };

  const comparisonSeries = getComparisonSeries();

  const comparisonOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      animations: { enabled: true },
      zoom: { enabled: false },
    },
    colors: [
      "#6366f1", // Indigo 500
      "#10b981", // Emerald 500
      "#f59e0b", // Amber 500
      "#f43f5e", // Rose 500
      "#06b6d4", // Cyan 500
    ],
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      type: "category",
      labels: {
        style: { colors: "#a3a3a3", fontSize: "12px" },
        rotate: -45,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#a3a3a3", fontSize: "12px" },
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    grid: {
      borderColor: "#f5f5f5",
      strokeDashArray: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}원`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 250 },
          xaxis: {
            labels: {
              style: { fontSize: "10px" },
              rotate: -45,
              rotateAlways: true,
              hideOverlappingLabels: true,
            },
          },
          stroke: { width: 2 },
        },
      },
    ],
  };

  return (
    <Card
      className={cn(
        "border border-slate-200 bg-white shadow-sm h-full flex flex-col rounded-2xl overflow-hidden",
        className,
      )}
    >
      <CardHeader className="flex flex-col gap-4 pb-4 pt-6 px-6 relative z-10 w-full">
        <div className="flex flex-wrap items-start justify-between gap-4 w-full">
          <div className="space-y-1.5 min-w-[200px]">
            <CardTitle className="text-lg font-bold tracking-tight text-slate-800">
              수익 성장 그래프
            </CardTitle>
            <p className="text-[13px] text-slate-500 font-medium tracking-wide">
              {viewMode === "total"
                ? "내 수입이 어떻게 성장하고 있는지 확인해보세요."
                : "주요 프로젝트들의 성과 변화를 비교해봅니다."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto min-w-0 max-w-full">
            <ChartFilterControl
              selectedType={filterType}
              dateRange={dateRange}
              onFilterChange={onFilterChange}
              className="min-w-0 max-w-full"
            />
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as ViewMode)}
              className="w-full sm:w-auto min-w-0"
            >
              <TabsList className="h-9 w-full bg-slate-100/80 p-0.5 rounded-xl">
                <TabsTrigger
                  value="total"
                  className="text-xs h-8 px-4 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  전체 흐름
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="text-xs h-8 px-4 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  항목별 비교
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none" />
        <div className="px-6 pb-6 h-full relative z-10">
          {viewMode === "total" ? (
            // 전체 흐름 (TrendChart)
            isTrendLoading ? (
              <Skeleton className="h-[250px] md:h-[350px] w-full" />
            ) : (
              <div className="mt-4 h-[280px] md:h-[380px] w-full">
                <TrendChart data={trendData || []} minimal />
              </div>
            )
          ) : // 수입원별 비교 (Comparison)
          isComparisonLoading ? (
            <Skeleton className="h-[300px] md:h-[400px] w-full rounded-2xl mx-6 mt-4 opacity-50" />
          ) : (
            <div className="h-[280px] md:h-[380px] w-full pt-4">
              {comparisonSeries.length > 0 ? (
                <ReactApexChart
                  options={comparisonOptions}
                  series={comparisonSeries}
                  type="line"
                  height={340}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  비교할 데이터가 충분하지 않습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
