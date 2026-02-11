import { instance } from "@/shared/lib/axios";
import type { MonthlyStat } from "../../dashboard/types";
import type { CreateIncomeSourceDto, IncomeSource } from "../types";

export interface UpdateIncomeSourceDto extends Partial<CreateIncomeSourceDto> {
  isActive?: boolean;
}

export const incomeSourceApi = {
  getAll: async (): Promise<IncomeSource[]> => {
    const response = await instance.get("/income-sources");
    return response.data;
  },

  getOne: async (id: string): Promise<IncomeSource> => {
    const response = await instance.get(`/income-sources/${id}`);
    return response.data;
  },

  create: async (data: CreateIncomeSourceDto): Promise<IncomeSource> => {
    const response = await instance.post("/income-sources", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateIncomeSourceDto,
  ): Promise<IncomeSource> => {
    const response = await instance.patch(`/income-sources/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/income-sources/${id}`);
  },

  getMonthlyStats: async (id: string): Promise<MonthlyStat[]> => {
    const response = await instance.get(`/income-sources/${id}/monthly-stats`);
    return response.data;
  },
};
