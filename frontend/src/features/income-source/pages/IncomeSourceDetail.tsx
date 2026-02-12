import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { incomeSourceApi } from "../api/income-source.api";
import {
  useTransactions,
  useTransactionSummary,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "../../transaction/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type CreateTransactionDto,
  type Transaction,
  TransactionType,
} from "../../transaction/types";
import { TransactionList } from "../../transaction/components/TransactionList";
import { TransactionFormDialog } from "../../transaction/components/TransactionFormDialog";
import { MonthlyMiniChart } from "../components/MonthlyMiniChart";
import { useState } from "react";
import { IncomeSourceTypeLabel } from "@/shared/constants/localization";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** 수입원 상세 페이지 — 요약 + 미니차트 + 거래 관리 */
export function IncomeSourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const { data: incomeSource, isLoading: isSourceLoading } = useQuery({
    queryKey: ["income-sources", id],
    queryFn: () => incomeSourceApi.getOne(id!),
    enabled: !!id,
  });

  const { data: monthlyStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["income-sources", id, "monthly-stats"],
    queryFn: () => incomeSourceApi.getMonthlyStats(id!),
    enabled: !!id,
  });

  const { data: transactions, isLoading: isTxLoading } = useTransactions(id!);
  const { data: summary, isLoading: isSummaryLoading } = useTransactionSummary(
    id!,
  );

  const createTransactionFn = useCreateTransaction();
  const updateTransactionFn = useUpdateTransaction();
  const deleteTransactionFn = useDeleteTransaction();

  // 필터 상태
  const [filter, setFilter] = useState<"ALL" | TransactionType>("ALL");

  // 거래 내역 필터링
  const filteredTransactions = transactions?.filter((tx) => {
    if (filter === "ALL") return true;
    return tx.type === filter;
  });

  if (isSourceLoading || isTxLoading || isSummaryLoading || isStatsLoading) {
    return (
      <div className="flex h-full items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!incomeSource) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        수입원을 찾을 수 없습니다.
      </div>
    );
  }

  const handleCreateOrUpdateTransaction = (data: {
    type: TransactionType;
    amount: number;
    date: string;
    description: string;
  }) => {
    if (!id) return;

    if (editingTransaction) {
      updateTransactionFn.mutate(
        {
          id: editingTransaction.id,
          data: {
            type: data.type,
            amount: Number(data.amount),
            date: data.date,
            description: data.description,
          },
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingTransaction(null);
          },
        },
      );
    } else {
      const dto: CreateTransactionDto = {
        incomeSourceId: id,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        description: data.description,
      };

      createTransactionFn.mutate(dto, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = (txId: string) => {
    if (confirm("정말 이 거래 내역을 삭제하시겠습니까?")) {
      deleteTransactionFn.mutate(txId);
    }
  };

  /** 요약 카드 데이터 */
  const summaryCards = [
    {
      title: "순수익",
      value: Number(summary?.netProfit || 0),
      prefix: (summary?.netProfit || 0) >= 0 ? "+" : "",
      emphasis: true,
      format: (val: number) => `${val.toLocaleString()}원`,
      className: "text-blue-600",
    },
    {
      title: "총 수익",
      value: Number(summary?.revenue || 0),
      prefix: "+",
      emphasis: false,
      format: (val: number) => `${val.toLocaleString()}원`,
      className: "text-emerald-600",
    },
    {
      title: "총 지출",
      value: Number(summary?.expense || 0),
      prefix: "-",
      emphasis: false,
      format: (val: number) => `${val.toLocaleString()}원`,
      className: "text-rose-600",
    },
    {
      title: "시간당 수익",
      value: Number(summary?.hourlyRate || 0),
      prefix: "",
      emphasis: false,
      format: (val: number) =>
        val > 0 ? `${val.toLocaleString()}원` : "해당 없음",
      subtext: summary?.totalHours
        ? `${summary.totalHours}시간 투입`
        : undefined,
    },
    {
      title: "투자 대비 수익률",
      value: Number(summary?.roi || 0),
      prefix: "",
      emphasis: summary?.roi && summary.roi > 0,
      format: (val: number) => `${val.toFixed(1)}%`,
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8 p-8 lg:p-10 max-w-5xl">
        {/* 뒤로 가기 */}
        <Button
          variant="ghost"
          className="pl-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>

        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {incomeSource.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 mr-2">
                {IncomeSourceTypeLabel[incomeSource.type]}
              </span>
              {incomeSource.description}
            </p>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 text-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            기록 추가
          </Button>
        </div>

        {/* 상단: 요약 카드 + 미니 차트 */}
        <div className="grid grid-cols-1 gap-6">
          {/* 분석 지표 카드 (5칸 그리드) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {summaryCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <Card className="border border-border bg-white shadow-none h-full flex flex-col justify-center px-0">
                  <CardHeader className="pb-1 pt-4 text-center">
                    <CardTitle className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-4 pt-1">
                    <div
                      className={cn(
                        "text-lg lg:text-xl font-bold tracking-tight whitespace-nowrap",
                        card.className // Use specific color if defined
                          ? card.className
                          : card.emphasis
                            ? "text-foreground"
                            : "text-muted-foreground",
                      )}
                    >
                      {card.prefix}
                      {card.format(card.value)}
                    </div>
                    {card.subtext && (
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {card.subtext}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 미니 차트 */}
          <div className="w-full">
            <MonthlyMiniChart data={monthlyStats || []} />
          </div>
        </div>

        {/* 거래 내역 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              최근 거래 내역
            </h2>
            {/* 필터 탭 */}
            <div className="flex p-1 bg-neutral-100 rounded-lg">
              <button
                onClick={() => setFilter("ALL")}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  filter === "ALL"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                전체
              </button>
              <button
                onClick={() => setFilter(TransactionType.REVENUE)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  filter === TransactionType.REVENUE
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                수익
              </button>
              <button
                onClick={() => setFilter(TransactionType.EXPENSE)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  filter === TransactionType.EXPENSE
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                지출
              </button>
            </div>
          </div>

          <TransactionList
            transactions={filteredTransactions || []}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
          />
        </div>

        <TransactionFormDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingTransaction(null);
          }}
          onSubmit={handleCreateOrUpdateTransaction}
          initialData={editingTransaction}
          isLoading={
            createTransactionFn.isPending || updateTransactionFn.isPending
          }
        />
      </div>
    </PageTransition>
  );
}
