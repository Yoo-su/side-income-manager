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
import { Skeleton } from "@/components/ui/skeleton";

import type { ChartFilterType } from "@/features/common/components/ChartFilterControl";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // 추이 차트 필터 상태
  const [chartFilterType, setChartFilterType] = useState<ChartFilterType>("1y");
  const [chartDateRange, setChartDateRange] = useState<DateRange | undefined>();

  // 포트폴리오 차트 필터 상태
  const [portfolioFilterType, setPortfolioFilterType] =
    useState<ChartFilterType>("1y");
  const [portfolioDateRange, setPortfolioDateRange] = useState<
    DateRange | undefined
  >();

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

    return { limit, startDate: undefined, endDate: undefined };
  };

  const {
    limit: chartLimit,
    startDate: chartStartDate,
    endDate: chartEndDate,
  } = getChartParams();

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

  const handleChartFilterChange = (
    type: ChartFilterType,
    range?: DateRange,
  ) => {
    setChartFilterType(type);
    if (range) setChartDateRange(range);
  };

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

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] md:min-h-screen p-4 md:p-6 lg:p-10 max-w-[1920px] mx-auto space-y-8 pb-10">
        {/* 헤더 영역 (커스텀 인사말 및 필터링) */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pt-2">
          <div className="space-y-1.5">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              대시보드
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[15px] text-slate-500 font-medium"
            >
              나의 성장과 파이프라인 변화를 직관적으로 확인하세요.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md p-1.5 rounded-[1.25rem] shadow-sm border border-slate-200/50"
          >
            <DateFilter
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </motion.div>
        </header>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
          {/* 메인 통계 및 추세 (Left/Main Panel - 8 columns on extra large screens) */}
          <div className="lg:col-span-8 space-y-6 flex flex-col min-w-0">
            <StatsCards
              summary={summary}
              month={month}
              isLoading={isSummaryLoading}
            />

            <div className="flex-1">
              <DashboardChartSection
                trendData={trendData}
                isTrendLoading={isTrendLoading}
                rankingData={rankingData}
                isRankingLoading={isRankingLoading}
                startDate={chartStartDate}
                endDate={chartEndDate}
                limit={chartLimit}
                filterType={chartFilterType}
                dateRange={chartDateRange}
                onFilterChange={handleChartFilterChange}
              />
            </div>
          </div>

          {/* 서브 지표 및 포트폴리오 (Right Panel - 4 columns on extra large screens) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col min-w-0">
            {isRankingLoading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <Skeleton className="h-28 rounded-3xl" />
                <Skeleton className="h-28 rounded-3xl" />
              </div>
            ) : (
              <InsightCards data={rankingData || []} />
            )}

            <div className="flex-1">
              {isRankingLoading ? (
                <Skeleton className="h-[400px] w-full rounded-3xl" />
              ) : (
                <PortfolioSection
                  data={rankingData || []}
                  selectedType={portfolioFilterType}
                  dateRange={portfolioDateRange}
                  onFilterChange={handlePortfolioFilterChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
