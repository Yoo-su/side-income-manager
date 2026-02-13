import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '수입원 생성' })
  @ApiResponse({
    status: 201,
    description: '수입원이 성공적으로 생성되었습니다.',
    type: IncomeSource,
  })
  create(@Body() createIncomeSourceDto: CreateIncomeSourceDto) {
    return this.incomeSourceService.create(createIncomeSourceDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 수입원 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 수입원 목록을 반환합니다.',
    type: [IncomeSource],
  })
  findAll() {
    return this.incomeSourceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 수입원 조회' })
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
  @ApiOperation({ summary: '수입원 정보 수정' })
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
  @ApiOperation({ summary: '특정 수입원의 거래 내역 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 수입원의 거래 내역을 반환합니다.',
    type: [Transaction],
  })
  getTransactions(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.findAllBySourceId(id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: '특정 수입원의 요약 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 수입원의 요약 정보를 반환합니다.',
  })
  getSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.getSummaryBySourceId(id);
  }

  @Get(':id/monthly-stats')
  @ApiOperation({ summary: '특정 수입원의 월별 통계 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 수입원의 월별 수익/지출 통계를 반환합니다. (기본 6개월)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '최근 N개월 조회 (기본: 6)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: '시작 날짜 (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: '종료 날짜 (YYYY-MM-DD)',
  })
  getMonthlyStats(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.getMonthlyStatsBySourceId(
      id,
      limit || 6,
      startDate,
      endDate,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '수입원 삭제' })
  @ApiResponse({ status: 200, description: '수입원이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '수입원을 찾을 수 없습니다.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeSourceService.remove(id);
  }
}
