import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SourcePerformance } from "../types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SourceRankingProps {
  data: SourcePerformance[];
  className?: string;
}

/** 수입원별 수익 비중 도넛 차트 + 랭킹 리스트 */
export function SourceRanking({ data, className }: SourceRankingProps) {
  // 도넛 차트용 데이터
  const chartSeries = data.map((d) => d.totalRevenue);
  const chartLabels = data.map((d) => d.name);

  // 모노크롬 색상 팔레트 (도넛 조각별)
  const monochromeColors = [
    "#171717",
    "#404040",
    "#737373",
    "#a3a3a3",
    "#d4d4d4",
    "#e5e5e5",
    "#f5f5f5",
  ];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Pretendard Variable, sans-serif",
      background: "transparent",
    },
    colors: monochromeColors.slice(0, data.length),
    labels: chartLabels,
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: {
              fontSize: "13px",
              color: "#737373",
            },
            value: {
              fontSize: "18px",
              fontWeight: 700,
              color: "#171717",
              formatter: (val: string) => `${Number(val).toLocaleString()}원`,
            },
            total: {
              show: true,
              label: "전체 수익",
              fontSize: "12px",
              color: "#a3a3a3",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                return `${total.toLocaleString()}원`;
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
      theme: "light",
      style: { fontSize: "13px" },
    },
  };

  return (
    <Card
      className={cn("border border-border bg-white shadow-none", className)}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          수익 포트폴리오
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          수입원별 매출 비중을 확인하세요.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 도넛 차트 */}
        {data.length > 0 ? (
          <ReactApexChart
            options={options}
            series={chartSeries}
            type="donut"
            height={220}
          />
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            데이터가 없습니다.
          </div>
        )}

        {/* 랭킹 리스트 */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.sourceId}
              className="flex items-center"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {/* 색상 인디케이터 */}
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    monochromeColors[index % monochromeColors.length],
                }}
              />

              {/* 이름 + 매출 */}
              <div className="ml-3 flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>
              </div>

              {/* 순수익 */}
              <span className="ml-3 shrink-0 text-sm font-semibold text-foreground">
                {item.netProfit >= 0 ? "+" : ""}
                {item.netProfit.toLocaleString()}원
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
