import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { IncomeSourceService } from './income-source.service';
import {
  CreateIncomeSourceDto,
  UpdateIncomeSourceDto,
} from './dto/create-income-source.dto';
import { IncomeSource } from './entities/income-source.entity';

import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/entities/transaction.entity';

@ApiTags('Income Sources')
@Controller('income-sources')
export class IncomeSourceController {
  constructor(
    private readonly incomeSourceService: IncomeSourceService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: '수입원이 성공적으로 생성되었습니다.',
    type: IncomeSource,
  })
  create(@Body() createIncomeSourceDto: CreateIncomeSourceDto) {
    return this.incomeSourceService.create(createIncomeSourceDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: '모든 수입원 목록을 반환합니다.',
    type: [IncomeSource],
  })
  findAll() {
    return this.incomeSourceService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '특정 수입원 정보를 반환합니다.',
    type: IncomeSource,
  })
  @ApiResponse({ status: 404, description: '수입원을 찾을 수 없습니다.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeSourceService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: '수입원 정보가 수정되었습니다.',
    type: IncomeSource,
  })
  @ApiResponse({ status: 404, description: '수입원을 찾을 수 없습니다.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncomeSourceDto: UpdateIncomeSourceDto,
  ) {
    return this.incomeSourceService.update(id, updateIncomeSourceDto);
  }

  @Get(':id/transactions')
  @ApiResponse({
    status: 200,
    description: '해당 수입원의 거래 내역을 반환합니다.',
    type: [Transaction],
  })
  getTransactions(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.findAllBySourceId(id);
  }

  @Get(':id/summary')
  @ApiResponse({
    status: 200,
    description: '해당 수입원의 요약 정보를 반환합니다.',
  })
  getSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.getSummaryBySourceId(id);
  }

  @Get(':id/monthly-stats')
  @ApiResponse({
    status: 200,
    description: '해당 수입원의 월별 수익/지출 통계를 반환합니다. (기본 6개월)',
  })
  getMonthlyStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.getMonthlyStatsBySourceId(id, 6);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: '수입원이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '수입원을 찾을 수 없습니다.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeSourceService.remove(id);
  }
}
