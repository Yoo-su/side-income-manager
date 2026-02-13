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

import type { MonthlyStat, SourcePerformance } from "../types";

interface DashboardChartSectionProps {
  className?: string;
  trendData?: MonthlyStat[]; // Updated type from any[]
  isTrendLoading: boolean;
  rankingData?: SourcePerformance[]; // Added missing prop definition
  isRankingLoading?: boolean; // Added missing prop definition
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
}: DashboardChartSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("total");

  // 비교 분석 데이터 조회 (비교 탭 활성화 시에만)
  const { data: comparisonData, isLoading: isComparisonLoading } = useQuery({
    queryKey: ["dashboard", "revenue-by-source", 6],
    queryFn: () => dashboardApi.getMonthlyRevenueBySource(6),
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
        acc[curr.sourceName].push({ x: curr.month, y: curr.revenue });
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
      "#60a5fa", // Blue
      "#34d399", // Emerald
      "#fb7185", // Rose
      "#a78bfa", // Violet
      "#fbbf24", // Amber
    ],
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      type: "category",
      labels: {
        style: { colors: "#a3a3a3", fontSize: "12px" },
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
  };

  return (
    <Card
      className={cn("border border-border bg-white shadow-none", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            월별 추이 분석
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {viewMode === "total"
              ? "최근 6개월간의 전체 수익/지출 흐름을 확인합니다."
              : "상위 5개 수입원의 매출 변동 추이를 비교합니다."}
          </p>
        </div>
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as ViewMode)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="total" className="text-xs h-6 px-2">
              전체 흐름
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs h-6 px-2">
              수입원별 비교
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {viewMode === "total" ? (
          // 전체 흐름 (TrendChart)
          isTrendLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <div className="-mt-4">
              <TrendChart data={trendData || []} minimal />
            </div>
          )
        ) : // 수입원별 비교 (Comparison)
        isComparisonLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <div className="h-[340px] w-full">
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
      </CardContent>
    </Card>
  );
}
