import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { MonthlyStat } from "../../dashboard/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyMiniChartProps {
  data: MonthlyStat[];
}

/** 수입원 상세 — 월별 수익 미니 차트 */
export function MonthlyMiniChart({ data }: MonthlyMiniChartProps) {
  // "2026-01" -> "1월" 형태로 간결하게 표시
  const categories = data.map((d) => {
    const parts = d.month.split("-");
    const monthNum = parts.length === 2 ? parseInt(parts[1], 10) : d.month;
    return `${monthNum}월`;
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      // 차트 내부 패딩 — y축 숨김 시 남는 좌측 공간 제거
      sparkline: { enabled: false },
    },
    // 수익: Indigo, 지출: Rose
    colors: ["#6366f1", "#f43f5e"],
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#a3a3a3", fontSize: "10px" },
        rotate: 0,
        trim: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
      labels: { show: false },
    },
    grid: {
      show: false,
      padding: { left: 0, right: 0 },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}원`,
      },
      theme: "light",
      style: { fontSize: "12px" },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      markers: { size: 5, shape: "circle" as const },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    { name: "수익", data: data.map((d) => d.revenue) },
    { name: "지출", data: data.map((d) => d.expense) },
  ];

  return (
    <Card className="border border-border bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          월별 추이
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
        />
      </CardContent>
    </Card>
  );
}
