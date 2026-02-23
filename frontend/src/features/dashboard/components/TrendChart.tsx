import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyStat } from "../types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  data: MonthlyStat[];
  className?: string;
  minimal?: boolean;
}

/**
 * 월별 수익/지출 추이 차트 (Mixed Chart)
 * - 막대: 수익, 지출
 * - 라인: 순수익
 */
export function TrendChart({
  data,
  className,
  minimal = false,
}: TrendChartProps) {
  const categories = data.map((d) =>
    d.month.length === 7
      ? d.month.substring(2).replace("-", ".")
      : `${d.month}`,
  );

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: false }, // 마우스 스크롤 줌 비활성화
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    // 수익(막대) / 지출(막대) / 순수익(라인)
    // 차트 가독성을 위해 구분이 확실하지만 톤다운된 색상(Muted but Distinct) 적용
    colors: ["#34d399", "#fb7185", "#6366f1"],

    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    stroke: {
      width: [0, 0, 4], // Thicker line for Net Profit
      curve: "smooth",
    },
    fill: {
      opacity: [0.85, 0.85, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: "#475569",
      strokeWidth: 3,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 500 },
        rotate: -45,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 500 },
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
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
      fontWeight: 500,
      labels: { colors: "#475569" },
      markers: { size: 7, shape: "circle" as const },
      itemMargin: { horizontal: 16 },
    },
    dataLabels: { enabled: false },
    responsive: [
      {
        breakpoint: 768,
        options: {
          xaxis: {
            labels: {
              style: { fontSize: "10px" },
              rotate: -45,
              rotateAlways: true,
              hideOverlappingLabels: true,
            },
          },
        },
      },
    ],
  };

  const series = [
    { name: "수익", type: "bar", data: data.map((d) => d.revenue) },
    { name: "지출", type: "bar", data: data.map((d) => d.expense) },
    { name: "순수익", type: "line", data: data.map((d) => d.netProfit) },
  ];

  if (minimal) {
    return (
      <div className={cn("w-full h-full", className)}>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height="100%"
        />
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden",
        className,
      )}
    >
      <CardHeader className="pt-6 px-6 pb-2">
        <CardTitle className="text-lg font-bold tracking-tight text-slate-800">
          월별 수익 추이
        </CardTitle>
        <p className="text-[13px] text-slate-500 font-medium tracking-wide">
          수익, 지출 규모와 순수익 흐름을 확인하세요.
        </p>
      </CardHeader>
      <CardContent className="p-0 px-2 pb-2">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={360}
        />
      </CardContent>
    </Card>
  );
}
