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

export function DashboardChartSection({
  className,
  trendData,
  isTrendLoading,
}: DashboardChartSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("total");

  // Fetch comparison data only when needed (or prefetch)
  const { data: comparisonData, isLoading: isComparisonLoading } = useQuery({
    queryKey: ["dashboard", "revenue-by-source", 6],
    queryFn: () => dashboardApi.getMonthlyRevenueBySource(6),
    enabled: viewMode === "comparison",
    staleTime: 5 * 60 * 1000,
  });

  // Prepare Series for Comparison Chart
  const getComparisonSeries = () => {
    if (!comparisonData) return [];

    // Group by source
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
      data: data.sort((a, b) => a.x.localeCompare(b.x)), // Ensure chronological order
    }));
  };

  const comparisonSeries = getComparisonSeries();

  // Extract all unique months for x-axis categories if needed,
  // but ApexCharts with datetime/category needs consistent x-axis.
  // Assuming API returns data for all months for simplicity, or we let ApexCharts handle missing points.

  const comparisonOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      animations: { enabled: true },
      zoom: { enabled: false }, // 마우스 스크롤 줌 비활성화
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
      type: "category", // Using month strings
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
          // Total View
          isTrendLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            // Re-use TrendChart logic but render directly or wrap
            <div className="-mt-4">
              {/* TrendChart has its own Card wraper, we might want to extract just the chart or render it here.
                   However, existing TrendChart component renders a Card. 
                   Ideally, we should refactor TrendChart to export just the Chart, 
                   OR, we simply render the inner part here.
                   
                   For now, let's render the inner chart logic if we want to remove the nested Card border,
                   OR we can just render existing TrendChart and accept double card or refactor.
                   
                   Let's Refactor TrendChart lightly to accept 'minimal' prop? 
                   Or just copy the chart options here for simplicity since we want full width.
               */}
              <TrendChart data={trendData || []} minimal />
            </div>
          )
        ) : // Comparison View
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
