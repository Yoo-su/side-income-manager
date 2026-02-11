import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeSourceService } from './income-source.service';
import { IncomeSourceController } from './income-source.controller';
import { IncomeSource } from './entities/income-source.entity';

import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeSource]), TransactionModule],
  controllers: [IncomeSourceController],
  providers: [IncomeSourceService],
  exports: [IncomeSourceService],
})
export class IncomeSourceModule {}
