import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

interface LocalMonthlyStat {
  revenue: number;
  expense: number;
  netProfit: number;
  totalHours: number;
}

/** 통계 카드 — 전월 대비 증감 표시 및 모노크롬 디자인 */
export function StatsCards({ summary }: StatsCardsProps) {
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

  interface CardItem {
    title: string;
    value: number;
    diff: number;
    icon: LucideIcon;
    prefix: string;
    suffix?: string;
  }

  const cards: CardItem[] = [
    {
      title: "이번 달 순수익",
      value: current.netProfit,
      diff: diff.netProfit,
      icon: BarChart3,
      prefix: current.netProfit >= 0 ? "+" : "",
    },
    {
      title: "총 수익",
      value: current.revenue,
      diff: diff.revenue,
      icon: TrendingUp,
      prefix: "+",
    },
    {
      title: "총 지출",
      value: current.expense,
      diff: diff.expense,
      icon: TrendingDown,
      prefix: "-",
    },
    {
      title: "총 투입 시간",
      value: current.totalHours,
      diff: diff.totalHours,
      icon: Clock,
      prefix: "",
      suffix: "시간",
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
                <div className="text-2xl font-bold text-foreground">
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
