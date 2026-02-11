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
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
    },
    colors: ["#171717", "#e5e5e5", "#ef4444"], // 순수익 강조 (빨강? 아니면 짙은 회색?) -> 요청대로 시인성 개선.
    // 모노크롬 유지하되 순수익은 튀게? 아니면 스타일 변경.
    // 기존: ["#171717", "#d4d4d4", "#737373"]
    // User asked for "Check visibility of net profit line".
    // I will use a distinct color or darker shade. Let's stick to monochrome but make it black line on grey bars?
    // Revenue: #525252 (Dark Grey), Expense: #e5e5e5 (Light Grey), NetProfit: #000000 (Black)
    // Or Revenue: Black, Expense: Light, NetProfit: Primary Color?
    // Let's try: Revenue=Black(#171717), Expense=Light(#e5e5e5), NetProfit=Stroke(#2563eb - Blue? No monochrome).
    // Let's use a very Dark Grey for Revenue, Light for Expense, and BLACK for Net Profit with markers.

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
      strokeColors: "#000",
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

  // 순수익 라인 색상 오버라이드 (options.colors 순서: 수익, 지출, 순수익)
  // 수익: #404040, 지출: #e5e5e5, 순수익: #000000
  options.colors = ["#404040", "#e5e5e5", "#000000"];

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
