import type { SourcePerformance } from "../types";
import { Medal, Lightbulb } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface InsightCardsProps {
  data: SourcePerformance[];
}

/** 미니멀 위젯형 인사이트 카드 */
export function InsightCards({ data }: InsightCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full min-h-[100px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 backdrop-blur-sm p-6 text-[13px] font-medium text-slate-400">
        기록된 데이터가 부족합니다.
      </div>
    );
  }

  // 1. 최고 수익왕 (순수익 최대)
  const topProfit = [...data].sort((a, b) => b.netProfit - a.netProfit)[0];
  // 2. 최고 효율왕 (시간당 수익 최대, 시간 > 0)
  const topEfficiency = [...data]
    .filter((d) => d.totalHours > 0)
    .sort((a, b) => b.hourlyRate - a.hourlyRate)[0];

  const item = {
    hidden: { y: 15, opacity: 0 },
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
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full"
    >
      {/* 1. 수익왕 (Revenue) */}
      <motion.div variants={item} className="h-full">
        <div className="h-full flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
            <Medal className="w-24 h-24 text-slate-600" />
          </div>
          <div className="flex items-center gap-2.5 mb-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Medal className="h-4 w-4 text-slate-500" />
            </div>
            <span className="text-[13px] font-bold text-slate-500 tracking-wide">
              최고 수익
            </span>
          </div>

          <div className="mt-auto relative z-10 space-y-1">
            {topProfit ? (
              <>
                <div className="text-[15px] sm:text-[17px] font-bold text-slate-800 tracking-tight leading-snug break-keep">
                  {topProfit.name}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  {topProfit.netProfit.toLocaleString()}원
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">데이터 부족</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. 효율왕 (Hourly Rate) */}
      <motion.div variants={item} className="h-full">
        <div className="h-full flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
            <Lightbulb className="w-24 h-24 text-slate-600" />
          </div>
          <div className="flex items-center gap-2.5 mb-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-slate-500" />
            </div>
            <span className="text-[13px] font-bold text-slate-500 tracking-wide">
              시급 효율왕
            </span>
          </div>

          <div className="mt-auto relative z-10 space-y-1">
            {topEfficiency ? (
              <>
                <div className="text-[15px] sm:text-[17px] font-bold text-slate-800 tracking-tight leading-snug break-keep">
                  {topEfficiency.name}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  {topEfficiency.hourlyRate.toLocaleString()}원{" "}
                  <span className="text-[11px] text-slate-400 font-medium tracking-normal">
                    / h
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">데이터 부족</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
