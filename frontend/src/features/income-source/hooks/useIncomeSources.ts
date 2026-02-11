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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCOME_SOURCE_KEYS.all });
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
