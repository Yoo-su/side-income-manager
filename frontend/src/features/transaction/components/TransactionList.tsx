import { type Transaction, TransactionType } from "../../transaction/types";
import { format } from "date-fns";
import { Trash2, ArrowUp, ArrowDown, Edit2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

/** 거래 내역 리스트 — 수정/삭제 기능 포함 */
export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
        <p className="text-sm">아직 거래 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx, index) => {
        const isRevenue = tx.type === TransactionType.REVENUE;

        return (
          <motion.div
            key={tx.id}
            className="flex items-center justify-between rounded-xl border border-border bg-white px-5 py-4 transition-colors hover:bg-neutral-50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.04,
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            {/* 좌측: 아이콘 + 정보 */}
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                {isRevenue ? (
                  <ArrowUp className="h-4 w-4 text-neutral-700" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-neutral-400" />
                )}
              </div>
              <div className="cursor-pointer" onClick={() => onEdit(tx)}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground hover:underline">
                    {tx.description}
                  </p>
                  {tx.hours && Number(tx.hours) > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                      <Clock size={12} />
                      {Number(tx.hours)}시간
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/60">
                  {format(new Date(tx.date), "yyyy-MM-dd")}
                </p>
              </div>
            </div>

            {/* 우측: 금액 + 액션 */}
            <div className="flex items-center gap-3">
              <span
                className={
                  isRevenue
                    ? "text-sm font-semibold text-emerald-600"
                    : "text-sm font-semibold text-rose-600"
                }
              >
                {isRevenue ? "+" : "-"} {Number(tx.amount).toLocaleString()}원
              </span>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground/40 hover:text-foreground"
                  onClick={() => onEdit(tx)}
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground/40 hover:text-foreground"
                  onClick={() => onDelete(tx.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
