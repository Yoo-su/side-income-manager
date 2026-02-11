import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeSource } from './entities/income-source.entity';
import {
  CreateIncomeSourceDto,
  UpdateIncomeSourceDto,
} from './dto/create-income-source.dto';

@Injectable()
export class IncomeSourceService {
  constructor(
    @InjectRepository(IncomeSource)
    private readonly incomeSourceRepository: Repository<IncomeSource>,
  ) {}

  async create(
    createIncomeSourceDto: CreateIncomeSourceDto,
  ): Promise<IncomeSource> {
    const incomeSource = this.incomeSourceRepository.create(
      createIncomeSourceDto,
    );
    return await this.incomeSourceRepository.save(incomeSource);
  }

  async findAll(): Promise<IncomeSource[]> {
    return await this.incomeSourceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<IncomeSource> {
    const incomeSource = await this.incomeSourceRepository.findOne({
      where: { id },
    });
    if (!incomeSource) {
      throw new NotFoundException(`IncomeSource with ID ${id} not found`);
    }
    return incomeSource;
  }

  async update(
    id: string,
    updateIncomeSourceDto: UpdateIncomeSourceDto,
  ): Promise<IncomeSource> {
    const incomeSource = await this.findOne(id);
    Object.assign(incomeSource, updateIncomeSourceDto);
    return await this.incomeSourceRepository.save(incomeSource);
  }

  async remove(id: string): Promise<void> {
    const result = await this.incomeSourceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`IncomeSource with ID ${id} not found`);
    }
  }
}
