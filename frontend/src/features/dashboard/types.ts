import type { MonthlyStat, SourcePerformance } from "./api/dashboard.api";

export type { MonthlyStat, SourcePerformance };

export interface DashboardSummary {
  currentMonth: {
    revenue: number;
    expense: number;
    netProfit: number;
  };
  previousMonth: {
    revenue: number;
    expense: number;
    netProfit: number;
  };
  changeRate: {
    revenue: number | null; // percentage (e.g., 15.5 for +15.5%)
    expense: number | null;
    netProfit: number | null;
  };
}

export interface PortfolioItem {
  sourceId: string;
  name: string;
  revenue: number;
  share: number; // percentage (0-100)
}
