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

  /**
   * 새로운 수입원을 생성합니다.
   * @param createIncomeSourceDto 수입원 생성 DTO
   * @returns 생성된 수입원
   */
  async create(
    createIncomeSourceDto: CreateIncomeSourceDto,
  ): Promise<IncomeSource> {
    const incomeSource = this.incomeSourceRepository.create(
      createIncomeSourceDto,
    );
    return await this.incomeSourceRepository.save(incomeSource);
  }

  /**
   * 모든 수입원 목록을 조회합니다. (생성일 내림차순 정렬)
   * @returns 수입원 목록
   */
  async findAll(): Promise<IncomeSource[]> {
    return await this.incomeSourceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 특정 ID의 수입원을 조회합니다.
   * @param id 수입원 ID
   * @returns 수입원 정보
   * @throws NotFoundException 해당 ID의 수입원이 없을 경우
   */
  async findOne(id: string): Promise<IncomeSource> {
    const incomeSource = await this.incomeSourceRepository.findOne({
      where: { id },
    });
    if (!incomeSource) {
      throw new NotFoundException(`IncomeSource with ID ${id} not found`);
    }
    return incomeSource;
  }

  /**
   * 수입원 정보를 수정합니다.
   * @param id 수입원 ID
   * @param updateIncomeSourceDto 수정할 데이터 DTO
   * @returns 수정된 수입원 정보
   */
  async update(
    id: string,
    updateIncomeSourceDto: UpdateIncomeSourceDto,
  ): Promise<IncomeSource> {
    const incomeSource = await this.findOne(id);
    Object.assign(incomeSource, updateIncomeSourceDto);
    return await this.incomeSourceRepository.save(incomeSource);
  }

  /**
   * 수입원을 삭제합니다.
   * @param id 수입원 ID
   * @throws NotFoundException 해당 ID의 수입원이 없을 경우
   */
  async remove(id: string): Promise<void> {
    const result = await this.incomeSourceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`IncomeSource with ID ${id} not found`);
    }
  }
}
