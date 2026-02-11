export const IncomeSourceType = {
  FREELANCE: "FREELANCE",
  PROJECT: "PROJECT",
  PASSIVE: "PASSIVE",
  ETC: "ETC",
} as const;

export type IncomeSourceType =
  (typeof IncomeSourceType)[keyof typeof IncomeSourceType];

export interface IncomeSource {
  id: string;
  name: string;
  type: IncomeSourceType;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeSourceDto {
  name: string;
  type: IncomeSourceType;
  description?: string;
}

export interface UpdateIncomeSourceDto extends Partial<CreateIncomeSourceDto> {
  isActive?: boolean;
}
