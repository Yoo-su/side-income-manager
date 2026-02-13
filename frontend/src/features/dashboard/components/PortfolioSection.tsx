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
  onFilterChange?: (type: ChartFilterType, range?: DateRange) => void;
  defaultType?: ChartFilterType;
}

type TabType = "revenue" | "netProfit" | "expense";

/** 통합 포트폴리오 섹션 (탭: 총수익 / 순수익 / 지출) */
export function PortfolioSection({
  data,
  className,
  onFilterChange,
  defaultType,
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

  // 차트 컬러 팔레트 (파스텔 톤)
  const chartColors = [
    "#60a5fa", // Blue
    "#34d399", // Emerald
    "#fb7185", // Rose
    "#a78bfa", // Violet
    "#fbbf24", // Amber
    "#2dd4bf", // Teal
    "#f472b6", // Pink
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      animations: { enabled: true },
    },
    colors: chartColors.slice(0, Math.max(chartData.length, 1)),
    labels: chartLabels,
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: true, fontSize: "12px", color: "#a3a3a3" },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              color: "#171717",
              formatter: (val) => `${Number(val).toLocaleString()}`,
            },
            total: {
              show: true,
              label: "합계",
              fontSize: "12px",
              color: "#a3a3a3",
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
    stroke: { width: 2, colors: ["#ffffff"] },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}원`,
      },
    },
  };

  const getValue = (item: SourcePerformance) => getSeriesValue(item, activeTab);
  const totalValue = sortedData.reduce(
    (acc, curr) => acc + (getValue(curr) > 0 ? getValue(curr) : 0),
    0,
  );

  return (
    <Card
      className={cn("border border-border bg-white shadow-none", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            나의 수입 파이프라인
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            내 수입이 어디서 나오는지 한눈에 확인하세요.
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabType)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="revenue" className="text-xs h-6 px-2">
              총 수익
            </TabsTrigger>
            <TabsTrigger value="netProfit" className="text-xs h-6 px-2">
              순수익
            </TabsTrigger>
            <TabsTrigger value="expense" className="text-xs h-6 px-2">
              지출
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <div className="px-6 pb-2 flex justify-end">
        {onFilterChange && (
          <ChartFilterControl
            onFilterChange={onFilterChange}
            defaultType={defaultType || "1y"}
            className="scale-90 origin-right"
          />
        )}
      </div>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="shrink-0 relative w-[240px] h-[240px]">
            {chartData.length > 0 ? (
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={240}
                width={240}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground bg-neutral-50 rounded-full">
                데이터 없음
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-3 min-w-0">
            {sortedData.length === 0 && (
              <p className="text-sm text-muted-foreground">
                데이터가 없습니다.
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
                  <div className="flex justify-between items-center text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="font-medium text-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="font-semibold text-foreground">
                        {val.toLocaleString()}원
                      </span>
                      <span className="text-muted-foreground w-8 text-right text-[11px] pt-0.5">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
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
