import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

export enum IncomeSourceType {
  FREELANCE = 'FREELANCE',
  PROJECT = 'PROJECT',
  PASSIVE = 'PASSIVE',
  ETC = 'ETC',
}

@Entity('income_sources')
export class IncomeSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: IncomeSourceType,
    default: IncomeSourceType.ETC,
  })
  type: IncomeSourceType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.incomeSource)
  transactions: Transaction[];
}
