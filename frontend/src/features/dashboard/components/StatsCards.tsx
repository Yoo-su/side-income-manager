import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { DashboardSummary } from "../types";

interface StatsCardsProps {
  summary?: DashboardSummary;
  month?: number;
  isLoading?: boolean;
}

interface LocalMonthlyStat {
  revenue: number;
  expense: number;
  netProfit: number;
  totalHours: number;
}

/** 통계 카드 — 전월 대비 증감 표시 및 모노크롬 디자인 */
export function StatsCards({ summary, month, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border bg-white shadow-none">
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
    );
  }

  const current = (summary?.currentMonth || {
    revenue: 0,
    expense: 0,
    netProfit: 0,
    totalHours: 0,
  }) as unknown as LocalMonthlyStat;

  const diff = (summary?.changeRate || {
    revenue: 0,
    expense: 0,
    netProfit: 0,
    totalHours: 0,
  }) as unknown as LocalMonthlyStat;

  const monthLabel = month ? `${month}월` : "이번 달";

  interface CardItem {
    title: string;
    value: number;
    diff: number;
    icon: LucideIcon;
    prefix: string;
    suffix?: string;
    valueClassName?: string;
  }

  const cards: CardItem[] = [
    {
      title: `${monthLabel} 순수익`,
      value: current.netProfit,
      diff: diff.netProfit,
      icon: BarChart3,
      prefix: current.netProfit >= 0 ? "+" : "",
      valueClassName: "text-blue-600", // 순수익: 신뢰의 블루
    },
    {
      title: `${monthLabel} 총 수익`,
      value: current.revenue,
      diff: diff.revenue,
      icon: TrendingUp,
      prefix: "+",
      valueClassName: "text-emerald-600", // 수익: 긍정의 에메랄드
    },
    {
      title: `${monthLabel} 총 지출`,
      value: current.expense,
      diff: diff.expense,
      icon: TrendingDown,
      prefix: "-",
      valueClassName: "text-rose-600", // 지출: 경고의 로즈
    },
    {
      title: `${monthLabel} 투입 시간`,
      value: current.totalHours,
      diff: diff.totalHours,
      icon: Clock,
      prefix: "",
      suffix: "시간",
      valueClassName: "text-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const diffValue = card.diff ?? 0;
        const isPositive = diffValue > 0;
        const isNegative = diffValue < 0;
        const isZero = diffValue === 0;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <Card className="border border-border bg-white shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${card.valueClassName || "text-foreground"}`}
                >
                  {card.prefix}
                  {card.value.toLocaleString()}
                  {card.suffix ? card.suffix : "원"}
                </div>
                <div className="flex items-center mt-1 text-xs">
                  {isPositive && (
                    <span className="flex items-center text-foreground font-medium">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      {diffValue.toFixed(1)}%
                    </span>
                  )}
                  {isNegative && (
                    <span className="flex items-center text-muted-foreground font-medium">
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                      {Math.abs(diffValue).toFixed(1)}%
                    </span>
                  )}
                  {isZero && (
                    <span className="flex items-center text-muted-foreground font-medium">
                      <Minus className="mr-1 h-3 w-3" />
                      0.0%
                    </span>
                  )}
                  <span className="ml-1.5 text-muted-foreground/60">
                    지난달 대비
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
