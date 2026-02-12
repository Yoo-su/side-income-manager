import { ApiProperty } from '@nestjs/swagger';

export class SourcePerformanceDto {
  @ApiProperty({ description: '수입원 ID' })
  sourceId: string;

  @ApiProperty({ description: '수입원 이름' })
  name: string;

  @ApiProperty({ description: '순수익 (수익 - 지출)' })
  netProfit: number;

  @ApiProperty({ description: '총 매출' })
  totalRevenue: number;

  @ApiProperty({ description: '총 지출' })
  totalExpense: number;

  @ApiProperty({ description: '총 투입 시간 (시간 단위)' })
  totalHours: number;

  @ApiProperty({ description: '투자 대비 수익률 (ROI, %)' })
  roi: number;

  @ApiProperty({ description: '시간당 수익 (원)' })
  hourlyRate: number;
}
