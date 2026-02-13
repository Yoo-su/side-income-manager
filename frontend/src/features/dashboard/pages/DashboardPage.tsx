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

import { ChartFilterControl } from "@/features/common/components/ChartFilterControl";
import type { ChartFilterType } from "@/features/common/components/ChartFilterControl";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // 차트 필터 상태
  const [chartFilterType, setChartFilterType] = useState<ChartFilterType>("1y");
  const [chartDateRange, setChartDateRange] = useState<DateRange | undefined>();

  // 필터에 따른 API 파라미터 계산
  const getChartParams = () => {
    if (
      chartFilterType === "custom" &&
      chartDateRange?.from &&
      chartDateRange?.to
    ) {
      return {
        startDate: format(chartDateRange.from, "yyyy-MM-dd"),
        endDate: format(chartDateRange.to, "yyyy-MM-dd"),
        limit: undefined,
      };
    }

    let limit = 6;
    if (chartFilterType === "3m") limit = 3;
    if (chartFilterType === "1y") limit = 12;
    if (chartFilterType === "3y") limit = 36;
    if (chartFilterType === "all") limit = 999; // 대시보드 차트는 limit 방식이라 충분히 큰 수로 설정

    return { limit, startDate: undefined, endDate: undefined };
  };

  const {
    limit: chartLimit,
    startDate: chartStartDate,
    endDate: chartEndDate,
  } = getChartParams();

  // 포트폴리오 필터 상태
  const [portfolioFilterType, setPortfolioFilterType] =
    useState<ChartFilterType>("1y");
  const [portfolioDateRange, setPortfolioDateRange] = useState<
    DateRange | undefined
  >();

  const getPortfolioParams = () => {
    if (
      portfolioFilterType === "custom" &&
      portfolioDateRange?.from &&
      portfolioDateRange?.to
    ) {
      return {
        startDate: format(portfolioDateRange.from, "yyyy-MM-dd"),
        endDate: format(portfolioDateRange.to, "yyyy-MM-dd"),
      };
    }

    let limit = 6;
    if (portfolioFilterType === "3m") limit = 3;
    if (portfolioFilterType === "1y") limit = 12;
    if (portfolioFilterType === "3y") limit = 36;
    if (portfolioFilterType === "all") {
      return { startDate: undefined, endDate: undefined };
    }

    // TODO: 백엔드가 limit 대신 startDate/endDate만 받으므로 변환 필요
    // 현재 날짜 기준 limit 개월 전 1일 ~ 현재
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - limit + 1);
    start.setDate(1);

    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  };

  const { startDate: pfStartDate, endDate: pfEndDate } = getPortfolioParams();

  const handlePortfolioFilterChange = (
    type: ChartFilterType,
    range?: DateRange,
  ) => {
    setPortfolioFilterType(type);
    if (range) setPortfolioDateRange(range);
  };

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboard", "summary", year, month],
    queryFn: () => dashboardApi.getSummary(year, month),
  });

  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: [
      "dashboard",
      "trend",
      chartFilterType,
      chartStartDate,
      chartEndDate,
    ],
    queryFn: () =>
      dashboardApi.getMonthlyStats(
        undefined,
        chartLimit,
        chartStartDate,
        chartEndDate,
      ),
  });

  const { data: rankingData, isLoading: isRankingLoading } = useQuery({
    // 랭킹/포트폴리오는 연간 기준 -> 이제 필터 기준
    queryKey: [
      "dashboard",
      "ranking",
      portfolioFilterType,
      pfStartDate,
      pfEndDate,
    ],
    queryFn: () =>
      dashboardApi.getSourceRanking(
        undefined,
        undefined,
        pfStartDate,
        pfEndDate,
      ),
    placeholderData: (previousData) => previousData,
  });

  const handleFilterChange = (type: ChartFilterType, range?: DateRange) => {
    setChartFilterType(type);
    if (range) setChartDateRange(range);
  };

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
        {/* 1. 핵심 지표 카드 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                이번 달 성과
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
            <StatsCards
              summary={summary}
              month={month}
              isLoading={isSummaryLoading}
            />
          </motion.div>
        </div>

        <Separator className="my-2" />

        {/* 2. 인사이트 카드 */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              주요 프로젝트 현황
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
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                기간별 수익 흐름
              </h3>
            </div>
            <ChartFilterControl
              onFilterChange={handleFilterChange}
              defaultType="1y"
            />
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
                startDate={chartStartDate}
                endDate={chartEndDate}
                limit={chartLimit}
              />
            </motion.div>
          </div>
        </div>

        {/* 5. 수익 포트폴리오 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isRankingLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            <PortfolioSection
              data={rankingData || []}
              onFilterChange={handlePortfolioFilterChange}
              defaultType="1y"
            />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
