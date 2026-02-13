import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { Decimal } from 'decimal.js';

interface MonthlyStatRaw {
  month: string;
  revenue: string; // SQL SUM은 문자열을 반환함
  expense: string;
}

interface SourcePerformanceRaw {
  sourceId: string;
  name: string;
  netProfit: string;
  totalRevenue: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * 새로운 거래 내역을 생성합니다.
   * @param createTransactionDto 거래 내역 생성 DTO
   * @returns 생성된 거래 내역
   */
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  /**
   * 모든 거래 내역을 조회합니다. (날짜/생성일 내림차순 정렬)
   * @returns 거래 내역 목록
   */
  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      order: { date: 'DESC', createdAt: 'DESC' },
      relations: ['incomeSource'],
    });
  }

  /**
   * 특정 수입원의 거래 내역을 조회합니다.
   * @param sourceId 수입원 ID
   * @returns 해당 수입원의 거래 내역 목록
   */
  async findAllBySourceId(sourceId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { incomeSourceId: sourceId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * 특정 ID의 거래 내역을 조회합니다.
   * @param id 거래 내역 ID
   * @returns 거래 내역 정보
   * @throws NotFoundException 해당 ID의 거래 내역이 없을 경우
   */
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['incomeSource'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  /**
   * 거래 내역을 수정합니다.
   * @param id 거래 내역 ID
   * @param updateTransactionDto 수정할 데이터 DTO
   * @returns 수정된 거래 내역
   */
  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  /**
   * 거래 내역을 삭제합니다.
   * @param id 거래 내역 ID
   * @throws NotFoundException 해당 ID의 거래 내역이 없을 경우
   */
  async remove(id: string): Promise<void> {
    const result = await this.transactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }

  /**
   * 특정 수입원의 요약 정보(수익, 지출, 순수익, ROI 등)를 계산합니다.
   * @param sourceId 수입원 ID
   * @param year 조회할 연도 (선택)
   * @param month 조회할 월 (선택)
   * @returns 요약 정보 객체
   */
  async getSummaryBySourceId(
    sourceId: string,
    year?: number,
    month?: number,
  ): Promise<{
    revenue: number;
    expense: number;
    netProfit: number;
    totalHours: number;
    hourlyRate: number;
    roi: number;
  }> {
    const query = this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoin('tx.incomeSource', 'source') // incomeSource 조인
      .where('tx.incomeSourceId = :sourceId', { sourceId });

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1); // 다음 달 1일
      query.andWhere('tx.date >= :startDate AND tx.date < :endDate', {
        startDate,
        endDate,
      });
    }

    const transactions = await query.getMany();

    let revenue = new Decimal(0);
    let expense = new Decimal(0);
    let totalHours = new Decimal(0);

    transactions.forEach((tx) => {
      const amount = new Decimal(tx.amount);
      if (tx.type === TransactionType.REVENUE) {
        revenue = revenue.plus(amount);
      } else if (tx.type === TransactionType.EXPENSE) {
        expense = expense.plus(amount);
      }

      if (tx.hours) {
        totalHours = totalHours.plus(new Decimal(tx.hours));
      }
    });

    const netProfit = revenue.minus(expense);

    // 시간당 수익 (순수익 / 총 투입 시간)
    const hourlyRate = totalHours.greaterThan(0)
      ? netProfit.dividedBy(totalHours).round().toNumber()
      : 0;

    // 투자 대비 수익률 (순수익 / 총 지출 * 100)
    const roi = expense.greaterThan(0)
      ? netProfit.dividedBy(expense).times(100).toDecimalPlaces(1).toNumber()
      : 0;

    return {
      revenue: revenue.toNumber(),
      expense: expense.toNumber(),
      netProfit: netProfit.toNumber(),
      totalHours: totalHours.toNumber(),
      hourlyRate,
      roi,
    };
  }

  /**
   * 특정 기간 동안의 월별 통계(수익, 지출, 순수익)를 조회합니다.
   * 시작일과 종료일을 기준으로 하며, 해당 기간 내의 모든 월을 포함하도록 Zero-Filling 합니다.
   * @param year 조회할 연도 (startDate/endDate가 없을 경우 사용)
   * @param startDate 시작 날짜 (YYYY-MM-DD)
   * @param endDate 종료 날짜 (YYYY-MM-DD)
   * @returns 월별 통계 리스트
   */
  async getMonthlyStats(
    year?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<
    { month: string; revenue: number; expense: number; netProfit: number }[]
  > {
    let start: Date;
    let end: Date;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      const targetYear = year || new Date().getFullYear();
      start = new Date(`${targetYear}-01-01`);
      end = new Date(`${targetYear}-12-31`);
    }

    // 종료일의 시간을 23:59:59로 설정하여 해당 날짜의 데이터를 포함
    end.setHours(23, 59, 59, 999);

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.incomeSource', 'source')
      .select("TO_CHAR(transaction.date, 'YYYY-MM')", 'month')
      .addSelect(
        'SUM(CASE WHEN transaction.type = :revenue THEN transaction.amount ELSE 0 END)',
        'revenue',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :expense THEN transaction.amount ELSE 0 END)',
        'expense',
      )
      .where('transaction.date >= :start', { start })
      .andWhere('transaction.date <= :end', { end })
      .andWhere('source.isActive = true')
      .groupBy("TO_CHAR(transaction.date, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<MonthlyStatRaw>();

    // Zero-Filling Logic
    const filledStats: {
      month: string;
      revenue: number;
      expense: number;
      netProfit: number;
    }[] = [];
    const current = new Date(start);
    // current를 월의 1일로 설정하여 정확한 월 반복 보장
    current.setDate(1);

    while (current <= end) {
      const yearStr = current.getFullYear();
      const monthStr = String(current.getMonth() + 1).padStart(2, '0');
      const monthKey = `${yearStr}-${monthStr}`;

      const found = result.find((r) => r.month === monthKey);

      if (found) {
        filledStats.push({
          month: monthKey,
          revenue: Number(found.revenue),
          expense: Number(found.expense),
          netProfit: new Decimal(found.revenue)
            .minus(new Decimal(found.expense))
            .toNumber(),
        });
      } else {
        filledStats.push({
          month: monthKey,
          revenue: 0,
          expense: 0,
          netProfit: 0,
        });
      }

      current.setMonth(current.getMonth() + 1);
    }

    return filledStats;
  }

  /**
   * 최근 N개월간의 월별 통계를 조회합니다.
   * @param limit 조회할 개월 수 (기본: 6)
   * @returns 월별 통계 리스트
   */
  async getRecentMonthlyStats(
    limit: number,
  ): Promise<
    { month: string; revenue: number; expense: number; netProfit: number }[]
  > {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - limit + 1);
    start.setDate(1);

    // 날짜 문자열로 변환하여 getMonthlyStats 재사용
    return this.getMonthlyStats(
      undefined,
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0],
    );
  }

  /**
   * 수입원별 성과(순수익, 총매출, 총비용, 효율성 지표)를 조회합니다.
   * 특정 연/월이 주어지면 해당 기간으로 필터링합니다.
   * 순수익 내림차순으로 정렬됩니다.
   * @param year 조회할 연도 (선택)
   * @param month 조회할 월 (선택)
   * @returns 수입원별 성과 리스트 (순수익, 매출, 비용, 시간, ROI, 시간당 수익 포함)
   */
  async getIncomeSourcePerformance(
    year?: number,
    month?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<
    {
      sourceId: string;
      name: string;
      netProfit: number;
      totalRevenue: number;
      totalExpense: number;
      totalHours: number;
      roi: number;
      hourlyRate: number;
    }[]
  > {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.incomeSource', 'source')
      .select('source.id', 'sourceId')
      .addSelect('source.name', 'name')
      .addSelect(
        'SUM(CASE WHEN transaction.type = :revenue THEN transaction.amount ELSE -transaction.amount END)',
        'netProfit',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :revenue THEN transaction.amount ELSE 0 END)',
        'totalRevenue',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :expense THEN transaction.amount ELSE 0 END)',
        'totalExpense',
      )
      .addSelect('COALESCE(SUM(transaction.hours), 0)', 'totalHours')
      .where('source.isActive = true'); // 활성 수입원만 필터링

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 종료일의 마지막 시간까지 포함

      query.andWhere(
        'transaction.date >= :start AND transaction.date <= :end',
        {
          start,
          end,
        },
      );
    } else if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      query.andWhere('transaction.date >= :start AND transaction.date < :end', {
        start,
        end,
      });
    }

    const result = await query
      .groupBy('source.id')
      .addGroupBy('source.name')
      .orderBy('"netProfit"', 'DESC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<
        SourcePerformanceRaw & { totalExpense: string; totalHours: string }
      >();

    return result.map((item) => {
      const netProfit = new Decimal(item.netProfit);
      const totalRevenue = new Decimal(item.totalRevenue);
      const totalExpense = new Decimal(item.totalExpense);
      const totalHours = new Decimal(item.totalHours);

      // 시간당 수익
      const hourlyRate = totalHours.greaterThan(0)
        ? netProfit.dividedBy(totalHours).round().toNumber()
        : 0;

      // ROI
      const roi = totalExpense.greaterThan(0)
        ? netProfit
            .dividedBy(totalExpense)
            .times(100)
            .toDecimalPlaces(1)
            .toNumber()
        : 0;

      return {
        sourceId: item.sourceId || 'unknown',
        name: item.name || '미지정 수입원',
        netProfit: netProfit.toNumber(),
        totalRevenue: totalRevenue.toNumber(),
        totalExpense: totalExpense.toNumber(),
        totalHours: totalHours.toNumber(),
        hourlyRate,
        roi,
      };
    });
  }

  /**
   * 대시보드 요약 정보를 조회합니다.
   * 선택된 년/월과 그 전월(혹은 전년 동월)의 수익, 지출, 순수익, 투입 시간을 비교하고 증감률을 계산합니다.
   * @param year 조회할 연도 (기본: 현재)
   * @param month 조회할 월 (기본: 현재)
   * @returns 대시보드 요약 정보
   */
  async getDashboardSummary(
    year?: number,
    month?: number,
  ): Promise<{
    currentMonth: {
      revenue: number;
      expense: number;
      netProfit: number;
      totalHours: number;
    };
    previousMonth: {
      revenue: number;
      expense: number;
      netProfit: number;
      totalHours: number;
    };
    changeRate: {
      revenue: number | null;
      expense: number | null;
      netProfit: number | null;
      totalHours: number | null;
    };
  }> {
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const currentMonth = month || now.getMonth() + 1;

    // 전월 연/월 계산
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const calcMonthStats = async (y: number, m: number) => {
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 1);

      const result = await this.transactionRepository
        .createQueryBuilder('tx')
        .leftJoin('tx.incomeSource', 'source') // 조인
        .select(
          'COALESCE(SUM(CASE WHEN tx.type = :revenue THEN tx.amount ELSE 0 END), 0)',
          'revenue',
        )
        .addSelect(
          'COALESCE(SUM(CASE WHEN tx.type = :expense THEN tx.amount ELSE 0 END), 0)',
          'expense',
        )
        .addSelect('COALESCE(SUM(tx.hours), 0)', 'totalHours')
        .where('tx.date >= :startDate AND tx.date < :endDate', {
          startDate,
          endDate,
        })
        .andWhere('source.isActive = true') // 활성 수입원만 필터링
        .setParameters({
          revenue: TransactionType.REVENUE,
          expense: TransactionType.EXPENSE,
        })
        .getRawOne<{
          revenue: string;
          expense: string;
          totalHours: string;
        }>();

      const rev = new Decimal(result?.revenue || 0);
      const exp = new Decimal(result?.expense || 0);
      const hours = new Decimal(result?.totalHours || 0);
      return {
        revenue: rev.toNumber(),
        expense: exp.toNumber(),
        netProfit: rev.minus(exp).toNumber(),
        totalHours: hours.toNumber(),
      };
    };

    const current = await calcMonthStats(currentYear, currentMonth);
    const previous = await calcMonthStats(prevYear, prevMonth);

    // 증감률 계산 (전월이 0이면 null 반환)
    const calcRate = (curr: number, prev: number): number | null => {
      // 0 -> 0 이면 0% (변동 없음)
      if (prev === 0 && curr === 0) return 0;

      // 전월이 0인데 이번달 실적이 있으면 100% 성장으로 표시
      if (prev === 0) return curr > 0 ? 100 : 0;

      return new Decimal(curr)
        .minus(prev)
        .dividedBy(prev)
        .times(100)
        .round()
        .toNumber();
    };

    return {
      currentMonth: current,
      previousMonth: previous,
      changeRate: {
        revenue: calcRate(current.revenue, previous.revenue),
        expense: calcRate(current.expense, previous.expense),
        netProfit: calcRate(current.netProfit, previous.netProfit),
        totalHours: calcRate(current.totalHours, previous.totalHours),
      },
    };
  }

  /**
   * 수입원별 수익 포트폴리오(비중)를 계산합니다.
   * 특정 연/월이 주어지면 해당 기간으로 필터링합니다.
   * @param year 조회할 연도 (선택)
   * @param month 조회할 월 (선택)
   * @returns 수입원별 매출 비중 리스트
   */
  async getPortfolioDistribution(
    year?: number,
    month?: number,
  ): Promise<
    {
      sourceId: string;
      name: string;
      revenue: number;
      percentage: number;
    }[]
  > {
    const query = this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoin('tx.incomeSource', 'source')
      .select('source.id', 'sourceId')
      .addSelect('source.name', 'name')
      .addSelect(
        'COALESCE(SUM(CASE WHEN tx.type = :revenue THEN tx.amount ELSE 0 END), 0)',
        'revenue',
      )
      .where('source.isActive = true'); // 활성 수입원만 필터링

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query.andWhere('tx.date >= :startDate AND tx.date < :endDate', {
        startDate,
        endDate,
      });
    }

    const result = await query
      .groupBy('source.id')
      .addGroupBy('source.name')
      .orderBy('revenue', 'DESC')
      .setParameters({ revenue: TransactionType.REVENUE })
      .getRawMany<{ sourceId: string; name: string; revenue: string }>();

    const totalRevenue = result.reduce(
      (sum, item) => sum.plus(new Decimal(item.revenue)),
      new Decimal(0),
    );

    return result.map((item) => {
      const rev = new Decimal(item.revenue);
      return {
        sourceId: item.sourceId || 'unknown',
        name: item.name || '미지정 수입원',
        revenue: rev.toNumber(),
        percentage: totalRevenue.greaterThan(0)
          ? rev.dividedBy(totalRevenue).times(100).toDecimalPlaces(1).toNumber()
          : 0,
      };
    });
  }

  /**
   * 특정 수입원의 월별 통계(수익, 지출, 순수익)를 조회합니다.
   * 시작일과 종료일을 기준으로 하며, 해당 기간 내의 모든 월을 포함하도록 Zero-Filling 합니다.
   * @param sourceId 수입원 ID
   * @param limit 조회할 개월 수 (기본값: 6, startDate/endDate가 없을 때만 사용)
   * @param startDate 시작 날짜 (YYYY-MM-DD)
   * @param endDate 종료 날짜 (YYYY-MM-DD)
   * @returns 월별 통계 리스트
   */
  async getMonthlyStatsBySourceId(
    sourceId: string,
    limit: number = 6,
    startDate?: string,
    endDate?: string,
  ): Promise<
    { month: string; revenue: number; expense: number; netProfit: number }[]
  > {
    let start: Date;
    let end: Date;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setMonth(start.getMonth() - limit + 1);
      start.setDate(1);
    }

    // 종료일의 시간을 23:59:59로 설정
    end.setHours(23, 59, 59, 999);

    const result = await this.transactionRepository
      .createQueryBuilder('tx')
      .select("TO_CHAR(tx.date, 'YYYY-MM')", 'month')
      .addSelect(
        'COALESCE(SUM(CASE WHEN tx.type = :revenue THEN tx.amount ELSE 0 END), 0)',
        'revenue',
      )
      .addSelect(
        'COALESCE(SUM(CASE WHEN tx.type = :expense THEN tx.amount ELSE 0 END), 0)',
        'expense',
      )
      .where('tx.incomeSourceId = :sourceId', { sourceId })
      .andWhere('tx.date >= :start', { start })
      .andWhere('tx.date <= :end', { end })
      .groupBy("TO_CHAR(tx.date, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<MonthlyStatRaw>();

    // Zero-Filling
    const filledStats: {
      month: string;
      revenue: number;
      expense: number;
      netProfit: number;
    }[] = [];
    const current = new Date(start);
    current.setDate(1);

    while (current <= end) {
      const yearStr = current.getFullYear();
      const monthStr = String(current.getMonth() + 1).padStart(2, '0');
      const monthKey = `${yearStr}-${monthStr}`;

      const found = result.find((r) => r.month === monthKey);

      if (found) {
        filledStats.push({
          month: monthKey,
          revenue: Number(found.revenue),
          expense: Number(found.expense),
          netProfit: Number(found.revenue) - Number(found.expense),
        });
      } else {
        filledStats.push({
          month: monthKey,
          revenue: 0,
          expense: 0,
          netProfit: 0,
        });
      }

      current.setMonth(current.getMonth() + 1);
    }

    return filledStats;
  }

  /**
   * 특정 기간(또는 최근 N개월) 동안 상위 5개 수입원의 월별 매출 추이를 조회합니다.
   * @param limit 조회할 개월 수 (startDate/endDate가 없을 때만 사용)
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   * @returns 월별/수입원별 매출 데이터
   */
  async getMonthlyRevenuePatterns(
    limit: number,
    startDate?: string,
    endDate?: string,
  ): Promise<
    {
      month: string;
      sourceId: string;
      sourceName: string;
      revenue: number;
    }[]
  > {
    // 1. 기간 설정
    let start: Date;
    let end: Date;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setMonth(start.getMonth() - limit + 1);
      start.setDate(1);
    }
    end.setHours(23, 59, 59, 999);

    // 2. 기간 내 매출 합계 기준 Top 5 수입원 선정 (활성 상태인 것만)
    const topSources = await this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoin('tx.incomeSource', 'source')
      .select('source.id', 'id')
      .addSelect('source.name', 'name')
      .addSelect('SUM(tx.amount)', 'total')
      .where('tx.date >= :start', { start })
      .andWhere('tx.date <= :end', { end })
      .andWhere('tx.type = :type', { type: TransactionType.REVENUE })
      .andWhere('source.isActive = true')
      .groupBy('source.id')
      .addGroupBy('source.name')
      .orderBy('total', 'DESC')
      .limit(5)
      .getRawMany<{ id: string; name: string; total: string }>();

    if (topSources.length === 0) {
      return [];
    }

    const sourceIds = topSources.map((s) => s.id);
    const sourceMap = new Map(topSources.map((s) => [s.id, s.name]));

    // 3. 선정된 수입원들의 월별 매출 조회
    const rawResult = await this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoin('tx.incomeSource', 'source')
      .select("TO_CHAR(tx.date, 'YYYY-MM')", 'month')
      .addSelect('source.id', 'sourceId')
      .addSelect('SUM(tx.amount)', 'revenue')
      .where('tx.date >= :start', { start })
      .andWhere('tx.date <= :end', { end })
      .andWhere('tx.type = :type', { type: TransactionType.REVENUE })
      .andWhere('source.id IN (:...sourceIds)', { sourceIds })
      .groupBy("TO_CHAR(tx.date, 'YYYY-MM')")
      .addGroupBy('source.id')
      .orderBy('month', 'ASC')
      .getRawMany<{
        month: string;
        sourceId: string;
        revenue: string;
        to_char?: string; // 일부 드라이버를 위한 선택적 속성
      }>();

    // 4. Zero-Filling 및 데이터 포맷팅
    // 4-1. 모든 월 리스트 생성 (YYYY-MM)
    const allMonths: string[] = [];
    const current = new Date(start);
    current.setDate(1);

    while (current <= end) {
      const yearStr = current.getFullYear();
      const monthStr = String(current.getMonth() + 1).padStart(2, '0');
      allMonths.push(`${yearStr}-${monthStr}`);
      current.setMonth(current.getMonth() + 1);
    }

    // 4-2. 결과 매핑 (소스별 x 월별 => 없으면 0)
    const finalResult: {
      month: string;
      sourceId: string;
      sourceName: string;
      revenue: number;
    }[] = [];

    // Top 5 소스 각각에 대해 모든 월 데이터 생성
    sourceIds.forEach((sId) => {
      const sName = sourceMap.get(sId) || 'Unknown';

      allMonths.forEach((m) => {
        // 해당 소스 + 해당 월의 데이터 찾기
        const found = rawResult.find(
          (r) => r.sourceId === sId && (r.month === m || r.to_char === m),
        );

        finalResult.push({
          month: m,
          sourceId: sId,
          sourceName: sName,
          revenue: found ? Number(found.revenue) : 0,
        });
      });
    });

    return finalResult;
  }
}
