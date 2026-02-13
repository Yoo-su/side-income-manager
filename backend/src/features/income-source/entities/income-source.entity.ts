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

  /** 수입원 이름 (예: 사이드 프로젝트 A, 외주 B) */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** 수입원 유형 (프리랜서, 프로젝트, 패시브 인컴 등) */
  @Column({
    type: 'enum',
    enum: IncomeSourceType,
    default: IncomeSourceType.ETC,
  })
  type: IncomeSourceType;

  /** 수입원 상세 설명 */
  @Column({ type: 'text', nullable: true })
  description: string;

  /** 활성화 여부 (false일 경우 보관됨) */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.incomeSource)
  transactions: Transaction[];
}
