import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
