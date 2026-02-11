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

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 }) // Up to 999,999,999.99
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean; // 정기 결제 여부 (구독료 등)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
