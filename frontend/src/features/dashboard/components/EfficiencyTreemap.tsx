import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { SourcePerformance } from "../types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { cn } from "@/lib/utils";

interface EfficiencyTreemapProps {
  data: SourcePerformance[];
  className?: string;
}

export function EfficiencyTreemap({ data, className }: EfficiencyTreemapProps) {
  const validData = data.filter((d) => d.netProfit > 0);

  if (!data || data.length === 0 || validData.length === 0) {
    return (
      <Card
        className={cn("border border-border bg-white shadow-none", className)}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            수익 효율 트리맵
          </CardTitle>
          <CardDescription>데이터가 없습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            표시할 데이터가 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }
  // data: [
  //   {
  //     x: 'Name',
  //     y: Value (Size - Net Profit),
  //     fillColor: Color (Efficiency based?) - ApexCharts supports colorScale or manual color
  //   }
  // ]

  // Strategy:
  // Size (y): Net Profit (If negative, we might need to handle it. Treemaps usually show positive magnitude.
  //   Let's filter out negative profit or use absolute value with a different color?
  //   Standard treemaps are for part-to-whole or comparing magnitudes. Negative profit is tricky.
  //   Let's assume for now we visualize "Revenue Generative" sources primarily, or just Net Profit > 0.
  //   If Net Profit <= 0, they might not show up well or need a separate "Loss" chart.
  //   Let's filter for Profit > 0 for this "Efficiency" visualization to find the "Cash Cows".

  // Color Scale Strategy:
  // We want efficiency (hourlyRate) to drive the color.
  // Low Hourly Rate -> Light Blue
  // High Hourly Rate -> Dark Blue

  // 1. Find Min/Max Hourly Rate
  const maxRate = Math.max(...validData.map((d) => d.hourlyRate), 0);
  const minRate = Math.min(...validData.map((d) => d.hourlyRate), 0);

  // Helper to generate color shade based on rate (Simple approach: discrete categories or just let ApexCharts handle ranges?)
  // ApexCharts has `plotOptions.treemap.colorScale`.

  // We need to map the "efficiency" to the color, NOT the size.
  // But ApexCharts Treemap basic series matches 'y' to size.
  // For 'color', we can use `colorScale`. But `colorScale` maps the 'y' value to color usually in Heatmaps.
  // In Treemap, "distributed" creates different colors for each block.
  // To map a *different* metric to color, we might need `custom` logic or ranges.

  // Advanced: ApexCharts Treemap supports `dataPointIndex` in colors function? Or we can explicitly set `fillColor` per point.

  const seriesDataWithColor = validData
    .map((item) => {
      // Normalize rate 0..1
      const range = maxRate - minRate || 1;
      const normalized = (item.hourlyRate - minRate) / range;

      // Interpolate color from #e0e7ff (Indigo-100) to #3730a3 (Indigo-900)
      // Or just simple thresholds.
      // Let's use a simple 5-step opacity or strictly calculated hex if possible.
      // Easy way: predefined palette index? No.
      // Let's use a function to calculate Hex color.

      // Simple Blue Interpolation
      // Min (Light): 224, 231, 255 (#e0e7ff)
      // Max (Dark): 49, 46, 129 (#312e81)

      const r = Math.round(224 + (49 - 224) * normalized);
      const g = Math.round(231 + (46 - 231) * normalized);
      const b = Math.round(255 + (129 - 255) * normalized);

      const color = `rgb(${r}, ${g}, ${b})`;

      return {
        x: item.name,
        y: item.netProfit,
        fillColor: color,
        // Meta data for tooltip
        goals: [
          {
            name: "Hourly Rate",
            value: item.hourlyRate,
            strokeWidth: 0,
            strokeHeight: 0,
            strokeColor: "transparent",
          },
        ],
      };
    })
    .sort((a, b) => b.y - a.y); // Sort by profit so biggest are top-left

  const options: ApexOptions = {
    chart: {
      type: "treemap",
      toolbar: { show: false },
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
      animations: { enabled: true },
    },
    title: {
      text: "",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      offsetY: -3,
      formatter: function (text, op) {
        return [text, op.value.toLocaleString()];
      },
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
        shadeIntensity: 0.5,
      },
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        // Note: The dataPointIndex matches the sorted array we passed to series.
        // Make sure validData sort order matches seriesDataWithColor sort order.
        // Yes, we sorted seriesDataWithColor by Y.
        // But we need to make sure we can find the original 'item' correctly.

        // Safer way: match by 'x' (name) from w.globals.seriesNames or w.globals.labels? Try w.globals.initialSeries[seriesIndex].data[dataPointIndex].x
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
        const originalItem = validData.find((v) => v.name === dataPoint.x);

        if (!originalItem) return "";

        return `
          <div class="rounded-lg border bg-background p-2 shadow-sm min-w-[140px]">
            <div class="flex flex-col gap-1">
              <span class="text-sm font-bold text-foreground">${originalItem.name}</span>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>순수익:</span>
                <span class="text-right font-medium text-foreground">${originalItem.netProfit.toLocaleString()}원</span>
                <span>시간당:</span>
                <span class="text-right font-medium text-foreground">${originalItem.hourlyRate.toLocaleString()}원</span>
                <span>ROI:</span>
                <span class="text-right font-medium text-foreground">${originalItem.roi}%</span>
                <span>투입시간:</span>
                <span class="text-right font-medium text-foreground">${originalItem.totalHours}시간</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.9,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    },
  };

  const series = [
    {
      data: seriesDataWithColor,
    },
  ];

  return (
    <Card
      className={cn("border border-border bg-white shadow-none", className)}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          수익 효율 트리맵
        </CardTitle>
        <CardDescription>
          사각형이 클수록 고수익, 색이 진할수록 고효율
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="treemap"
          height={320}
        />
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#e0e7ff] rounded-sm"></div>
            <span>저효율</span>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-[#e0e7ff] to-[#312e81] rounded-full"></div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#312e81] rounded-sm"></div>
            <span>고효율</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
