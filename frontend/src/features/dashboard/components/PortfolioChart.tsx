import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { PortfolioItem } from "../types";

interface PortfolioChartProps {
  data: PortfolioItem[];
}

/** 포트폴리오 차트 — 수입원별 비중 (Pie/Donut) */
export function PortfolioChart({ data }: PortfolioChartProps) {
  const series = data.map((item) => item.revenue);
  const labels = data.map((item) => item.name);

  // 모노크롬 색상 팔레트
  const monochromeColors = [
    "#171717",
    "#404040",
    "#525252",
    "#737373",
    "#a3a3a3",
    "#d4d4d4",
    "#e5e5e5",
  ];

  const options: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
    },
    colors: monochromeColors.slice(0, data.length || 1),
    labels: labels,
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"],
        fontWeight: 500,
      },
      dropShadow: { enabled: false },
    },
    stroke: {
      width: 1,
      colors: ["#ffffff"],
    },
    legend: {
      position: "bottom",
      fontSize: "13px",
      labels: {
        colors: "#737373",
      },
      markers: {
        size: 6,
        shape: "circle" as const,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}원`,
      },
      theme: "light",
      style: { fontSize: "13px" },
    },
  };

  return (
    <Card className="border border-border bg-white shadow-none lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          수익 포트폴리오
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          전체 수익 중 각 수입원이 차지하는 비중입니다.
        </p>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="flex justify-center py-4">
            <ReactApexChart
              options={options}
              series={series}
              type="pie"
              width={350}
            />
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            데이터가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
