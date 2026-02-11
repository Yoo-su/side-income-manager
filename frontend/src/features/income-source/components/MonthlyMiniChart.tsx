import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { MonthlyStat } from "../../dashboard/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyMiniChartProps {
  data: MonthlyStat[];
}

/** 수입원 상세 — 월별 수익 미니 차트 */
export function MonthlyMiniChart({ data }: MonthlyMiniChartProps) {
  const categories = data.map((d) => `${d.month}월`);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
    },
    colors: ["#171717", "#e5e5e5"],
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#a3a3a3", fontSize: "11px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
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
