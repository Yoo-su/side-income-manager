import { instance } from "@/shared/lib/axios";
import type {
  DashboardSummary,
  MonthlyStat,
  PortfolioItem,
  SourcePerformance,
} from "../types";

export const dashboardApi = {
  getSummary: async (
    year?: number,
    month?: number,
  ): Promise<DashboardSummary> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    const response = await instance.get(
      `/dashboard/summary?${params.toString()}`,
    );
    return response.data;
  },

  getPortfolio: async (
    year?: number,
    month?: number,
  ): Promise<PortfolioItem[]> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    const response = await instance.get(
      `/dashboard/portfolio?${params.toString()}`,
    );
    return response.data;
  },

  getMonthlyStats: async (
    year?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<MonthlyStat[]> => {
    const response = await instance.get("/dashboard/monthly-stats", {
      params: { year, limit, startDate, endDate },
    });
    return response.data;
  },

  getSourceRanking: async (
    year?: number,
    month?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<SourcePerformance[]> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const response = await instance.get(
      `/dashboard/source-ranking?${params.toString()}`,
    );
    return response.data;
  },
  getMonthlyRevenueBySource: async (
    limit?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<
    {
      month: string;
      sourceId: string;
      sourceName: string;
      revenue: number;
    }[]
  > => {
    const response = await instance.get(
      "/dashboard/monthly-revenue-by-source",
      {
        params: { limit, startDate, endDate },
      },
    );
    return response.data;
  },
};
