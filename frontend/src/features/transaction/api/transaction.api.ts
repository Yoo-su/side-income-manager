import { instance } from "@/shared/lib/axios";
import type {
  CreateTransactionDto,
  Transaction,
  TransactionSummary,
  UpdateTransactionDto,
} from "../types";

export const transactionApi = {
  getAll: async (sourceId?: string): Promise<Transaction[]> => {
    const params = sourceId ? { sourceId } : {};
    const response = await instance.get("/transactions", { params });
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await instance.post("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionDto,
  ): Promise<Transaction> => {
    const response = await instance.patch(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/transactions/${id}`);
  },

  getSummaryBySource: async (sourceId: string): Promise<TransactionSummary> => {
    const response = await instance.get(`/income-sources/${sourceId}/summary`);
    return response.data;
  },
};
