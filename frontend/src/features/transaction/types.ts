export const TransactionType = {
  REVENUE: "REVENUE",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  incomeSourceId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  isRecurring: boolean;
  hours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  incomeSourceId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  isRecurring?: boolean;
  hours?: number;
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export interface TransactionSummary {
  revenue: number;
  expense: number;
  netProfit: number;
  totalHours: number;
  hourlyRate: number;
  roi: number;
}
