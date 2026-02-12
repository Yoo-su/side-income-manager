import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('summary')
  @ApiOperation({
    summary: '대시보드 요약 조회 (이번 달/전월 비교)',
  })
  async getSummary() {
    return this.transactionService.getDashboardSummary();
  }

  @Get('portfolio')
  @ApiOperation({
    summary: '수입원별 수익 포트폴리오 비중 조회',
  })
  async getPortfolio() {
    return this.transactionService.getPortfolioDistribution();
  }

  @Get('monthly-stats')
  @ApiOperation({
    summary: '월별 통계 조회 (연도별 또는 최근 N개월)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: '조회할 연도 (limit이 없을 때 사용)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '최근 N개월 조회 (year보다 우선순위 높음)',
  })
  async getMonthlyStats(
    @Query('year') year?: number,
    @Query('limit') limit?: number,
  ) {
    if (limit) {
      return this.transactionService.getRecentMonthlyStats(limit);
    }
    const targetYear = year || new Date().getFullYear();
    return this.transactionService.getMonthlyStats(targetYear);
  }

  @Get('source-ranking')
  @ApiOperation({ summary: '수입원별 수익 랭킹 조회' })
  async getSourceRanking() {
    return this.transactionService.getIncomeSourcePerformance();
  }
}
