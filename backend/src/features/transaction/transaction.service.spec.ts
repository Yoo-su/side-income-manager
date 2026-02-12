import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Repository } from 'typeorm';

const mockTransactionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
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
  })),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: MockRepository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useFactory: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<MockRepository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummaryBySourceId - Calculation Logic', () => {
    it('should calculate summary correctly for mixed transactions', async () => {
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

      (repository.find as jest.Mock).mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId(sourceId);

      // Expected Values:
      // Revenue: 100,000 + 50,000 = 150,000
      // Expense: 20,000
      // Net Profit: 150,000 - 20,000 = 130,000
      // Total Hours: 10 + 0 + 5 = 15
      // Hourly Rate: (150,000 - 20,000) / 15 = 130,000 / 15 = 8666.666... -> 8667
      // ROI: (130,000 / 20,000) * 100 = 650.0%

      expect(result.revenue).toBe(150000);
      expect(result.expense).toBe(20000);
      expect(result.netProfit).toBe(130000);
      expect(result.totalHours).toBe(15);
      expect(result.hourlyRate).toBe(8667); // Rounded
      expect(result.roi).toBe(650.0);
    });

    it('should handle zero hours (division by zero protection)', async () => {
      const transactions = [
        {
          type: TransactionType.REVENUE,
          amount: 100000,
          hours: 0,
        },
      ] as Transaction[];
      (repository.find as jest.Mock).mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');

      expect(result.totalHours).toBe(0);
      expect(result.hourlyRate).toBe(0); // Should be 0, not Infinity
    });

    it('should handle zero expense (ROI via division by zero protection)', async () => {
      const transactions = [
        {
          type: TransactionType.REVENUE,
          amount: 100000,
          hours: 10,
        },
      ] as Transaction[];
      (repository.find as jest.Mock).mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');

      expect(result.expense).toBe(0);
      expect(result.roi).toBe(0); // Should be 0, not Infinity
    });
  });

  describe('Floating Point Precision Issues (The "Safety Net")', () => {
    it('should handle floating point addition correctly (0.1 + 0.2)', async () => {
      // Scenario: Revenue 0.1, Revenue 0.2 -> Should be 0.3
      const transactions = [
        { type: TransactionType.REVENUE, amount: 0.1, hours: 0 },
        { type: TransactionType.REVENUE, amount: 0.2, hours: 0 },
      ] as Transaction[];
      (repository.find as jest.Mock).mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');

      // JS default: 0.1 + 0.2 = 0.30000000000000004
      // With decimal.js, it should be exactly 0.3
      expect(result.revenue).toBe(0.3);
    });

    it('should handle precise decimal subtraction', async () => {
      // 10.03 - 9.03 = 1
      const transactions = [
        { type: TransactionType.REVENUE, amount: 10.03, hours: 0 },
        { type: TransactionType.EXPENSE, amount: 9.03, hours: 0 },
      ] as Transaction[];
      (repository.find as jest.Mock).mockResolvedValue(transactions);

      const result = await service.getSummaryBySourceId('test');
      expect(result.netProfit).toBe(1.0);
    });
  });
});
