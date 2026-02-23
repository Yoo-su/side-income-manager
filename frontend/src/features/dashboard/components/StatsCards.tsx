import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  CreditCard,
  ArrowCircleUpRight,
  ArrowCircleDownRight,
  Minus,
  Clock,
  Coins,
} from "@phosphor-icons/react";
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

/* 통계 카드 - 모던 벤토 스타일 */
export function StatsCards({ summary, month, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 메인 순수익 스켈레톤 */}
        <div className="md:col-span-6 h-[200px] rounded-3xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <Skeleton className="h-6 w-[120px]" />
          <div>
            <Skeleton className="h-12 w-[180px] mb-3" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        {/* 서브 스켈레톤 3개 */}
        <div className="md:col-span-6 grid grid-rows-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between"
            >
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
          ))}
        </div>
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

  const getDiffDisplay = (diffValue: number) => {
    if (diffValue > 0)
      return {
        isPositive: true,
        isZero: false,
        color: "text-emerald-600",
        icon: <ArrowCircleUpRight className="mr-1 h-3.5 w-3.5" />,
        val: `+${diffValue.toFixed(1)}%`,
      };
    if (diffValue < 0)
      return {
        isPositive: false,
        isZero: false,
        color: "text-rose-600",
        icon: <ArrowCircleDownRight className="mr-1 h-3.5 w-3.5" />,
        val: `${diffValue.toFixed(1)}%`,
      };
    return {
      isPositive: false,
      isZero: true,
      color: "text-slate-400",
      icon: <Minus className="mr-1 h-3.5 w-3.5" />,
      val: "0.0%",
    };
  };

  const netDiff = getDiffDisplay(diff.netProfit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
      {/* 1. Primary Card: 순수익 (가장 크게 강조) */}
      <motion.div
        className="md:col-span-6 lg:col-span-7"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="h-full min-h-[220px] relative overflow-hidden bg-slate-700 border-none shadow-md rounded-2xl group">
          <CardContent className="h-full p-8 flex flex-col justify-between relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-slate-600 rounded-xl border border-slate-500/50">
                <Coins className="h-5 w-5 text-slate-200" />
              </div>
              <span className="font-semibold text-slate-200 tracking-wide text-sm">
                {monthLabel} 순수익
              </span>
            </div>

            <div>
              <div className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-white">
                {current.netProfit >= 0 ? "+" : ""}
                {current.netProfit.toLocaleString()}
                <span className="text-xl lg:text-2xl font-semibold ml-1 text-slate-300">
                  원
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${netDiff.isPositive ? "bg-slate-600 text-emerald-400" : netDiff.isZero ? "bg-slate-600 text-slate-300" : "bg-slate-600 text-rose-400"}`}
                >
                  {netDiff.icon}
                  {netDiff.val}
                </div>
                <span className="text-sm font-medium text-slate-300">
                  지난달 대비
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. Secondary Cards: 우측 혹은 하단에 위젯 리스트 형태 */}
      <div className="md:col-span-6 lg:col-span-5 grid grid-rows-3 gap-4">
        {[
          {
            title: "매출",
            value: current.revenue,
            diffStruct: getDiffDisplay(diff.revenue),
            icon: Wallet,
            iconColor: "text-slate-500",
            iconBg: "bg-slate-100",
            prefix: "+",
          },
          {
            title: "지출",
            value: current.expense,
            diffStruct: getDiffDisplay(diff.expense),
            icon: CreditCard,
            iconColor: "text-slate-500",
            iconBg: "bg-slate-100",
            prefix: "-",
          },
          {
            title: "투입 시간",
            value: current.totalHours,
            diffStruct: getDiffDisplay(diff.totalHours),
            icon: Clock,
            iconColor: "text-slate-500",
            iconBg: "bg-slate-100",
            suffix: "h",
            prefix: "",
          },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-sm flex flex-wrap gap-x-2 gap-y-1 items-center justify-between group hover:border-slate-300 transition-all duration-300"
          >
            <div className="flex items-center gap-3 lg:gap-4 min-w-[120px]">
              <div
                className={`p-2 sm:p-2.5 rounded-xl border border-slate-200/50 ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-500">
                  {card.title}
                </span>
                <div className="flex items-center mt-0.5">
                  <span
                    className={`flex items-center text-[11px] font-bold ${card.diffStruct.color}`}
                  >
                    {card.diffStruct.icon}
                    {card.diffStruct.val}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xl font-bold text-slate-800 tabular-nums text-right tracking-tight">
              {card.prefix}
              {card.value.toLocaleString()}
              <span className="text-[13px] text-slate-400 font-medium ml-1">
                {card.suffix || "원"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
