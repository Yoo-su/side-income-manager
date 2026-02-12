import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StatsCards } from "../components/StatsCards";
import { PortfolioSection } from "../components/PortfolioSection";
import { InsightCards } from "../components/InsightCards";
import { DashboardChartSection } from "../components/DashboardChartSection";
import { dashboardApi } from "../api/dashboard.api";
import { PageTransition } from "@/components/layout/PageTransition";

import { DateFilter } from "../components/DateFilter";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboard", "summary", year, month],
    queryFn: () => dashboardApi.getSummary(year, month),
    placeholderData: (previousData) => previousData,
  });

  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ["dashboard", "trend"], // 월별 추이는 연간 데이터이므로 필터링 제외 (혹은 year만 전달?)
    // 최근 6개월 데이터 조회
    queryFn: () => dashboardApi.getMonthlyStats(undefined, 6), // 최근 6개월 데이터 조회
  });

  const { data: rankingData, isLoading: isRankingLoading } = useQuery({
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
            {isSummaryLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[120px] mb-2" />
                      <Skeleton className="h-3 w-[80px]" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              summary && <StatsCards summary={summary} month={month} />
            )}
          </motion.div>
        </div>

        <Separator className="my-2" />

        {/* 2. 인사이트 카드 (Yearly Highlights) */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              수입원 인사이트
            </h3>
          </div>

          {isRankingLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-[120px] mb-2" />
                    <Skeleton className="h-3 w-[150px] mb-1" />
                    <Skeleton className="h-3 w-[100px]" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <InsightCards data={rankingData || []} />
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              월별 추이 및 효율 분석
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <DashboardChartSection
                trendData={trendData}
                isTrendLoading={isTrendLoading}
                rankingData={rankingData}
                isRankingLoading={isRankingLoading}
              />
            </motion.div>
          </div>
        </div>

        {/* 5. 수익 포트폴리오 (Yearly Portfolio) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isRankingLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            <PortfolioSection data={rankingData || []} />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
