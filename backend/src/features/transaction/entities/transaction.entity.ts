import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IncomeSource } from '../../income-source/entities/income-source.entity';

export enum TransactionType {
  REVENUE = 'REVENUE', // 수익
  EXPENSE = 'EXPENSE', // 지출
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  incomeSourceId: string;

  @ManyToOne(() => IncomeSource, (incomeSource) => incomeSource.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'incomeSourceId' })
  incomeSource: IncomeSource;

  /** 거래 유형 (수익/지출) */
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  /** 거래 금액 (최대 99,999,999,999.99) - precision 12, scale 2 */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  /** 거래 일자 */
  @Column({ type: 'date' })
  date: Date;

  /** 거래 설명 */
  @Column({ type: 'text' })
  description: string;

  /** 정기 결제 여부 (구독료, 월급 등) */
  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  /** 투입 시간 (시간 단위, 소수점 허용) - 수익 창출에 걸린 시간 */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hours: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
