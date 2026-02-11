import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StatsCards } from "../components/StatsCards";
import { TrendChart } from "../components/TrendChart";
import { PortfolioSection } from "../components/PortfolioSection";
import { dashboardApi } from "../api/dashboard.api";
import { Loader2 } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";

export function DashboardPage() {
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
  });

  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ["dashboard", "trend"],
    // 최근 6개월 데이터 조회
    queryFn: () => dashboardApi.getMonthlyStats(undefined, 6),
  });

  const { data: rankingData, isLoading: isRankingLoading } = useQuery({
    queryKey: ["dashboard", "ranking"],
    queryFn: dashboardApi.getSourceRanking,
  });

  if (isSummaryLoading || isTrendLoading || isRankingLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 p-8 pt-6 lg:p-10 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            대시보드
          </h2>
        </div>

        {/* 1. 핵심 지표 카드 (4열) */}
        {summary && <StatsCards summary={summary} />}

        <div className="flex flex-col gap-6">
          {/* 2. 월별 추이 차트 (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TrendChart data={trendData || []} />
          </motion.div>

          {/* 3. 수익 포트폴리오 (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PortfolioSection data={rankingData || []} />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
