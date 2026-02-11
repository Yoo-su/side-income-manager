import { IncomeSourceType } from "../../features/income-source/types";
import { TransactionType } from "../../features/transaction/types";

export const IncomeSourceTypeLabel: Record<IncomeSourceType, string> = {
  [IncomeSourceType.FREELANCE]: "외주/프리랜서",
  [IncomeSourceType.PROJECT]: "개인 프로젝트",
  [IncomeSourceType.PASSIVE]: "금융/배당",
  [IncomeSourceType.ETC]: "기타",
};

export const TransactionTypeLabel: Record<TransactionType, string> = {
  [TransactionType.REVENUE]: "수익",
  [TransactionType.EXPENSE]: "지출",
};
