import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { MonthlyStat } from "../../dashboard/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyMiniChartProps {
  data: MonthlyStat[];
}

/** 수입원 상세 — 월별 수익 미니 차트 (복합 차트: 막대 + 꺾은선) */
export function MonthlyMiniChart({ data }: MonthlyMiniChartProps) {
  // "2026-01" -> "1월" 형태로 간결하게 표시
  const categories = data.map((d) => {
    const parts = d.month.split("-");
    const monthNum = parts.length === 2 ? parseInt(parts[1], 10) : d.month;
    return `${monthNum}월`;
  });

  const options: ApexOptions = {
    chart: {
      type: "line", // 복합 차트를 위해 line으로 변경
      toolbar: { show: false },
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      sparkline: { enabled: false },
    },
    // 수익(Emerald), 지출(Rose), 순수익(Blue)
    colors: ["#34d399", "#f43f5e", "#3b82f6"],
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 2,
      },
    },
    stroke: {
      width: [0, 0, 3], // 막대는 선 없음, 꺾은선은 3px
      curve: "smooth",
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#a3a3a3", fontSize: "10px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
      labels: { show: false },
    },
    grid: {
      show: true,
      borderColor: "#f5f5f5",
      strokeDashArray: 4,
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
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
      fontSize: "11px",
      markers: { size: 5, shape: "circle" as const },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: "수익",
      type: "column",
      data: data.map((d) => d.revenue),
    },
    {
      name: "지출",
      type: "column",
      data: data.map((d) => d.expense),
    },
    {
      name: "순수익",
      type: "line",
      data: data.map((d) => d.netProfit),
    },
  ];

  return (
    <Card className="border border-border bg-white shadow-none">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          월별 재무 흐름
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] p-2">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height="100%"
        />
      </CardContent>
    </Card>
  );
}
