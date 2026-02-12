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
  totalHours: number;
  roi: number;
  hourlyRate: number;
}

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
