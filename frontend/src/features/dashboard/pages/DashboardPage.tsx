import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StatsCards } from "../components/StatsCards";
import { TrendChart } from "../components/TrendChart";
import { PortfolioSection } from "../components/PortfolioSection";
import { InsightCards } from "../components/InsightCards";
import { EfficiencyTreemap } from "../components/EfficiencyTreemap";
import { dashboardApi } from "../api/dashboard.api";
import { PageTransition } from "@/components/layout/PageTransition";

import { DateFilter } from "../components/DateFilter";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const { data: summary } = useQuery({
    queryKey: ["dashboard", "summary", year, month],
    queryFn: () => dashboardApi.getSummary(year, month),
    placeholderData: (previousData) => previousData,
  });

  const { data: trendData } = useQuery({
    queryKey: ["dashboard", "trend"], // 월별 추이는 연간 데이터이므로 필터링 제외 (혹은 year만 전달?)
    // 최근 6개월 데이터 조회
    queryFn: () => dashboardApi.getMonthlyStats(undefined, 6), // 최근 6개월 데이터 조회
  });

  const { data: rankingData } = useQuery({
    queryKey: ["dashboard", "ranking", year], // 랭킹/포트폴리오는 '연간' 기준으로 변경 (user request: filtering limited to cards)
    queryFn: () => dashboardApi.getSourceRanking(year),
    placeholderData: (previousData) => previousData,
  });

  return (
    <PageTransition>
      <div className="space-y-6 p-8 pt-6 lg:p-10 max-w-[1600px] mx-auto">
        {/* 페이지 헤더 */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            대시보드
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            수입과 지출 흐름을 한눈에 파악하고 인사이트를 얻으세요.
          </p>
        </div>
        {/* 1. 핵심 지표 카드 (Monthly Summary - Filter Affected) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                월별 요약
              </h3>
              <span className="text-sm text-muted-foreground">
                ({selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월)
              </span>
            </div>
            <DateFilter
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {summary && <StatsCards summary={summary} month={month} />}
          </motion.div>
        </div>

        <Separator className="my-2" />

        {/* 2. 인사이트 카드 (Yearly Highlights) */}
        <InsightCards data={rankingData || []} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3. 월별 추이 차트 (Trend - Last 6 Months) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TrendChart data={trendData || []} />
          </motion.div>

          {/* 4. 효율성 트리맵 (Yearly Efficiency) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EfficiencyTreemap data={rankingData || []} />
          </motion.div>
        </div>

        {/* 5. 수익 포트폴리오 (Yearly Portfolio) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PortfolioSection data={rankingData || []} />
        </motion.div>
      </div>
    </PageTransition>
  );
}
