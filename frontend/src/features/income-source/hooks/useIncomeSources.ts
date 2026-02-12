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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUpdateIncomeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncomeSourceDto }) =>
      incomeSourceApi.update(id, data),
    // Optimistic Update
    onMutate: async ({ id, data }) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: INCOME_SOURCE_KEYS.all });

      // 2. Snapshot previous data
      const previousIncomeSources = queryClient.getQueryData(
        INCOME_SOURCE_KEYS.all,
      );

      // 3. Optimistically update
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
      // 4. Rollback on error
      if (context?.previousIncomeSources) {
        queryClient.setQueryData(
          INCOME_SOURCE_KEYS.all,
          context.previousIncomeSources,
        );
      }
    },
    onSettled: () => {
      // 5. Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: INCOME_SOURCE_KEYS.all });
      // Invalidate dashboard queries as inactive status affects them
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
