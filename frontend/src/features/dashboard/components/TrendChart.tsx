import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyStat } from "../types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  data: MonthlyStat[];
  className?: string;
}

/** 월별 수익/지출 추이 + 순수익 라인 — ApexCharts Mixed Chart */
export function TrendChart({ data, className }: TrendChartProps) {
  const categories = data.map((d) => `${d.month}`);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: false }, // 마우스 스크롤 줌 비활성화
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
    },
    // 수익: Indigo, 지출: Rose, 순수익: Emerald
    colors: ["#6366f1", "#f43f5e", "#10b981"],

    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    stroke: {
      width: [0, 0, 3], // Thicker line
      curve: "smooth",
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: "#10b981",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories,
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
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}원`,
      },
      theme: "light",
      style: { fontSize: "13px" },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      labels: { colors: "#737373" },
      markers: { size: 6, shape: "circle" as const },
      itemMargin: { horizontal: 12 },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    { name: "수익", type: "bar", data: data.map((d) => d.revenue) },
    { name: "지출", type: "bar", data: data.map((d) => d.expense) },
    { name: "순수익", type: "line", data: data.map((d) => d.netProfit) },
  ];

  return (
    <Card
      className={cn("border border-border bg-white shadow-none", className)}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          월별 수익 추이 (최근 6개월)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          수익/지출 막대와 순수익(라인) 흐름을 확인하세요.
        </p>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={340}
        />
      </CardContent>
    </Card>
  );
}
