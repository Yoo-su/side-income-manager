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
   * @param userId 사용자 ID
   * @returns 생성된 수입원
   */
  async create(
    createIncomeSourceDto: CreateIncomeSourceDto,
    userId: string,
  ): Promise<IncomeSource> {
    const incomeSource = this.incomeSourceRepository.create({
      ...createIncomeSourceDto,
      userId,
    });
    return await this.incomeSourceRepository.save(incomeSource);
  }

  /**
   * 사용자의 모든 수입원 목록을 조회합니다. (생성일 내림차순 정렬)
   * @param userId 사용자 ID
   * @returns 수입원 목록
   */
  async findAll(userId: string): Promise<IncomeSource[]> {
    return await this.incomeSourceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 특정 ID의 수입원을 조회합니다. (본인 것만)
   * @param id 수입원 ID
   * @param userId 사용자 ID
   * @returns 수입원 정보
   * @throws NotFoundException 해당 ID의 수입원이 없을 경우
   */
  async findOne(id: string, userId: string): Promise<IncomeSource> {
    const incomeSource = await this.incomeSourceRepository.findOne({
      where: { id, userId },
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
   * @param userId 사용자 ID
   * @returns 수정된 수입원 정보
   */
  async update(
    id: string,
    updateIncomeSourceDto: UpdateIncomeSourceDto,
    userId: string,
  ): Promise<IncomeSource> {
    const incomeSource = await this.findOne(id, userId);
    Object.assign(incomeSource, updateIncomeSourceDto);
    return await this.incomeSourceRepository.save(incomeSource);
  }

  /**
   * 수입원을 삭제합니다.
   * @param id 수입원 ID
   * @param userId 사용자 ID
   * @throws NotFoundException 해당 ID의 수입원이 없을 경우
   */
  async remove(id: string, userId: string): Promise<void> {
    const result = await this.incomeSourceRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`IncomeSource with ID ${id} not found`);
    }
  }
}
