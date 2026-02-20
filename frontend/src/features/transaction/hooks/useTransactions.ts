import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { transactionApi } from "../api/transaction.api";
import type { CreateTransactionDto, UpdateTransactionDto } from "../types";

export function useTransactions(sourceId: string, limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ["transactions", sourceId, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      transactionApi.getAll(sourceId, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 있으면 next page index 반환, 없으면 undefined
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    enabled: !!sourceId,
  });
}

export function useTransactionSummary(sourceId: string) {
  return useQuery({
    queryKey: ["transactions", "summary", sourceId],
    queryFn: () => transactionApi.getSummaryBySource(sourceId),
    enabled: !!sourceId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.incomeSourceId, "infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", "summary", variables.incomeSourceId],
      });
      // 대시보드 데이터도 갱신
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        refetchType: "all",
      });
      // 수입원 월별 통계 갱신
      queryClient.invalidateQueries({
        queryKey: ["income-sources", variables.incomeSourceId, "monthly-stats"],
      });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      transactionApi.update(id, data),
    onSuccess: (data) => {
      const sourceId = data.incomeSourceId; // 백엔드 엔티티에 있음

      if (sourceId) {
        queryClient.invalidateQueries({
          queryKey: ["transactions", sourceId, "infinite"],
        });
        queryClient.invalidateQueries({
          queryKey: ["transactions", "summary", sourceId],
        });
        queryClient.invalidateQueries({
          queryKey: ["income-sources", sourceId, "monthly-stats"],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        refetchType: "all",
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        refetchType: "all",
      });
    },
  });
}
