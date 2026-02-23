import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SourcePerformance } from "../types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChartFilterControl,
  type ChartFilterType,
} from "@/features/common/components/ChartFilterControl";
import type { DateRange } from "react-day-picker";

interface PortfolioSectionProps {
  data: SourcePerformance[];
  className?: string;
  selectedType: ChartFilterType;
  dateRange: DateRange | undefined;
  onFilterChange: (type: ChartFilterType, dateRange?: DateRange) => void;
}

type TabType = "revenue" | "netProfit" | "expense";

/** 통합 포트폴리오 섹션 (탭: 총수익 / 순수익 / 지출) */
export function PortfolioSection({
  data,
  className,
  selectedType,
  dateRange,
  onFilterChange,
}: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("revenue");

  // 데이터 정렬 및 필터링
  const getSortedData = (type: TabType) => {
    const filtered = data.filter((d) => {
      if (type === "revenue") return d.totalRevenue > 0;
      if (type === "expense") return d.totalExpense > 0;
      if (type === "netProfit") return d.netProfit !== 0;
      return true;
    });

    return filtered.sort((a, b) => {
      if (type === "revenue") return b.totalRevenue - a.totalRevenue;
      if (type === "expense") return b.totalExpense - a.totalExpense;
      return b.netProfit - a.netProfit;
    });
  };

  const sortedData = getSortedData(activeTab);

  // 차트 데이터 필터링 (도넛 차트는 양수만 표현 가능)
  const chartData = sortedData.filter((d) => {
    if (activeTab === "netProfit") return d.netProfit > 0;
    return true;
  });

  const getSeriesValue = (item: SourcePerformance, type: TabType) => {
    if (type === "revenue") return item.totalRevenue;
    if (type === "expense") return item.totalExpense;
    return item.netProfit;
  };

  const chartSeries = chartData.map((d) => getSeriesValue(d, activeTab));
  const chartLabels = chartData.map((d) => d.name);

  // 차트 가독성을 위해 단정하되 구분이 명확한(Muted but Distinct) 계열의 색상 배합
  const chartColors = [
    "#6366f1", // Indigo 500
    "#10b981", // Emerald 500
    "#f59e0b", // Amber 500
    "#f43f5e", // Rose 500
    "#8b5cf6", // Violet 500
    "#06b6d4", // Cyan 500
    "#64748b", // Slate 500
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: { speed: 350 },
      },
    },
    colors: chartColors.slice(0, Math.max(chartData.length, 1)),
    labels: chartLabels,
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "12px",
              color: "#64748b",
              fontWeight: 500,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 800,
              color: "#0f172a",
              formatter: (val) => `${Number(val).toLocaleString()}`,
            },
            total: {
              show: true,
              label: "합계",
              fontSize: "13px",
              color: "#64748b",
              fontWeight: 600,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                return `${total.toLocaleString()}`;
              },
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px" },
      y: { formatter: (val: number) => `${val.toLocaleString()}원` },
    },
  };

  const getValue = (item: SourcePerformance) => getSeriesValue(item, activeTab);
  const totalValue = sortedData.reduce(
    (acc, curr) => acc + (getValue(curr) > 0 ? getValue(curr) : 0),
    0,
  );

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
              수입 파이프라인
            </CardTitle>
            <p className="text-[13px] text-slate-500 font-medium tracking-wide">
              수익의 출처와 비율을 분석합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto min-w-0 max-w-full">
            <ChartFilterControl
              selectedType={selectedType}
              dateRange={dateRange}
              onFilterChange={onFilterChange}
              className="min-w-0 max-w-full"
            />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabType)}
          className="w-full"
        >
          <TabsList className="h-9 w-full bg-slate-100/80 p-0.5 rounded-xl grid grid-cols-3">
            <TabsTrigger
              value="revenue"
              className="text-xs h-8 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              총수익
            </TabsTrigger>
            <TabsTrigger
              value="netProfit"
              className="text-xs h-8 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              순수익
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className="text-xs h-8 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              지출
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 p-0 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />

        <div className="flex flex-col h-full px-6 pb-6 pt-2 relative z-10">
          <div className="shrink-0 relative w-[200px] h-[200px] mx-auto mb-6">
            {chartData.length > 0 ? (
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height="100%"
                width="100%"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm font-medium text-slate-400 bg-slate-50 rounded-full border border-dashed border-slate-200">
                데이터 없음
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {sortedData.length === 0 && (
              <p className="text-sm text-center font-medium text-slate-400 py-4">
                기록된 데이터가 없습니다.
              </p>
            )}
            {sortedData.map((item, index) => {
              const val = getValue(item);
              const percent = totalValue > 0 ? (val / totalValue) * 100 : 0;
              const barWidth = Math.max(0, Math.min(100, percent));

              return (
                <motion.div
                  key={item.sourceId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2.5 min-w-0 pt-0.5">
                      <div
                        className="w-2.5 h-2.5 rounded-[3px] shrink-0 mt-[4px]"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="font-bold text-slate-700 text-[13px] leading-relaxed break-keep">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-bold tracking-tight text-slate-800 text-[13px]">
                        {val.toLocaleString()}원
                      </span>
                      <span className="text-slate-400 text-[12px] font-semibold mt-0.5">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{
                        duration: 0.7,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
