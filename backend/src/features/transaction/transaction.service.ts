import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';

interface MonthlyStatRaw {
  month: string;
  revenue: string; // SQL SUM returns string
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

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      order: { date: 'DESC', createdAt: 'DESC' },
      relations: ['incomeSource'],
    });
  }

  async findAllBySourceId(sourceId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { incomeSourceId: sourceId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

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

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }

  async getSummaryBySourceId(
    sourceId: string,
  ): Promise<{ revenue: number; expense: number; netProfit: number }> {
    const transactions = await this.findAllBySourceId(sourceId);

    let revenue = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === TransactionType.REVENUE) {
        revenue += amount;
      } else if (tx.type === TransactionType.EXPENSE) {
        expense += amount;
      }
    });

    return {
      revenue,
      expense,
      netProfit: revenue - expense,
    };
  }
  async getMonthlyStats(
    year: number,
  ): Promise<
    { month: string; revenue: number; expense: number; netProfit: number }[]
  > {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select("TO_CHAR(transaction.date, 'YYYY-MM')", 'month')
      .addSelect(
        'SUM(CASE WHEN transaction.type = :revenue THEN transaction.amount ELSE 0 END)',
        'revenue',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :expense THEN transaction.amount ELSE 0 END)',
        'expense',
      )
      .where('transaction.date >= :startDate', { startDate })
      .andWhere('transaction.date < :endDate', { endDate })
      .groupBy("TO_CHAR(transaction.date, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<MonthlyStatRaw>();

    return result.map((item) => ({
      month: item.month,
      revenue: Number(item.revenue),
      expense: Number(item.expense),
      netProfit: Number(item.revenue) - Number(item.expense),
    }));
  }

  async getRecentMonthlyStats(
    limit: number,
  ): Promise<
    { month: string; revenue: number; expense: number; netProfit: number }[]
  > {
    const endDate = new Date();
    // 현재 달 포함하여 limit개월 전 1일
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - limit + 1);
    startDate.setDate(1);

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select("TO_CHAR(transaction.date, 'YYYY-MM')", 'month')
      .addSelect(
        'SUM(CASE WHEN transaction.type = :revenue THEN transaction.amount ELSE 0 END)',
        'revenue',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.type = :expense THEN transaction.amount ELSE 0 END)',
        'expense',
      )
      .where('transaction.date >= :startDate', { startDate })
      .andWhere('transaction.date <= :endDate', { endDate })
      .groupBy("TO_CHAR(transaction.date, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<MonthlyStatRaw>();

    return result.map((item) => ({
      month: item.month,
      revenue: Number(item.revenue),
      expense: Number(item.expense),
      netProfit: Number(item.revenue) - Number(item.expense),
    }));
  }

  async getIncomeSourcePerformance(): Promise<
    {
      sourceId: string;
      name: string;
      netProfit: number;
      totalRevenue: number;
    }[]
  > {
    const result = await this.transactionRepository
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
      .groupBy('source.id')
      .addGroupBy('source.name')
      .orderBy('"netProfit"', 'DESC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<SourcePerformanceRaw & { totalExpense: string }>();

    return result.map((item) => ({
      sourceId: item.sourceId,
      name: item.name,
      netProfit: Number(item.netProfit),
      totalRevenue: Number(item.totalRevenue),
      totalExpense: Number(item.totalExpense),
    }));
  }

  /** 대시보드 요약: 이번 달 / 전월 수익·지출·순수익 + 증감률 */
  async getDashboardSummary(): Promise<{
    currentMonth: { revenue: number; expense: number; netProfit: number };
    previousMonth: { revenue: number; expense: number; netProfit: number };
    changeRate: {
      revenue: number | null;
      expense: number | null;
      netProfit: number | null;
    };
  }> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 전월 연/월 계산
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const calcMonthStats = async (year: number, month: number) => {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

      const result = await this.transactionRepository
        .createQueryBuilder('tx')
        .select(
          'COALESCE(SUM(CASE WHEN tx.type = :revenue THEN tx.amount ELSE 0 END), 0)',
          'revenue',
        )
        .addSelect(
          'COALESCE(SUM(CASE WHEN tx.type = :expense THEN tx.amount ELSE 0 END), 0)',
          'expense',
        )
        .where('tx.date >= :startDate', { startDate })
        .andWhere('tx.date < :endDate', { endDate })
        .setParameters({
          revenue: TransactionType.REVENUE,
          expense: TransactionType.EXPENSE,
        })
        .getRawOne<{ revenue: string; expense: string }>();

      const rev = Number(result?.revenue || 0);
      const exp = Number(result?.expense || 0);
      return { revenue: rev, expense: exp, netProfit: rev - exp };
    };

    const current = await calcMonthStats(currentYear, currentMonth);
    const previous = await calcMonthStats(prevYear, prevMonth);

    // 증감률 계산 (전월이 0이면 null 반환)
    const calcRate = (curr: number, prev: number): number | null => {
      if (prev === 0) return curr > 0 ? 100 : null;
      return Math.round(((curr - prev) / prev) * 100);
    };

    return {
      currentMonth: current,
      previousMonth: previous,
      changeRate: {
        revenue: calcRate(current.revenue, previous.revenue),
        expense: calcRate(current.expense, previous.expense),
        netProfit: calcRate(current.netProfit, previous.netProfit),
      },
    };
  }

  /** 수입원별 수익 포트폴리오 분포 */
  async getPortfolioDistribution(): Promise<
    {
      sourceId: string;
      name: string;
      revenue: number;
      percentage: number;
    }[]
  > {
    const result = await this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoin('tx.incomeSource', 'source')
      .select('source.id', 'sourceId')
      .addSelect('source.name', 'name')
      .addSelect(
        'COALESCE(SUM(CASE WHEN tx.type = :revenue THEN tx.amount ELSE 0 END), 0)',
        'revenue',
      )
      .groupBy('source.id')
      .addGroupBy('source.name')
      .orderBy('revenue', 'DESC')
      .setParameters({ revenue: TransactionType.REVENUE })
      .getRawMany<{ sourceId: string; name: string; revenue: string }>();

    const totalRevenue = result.reduce(
      (sum, item) => sum + Number(item.revenue),
      0,
    );

    return result.map((item) => {
      const rev = Number(item.revenue);
      return {
        sourceId: item.sourceId,
        name: item.name,
        revenue: rev,
        percentage:
          totalRevenue > 0 ? Math.round((rev / totalRevenue) * 1000) / 10 : 0,
      };
    });
  }

  /** 특정 수입원의 월별 수익/지출 통계 */
  async getMonthlyStatsBySourceId(
    sourceId: string,
    limit: number = 6,
  ): Promise<
    { month: string; revenue: number; expense: number; netProfit: number }[]
  > {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - limit + 1);
    startDate.setDate(1);

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
      .andWhere('tx.date >= :startDate', { startDate })
      .groupBy("TO_CHAR(tx.date, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .setParameters({
        revenue: TransactionType.REVENUE,
        expense: TransactionType.EXPENSE,
      })
      .getRawMany<MonthlyStatRaw>();

    return result.map((item) => ({
      month: item.month,
      revenue: Number(item.revenue),
      expense: Number(item.expense),
      netProfit: Number(item.revenue) - Number(item.expense),
    }));
  }
}
