import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';
import { SourcePerformanceDto } from './dto/source-performance.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('summary')
  @ApiOperation({
    summary: '대시보드 요약 조회 (이번 달/전월 비교)',
  })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async getSummary(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.transactionService.getDashboardSummary(year, month);
  }

  @Get('portfolio')
  @ApiOperation({
    summary: '수입원별 수익 포트폴리오 비중 조회',
  })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async getPortfolio(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.transactionService.getPortfolioDistribution(year, month);
  }

  @Get('monthly-stats')
  @ApiOperation({
    summary: '월별 통계 조회 (연도별, 최근 N개월, 또는 특정 기간)',
    description:
      'year, limit, 또는 startDate/endDate를 통해 월별 통계를 조회합니다.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: '조회할 연도',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '최근 N개월 조회 (year보다 우선순위 높음)',
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
  async getMonthlyStats(
    @Query('year') year?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.transactionService.getMonthlyStats(
        undefined,
        startDate,
        endDate,
      );
    }
    if (limit) {
      return this.transactionService.getRecentMonthlyStats(limit);
    }
    const targetYear = year || new Date().getFullYear();
    return this.transactionService.getMonthlyStats(targetYear);
  }

  @Get('source-ranking')
  @ApiOperation({
    summary: '수입원별 수익 랭킹 및 효율 지표 조회',
    description:
      '순수익, 매출, 비용뿐만 아니라 시간당 수익, ROI 등 효율성 지표를 포함하여 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '수입원별 성과 리스트',
    type: [SourcePerformanceDto],
  })
  async getSourceRanking(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<SourcePerformanceDto[]> {
    return this.transactionService.getIncomeSourcePerformance(year, month);
  }
  @Get('monthly-revenue-by-source')
  @ApiOperation({
    summary: '월별 수입원별 매출 추이 조회 (Top 5)',
    description:
      '최근 N개월간 또는 특정 기간 동안 매출 상위 5개 수입원의 월별 매출 흐름을 조회합니다.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '조회할 개월 수 (기본: 6)',
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
  async getMonthlyRevenueBySource(
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.getMonthlyRevenuePatterns(
      limit || 6,
      startDate,
      endDate,
    );
  }
}
