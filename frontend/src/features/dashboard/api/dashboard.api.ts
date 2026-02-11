import { instance } from "@/shared/lib/axios";
import type { DashboardSummary, PortfolioItem } from "../types";

export interface MonthlyStat {
  month: string;
  revenue: number;
  expense: number;
  netProfit: number;
  year?: number;
}

export interface SourcePerformance {
  sourceId: string;
  name: string;
  netProfit: number;
  totalRevenue: number;
  totalExpense: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await instance.get("/dashboard/summary");
    return response.data;
  },

  getPortfolio: async (): Promise<PortfolioItem[]> => {
    const response = await instance.get("/dashboard/portfolio");
    return response.data;
  },

  getMonthlyStats: async (
    year?: number,
    limit?: number,
  ): Promise<MonthlyStat[]> => {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;
    else if (year) params.year = year;

    const response = await instance.get("/dashboard/monthly-stats", {
      params,
    });
    return response.data;
  },

  getSourceRanking: async (): Promise<SourcePerformance[]> => {
    const response = await instance.get("/dashboard/source-ranking");
    return response.data;
  },
};
