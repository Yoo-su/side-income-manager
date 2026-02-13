import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import { PartialType } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: '수입원 ID', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  incomeSourceId: string;

  @ApiProperty({
    enum: TransactionType,
    description: '거래 유형 (수익/지출)',
    example: TransactionType.REVENUE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: '금액', example: 150000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: '거래 날짜', example: '2023-10-27' })
  @IsDateString()
  date: string; // ISO 8601 날짜 문자열

  @ApiProperty({ description: '설명', example: '10월 애드센스 정산' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: '정기 결제 여부', example: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: '투입 시간 (시간 단위)', example: 2.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
