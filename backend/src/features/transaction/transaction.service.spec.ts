import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Repository } from 'typeorm';

describe('TransactionService (거래 서비스)', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let mockQueryBuilder: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
      getMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('getSummaryBySourceId - 계산 로직 검증', () => {
    it('복합적인 거래 내역에 대해 요약 정보를 정확히 계산해야 한다', async () => {
      const sourceId = 'source-1';
      const transactions = [
        {
          id: '1',
          type: TransactionType.REVENUE,
          amount: 100000, // +100,000
          hours: 10,
        },
        {
          id: '2',
          type: TransactionType.EXPENSE,
          amount: 20000, // -20,000
          hours: 0,
        },
        {
          id: '3',
          type: TransactionType.REVENUE,
          amount: 50000, // +50,000
          hours: 5,
        },
      ] as Transaction[];

      mockQueryBuilder.getMany.mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId(sourceId);

      // 예상 값:
      // 수익(Revenue): 100,000 + 50,000 = 150,000
      // 지출(Expense): 20,000
      // 순수익(Net Profit): 150,000 - 20,000 = 130,000
      // 총 시간(Total Hours): 10 + 0 + 5 = 15
      // 시간당 수익(Hourly Rate): (150,000 - 20,000) / 15 = 130,000 / 15 = 8666.666... -> 8667
      // 투자 수익률(ROI): (130,000 / 20,000) * 100 = 650.0%

      expect(result.revenue).toBe(150000);
      expect(result.expense).toBe(20000);
      expect(result.netProfit).toBe(130000);
      expect(result.totalHours).toBe(15);
      expect(result.hourlyRate).toBe(8667); // 반올림 확인
      expect(result.roi).toBe(650.0);
    });

    it('투입 시간이 0일 때 0으로 나누기 예외를 처리해야 한다', async () => {
      const transactions = [
        {
          type: TransactionType.REVENUE,
          amount: 100000,
          hours: 0,
        },
      ] as Transaction[];
      mockQueryBuilder.getMany.mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');

      expect(result.totalHours).toBe(0);
      expect(result.hourlyRate).toBe(0); // Infinity가 아닌 0이어야 함
    });

    it('지출이 0일 때 ROI 계산 예외를 처리해야 한다', async () => {
      const transactions = [
        {
          type: TransactionType.REVENUE,
          amount: 100000,
          hours: 10,
        },
      ] as Transaction[];
      mockQueryBuilder.getMany.mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');

      expect(result.expense).toBe(0);
      expect(result.roi).toBe(0); // Infinity가 아닌 0이어야 함
    });
  });

  describe('getDashboardSummary - 증감률 로직 검증', () => {
    it('증감률(상승)을 정확히 계산해야 한다', async () => {
      // 이번 달: 매출 200, 지출 50
      // 지난 달: 매출 100, 지출 50
      // 매출 증감률: (200 - 100) / 100 * 100 = 100% 증가

      // 첫 번째 호출 (이번 달)
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({
        revenue: '200',
        expense: '50',
        totalHours: '10',
      });

      // 두 번째 호출 (지난 달)
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({
        revenue: '100',
        expense: '50',
        totalHours: '10',
      });

      const result = await service.getDashboardSummary(2026, 2);

      expect(result.currentMonth.revenue).toBe(200);
      expect(result.changeRate.revenue).toBe(100); // 100% 증가
      expect(result.changeRate.netProfit).toBe(200); // (150 - 50) / 50 * 100 = 200%
    });

    it('지난 달 값이 0일 때(무한대 방지) 예외를 처리해야 한다', async () => {
      // 이번 달 호출
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({
        revenue: '100',
        expense: '0',
        totalHours: '10',
      });

      // 지난 달 호출 (결과 없음 = 0)
      mockQueryBuilder.getRawOne.mockResolvedValueOnce(undefined);

      const result = await service.getDashboardSummary(2026, 2);

      expect(result.changeRate.revenue).toBe(100); // 구현 로직에 따라 100% 또는 0 반환 확인
    });
  });

  describe('getIncomeSourcePerformance - 랭킹 및 효율성 검증', () => {
    it('수입원별 성과 지표를 정확히 계산해야 한다', async () => {
      const rawResults = [
        {
          sourceId: 'src-1',
          name: 'Project A',
          netProfit: '100000',
          totalRevenue: '120000',
          totalExpense: '20000',
          totalHours: '10',
        },
        {
          sourceId: 'src-2',
          name: 'Project B',
          netProfit: '50000',
          totalRevenue: '50000',
          totalExpense: '0',
          totalHours: '5',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(rawResults);

      const result = await service.getIncomeSourcePerformance(2026);

      // Project A 검증
      expect(result[0].name).toBe('Project A');
      expect(result[0].netProfit).toBe(100000);
      expect(result[0].hourlyRate).toBe(10000); // 100,000 / 10
      expect(result[0].roi).toBe(500.0); // (100,000 / 20,000) * 100

      // Project B 검증
      expect(result[1].name).toBe('Project B');
      expect(result[1].netProfit).toBe(50000);
      expect(result[1].hourlyRate).toBe(10000); // 50,000 / 5
      expect(result[1].roi).toBe(0); // 지출이 0이므로 ROI는 0
    });
  });

  describe('getPortfolioDistribution - 비중 계산 로직 검증', () => {
    it('매출 비중(퍼센트)을 정확히 계산해야 한다', async () => {
      const rawResults = [
        { sourceId: 'src-1', name: 'Project A', revenue: '100' },
        { sourceId: 'src-2', name: 'Project B', revenue: '300' },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(rawResults);

      const result = await service.getPortfolioDistribution(2026, 2);

      // 총 매출: 400
      // Project A: 100 / 400 = 25%
      // Project B: 300 / 400 = 75%

      expect(result[0].percentage).toBe(25.0);
      expect(result[1].percentage).toBe(75.0);
    });
  });

  describe('부동소수점 정밀도 이슈 (Decimal.js 검증)', () => {
    it('부동소수점 덧셈 오차를 해결해야 한다 (0.1 + 0.2)', async () => {
      // 시나리오: 수익 0.1 + 수익 0.2 -> 0.3이 나와야 함
      const transactions = [
        { type: TransactionType.REVENUE, amount: 0.1, hours: 0 },
        { type: TransactionType.REVENUE, amount: 0.2, hours: 0 },
      ] as Transaction[];
      mockQueryBuilder.getMany.mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');

      // JS 기본 동작: 0.1 + 0.2 = 0.30000000000000004
      // Decimal.js 적용 시: 정확히 0.3
      expect(result.revenue).toBe(0.3);
    });

    it('정밀한 뺄셈 연산을 수행해야 한다', async () => {
      // 10.03 - 9.03 = 1
      const transactions = [
        { type: TransactionType.REVENUE, amount: 10.03, hours: 0 },
        { type: TransactionType.EXPENSE, amount: 9.03, hours: 0 },
      ] as Transaction[];
      mockQueryBuilder.getMany.mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');
      expect(result.netProfit).toBe(1.0);
    });
  });
});
