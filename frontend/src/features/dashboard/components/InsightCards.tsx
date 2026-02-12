import type { SourcePerformance } from "../types";
import { Trophy, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightCardsProps {
  data: SourcePerformance[];
}

export function InsightCards({ data }: InsightCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-sm text-muted-foreground">
        설정된 기간에 해당하는 데이터가 없습니다.
      </div>
    );
  }

  // 1. 최고 수익왕 (순수익 최대)
  const topProfit = [...data].sort((a, b) => b.netProfit - a.netProfit)[0];
  // 2. 최고 효율왕 (시간당 수익 최대, 시간 > 0)
  const topEfficiency = [...data]
    .filter((d) => d.totalHours > 0)
    .sort((a, b) => b.hourlyRate - a.hourlyRate)[0];
  // 3. 최고 수익률왕 (ROI 최대, 비용 > 0)
  const topRoi = [...data]
    .filter((d) => d.totalExpense > 0)
    .sort((a, b) => b.roi - a.roi)[0];

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-4 md:grid-cols-3"
    >
      {/* 1. 수익왕 (Revenue) */}
      <motion.div variants={item}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              최고 수익왕
            </CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {topProfit ? (
              <>
                <div className="text-xl font-bold text-foreground">
                  {topProfit.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  순수익{" "}
                  <span className="font-medium text-foreground">
                    {topProfit.netProfit.toLocaleString()}원
                  </span>
                </p>
                <div className="mt-2 text-xs text-muted-foreground/80">
                  매출 {topProfit.totalRevenue.toLocaleString()}원
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground py-4">
                데이터가 부족합니다.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. 효율왕 (Hourly Rate) */}
      <motion.div variants={item}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              최고 효율왕
            </CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {topEfficiency ? (
              <>
                <div className="text-xl font-bold text-foreground">
                  {topEfficiency.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  시간당{" "}
                  <span className="font-medium text-foreground">
                    {topEfficiency.hourlyRate.toLocaleString()}원
                  </span>
                </p>
                <div className="mt-2 text-xs text-muted-foreground/80">
                  {topEfficiency.totalHours}시간 투입
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground py-4">
                데이터가 부족합니다.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. 수익률왕 (ROI) */}
      <motion.div variants={item}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              최고 수익률왕
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            {topRoi ? (
              <>
                <div className="text-xl font-bold text-foreground">
                  {topRoi.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ROI{" "}
                  <span className="font-medium text-foreground">
                    {topRoi.roi}%
                  </span>
                </p>
                <div className="mt-2 text-xs text-muted-foreground/80">
                  비용 {topRoi.totalExpense.toLocaleString()}원
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground py-4">
                데이터가 부족합니다.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
