import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incomeSourceApi } from "../api/income-source.api";
import {
  type CreateIncomeSourceDto,
  type UpdateIncomeSourceDto,
} from "../types";

export const INCOME_SOURCE_KEYS = {
  all: ["income-sources"] as const,
};

export function useIncomeSources() {
  return useQuery({
    queryKey: INCOME_SOURCE_KEYS.all,
    queryFn: incomeSourceApi.getAll,
  });
}

export function useCreateIncomeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncomeSourceDto) => incomeSourceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOME_SOURCE_KEYS.all });
    },
  });
}

export function useUpdateIncomeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncomeSourceDto }) =>
      incomeSourceApi.update(id, data),
    // 낙관적 업데이트 (Optimistic Update)
    onMutate: async ({ id, data }) => {
      // 1. 진행 중인 요청 취소
      await queryClient.cancelQueries({ queryKey: INCOME_SOURCE_KEYS.all });

      // 2. 이전 데이터 스냅샷 저장
      const previousIncomeSources = queryClient.getQueryData(
        INCOME_SOURCE_KEYS.all,
      );

      // 3. 캐시 데이터 즉시 업데이트
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(INCOME_SOURCE_KEYS.all, (old: any[]) => {
        if (!old) return [];
        return old.map((source) =>
          source.id === id ? { ...source, ...data } : source,
        );
      });

      return { previousIncomeSources };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (_err, _newTodo, context: any) => {
      // 4. 에러 발생 시 롤백
      if (context?.previousIncomeSources) {
        queryClient.setQueryData(
          INCOME_SOURCE_KEYS.all,
          context.previousIncomeSources,
        );
      }
    },
    onSettled: () => {
      // 5. 관련 쿼리 무효화 (최신 데이터 동기화)
      queryClient.invalidateQueries({ queryKey: INCOME_SOURCE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["income-source-performance"],
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-stats"] });
    },
  });
}

export function useDeleteIncomeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incomeSourceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOME_SOURCE_KEYS.all });
    },
  });
}
