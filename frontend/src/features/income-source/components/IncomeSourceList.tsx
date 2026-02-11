import {
  useIncomeSources,
  useDeleteIncomeSource,
} from "../hooks/useIncomeSources";
import { IncomeSourceCard } from "./IncomeSourceCard";
import { type IncomeSource } from "../types";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { IncomeSourceFormDialog } from "./IncomeSourceFormDialog";
import { Button } from "@/components/ui/button";

/** 수입원 리스트 — 카드 그리드 + CRUD */
export const IncomeSourceList = () => {
  const { data: incomeSources, isLoading, isError } = useIncomeSources();
  const deleteMutation = useDeleteIncomeSource();
  const [editingItem, setEditingItem] = useState<IncomeSource | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-muted-foreground text-center py-10">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 + 추가 버튼 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          내 수입원
        </h2>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 text-sm"
        >
          <Plus size={16} className="mr-1.5" />새 수입원 추가
        </Button>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {incomeSources?.map((item) => (
          <IncomeSourceCard
            key={item.id}
            item={item}
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />
        ))}
        {incomeSources?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
            <p className="text-sm">등록된 수입원이 없습니다.</p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              새로운 수입원을 추가해보세요.
            </p>
          </div>
        )}
      </div>

      {/* 생성 다이얼로그 */}
      <IncomeSourceFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* 수정 다이얼로그 */}
      {editingItem && (
        <IncomeSourceFormDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          initialData={editingItem}
        />
      )}
    </div>
  );
};
