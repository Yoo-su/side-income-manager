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
  amount: number; // string if coming from decimal? Axios converts JSON numbers usually, but large decimals might be strings.
  date: string;
  description: string;
  isRecurring: boolean;
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
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}

export interface TransactionSummary {
  revenue: number;
  expense: number;
  netProfit: number;
}
