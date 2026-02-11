import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncomeSourceType } from '../entities/income-source.entity';
import { PartialType } from '@nestjs/swagger';

export class CreateIncomeSourceDto {
  @ApiProperty({ description: '수입원 이름', example: '블로그 수익' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    enum: IncomeSourceType,
    description: '수입원 유형',
    example: IncomeSourceType.PASSIVE,
  })
  @IsEnum(IncomeSourceType)
  type: IncomeSourceType;

  @ApiPropertyOptional({
    description: '수입원 설명',
    example: '구글 애드센스 수익',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateIncomeSourceDto extends PartialType(CreateIncomeSourceDto) {
  @ApiPropertyOptional({ description: '활성화 여부', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
