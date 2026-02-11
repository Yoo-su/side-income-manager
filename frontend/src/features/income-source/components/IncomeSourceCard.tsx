import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { type IncomeSource } from "../types";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IncomeSourceTypeLabel } from "@/shared/constants/localization";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUpdateIncomeSource } from "../hooks/useIncomeSources";

interface IncomeSourceCardProps {
  item: IncomeSource;
  onEdit: (item: IncomeSource) => void;
  onDelete: (id: string) => void;
}

/** 수입원 카드 — 모노크롬 디자인 + 호버 모션 + 활성 토글 */
export const IncomeSourceCard = ({
  item,
  onEdit,
  onDelete,
}: IncomeSourceCardProps) => {
  const navigate = useNavigate();
  const updateMutation = useUpdateIncomeSource();

  const handleToggleActive = (checked: boolean) => {
    updateMutation.mutate({ id: item.id, data: { isActive: checked } });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "relative cursor-pointer border border-border bg-white shadow-none transition-shadow hover:shadow-md",
          !item.isActive && "opacity-75 bg-neutral-50",
        )}
        onClick={() => navigate(`/income-sources/${item.id}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              {/* 유형 뱃지 — 모노크롬 */}
              <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                {IncomeSourceTypeLabel[item.type]}
              </span>
              <CardTitle className="text-base font-semibold text-foreground">
                {item.name}
              </CardTitle>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(item)}
              >
                <Edit2 size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">
            {item.description || "설명이 없습니다."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div
            className="flex items-center justify-between mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-muted-foreground/60">
              <span className="font-medium mr-2">상태</span>
              <span
                className={cn(
                  "font-semibold",
                  item.isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.isActive ? "활성" : "비활성"}
              </span>
            </div>

            {/* 활성/비활성 토글 */}
            <Switch
              checked={item.isActive}
              onCheckedChange={handleToggleActive}
              className="scale-90"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
