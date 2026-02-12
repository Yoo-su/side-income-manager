import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: '거래 내역 생성' })
  @ApiResponse({
    status: 201,
    description: '거래 내역이 생성되었습니다.',
    type: Transaction,
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 거래 내역 조회 (필터링 가능)' })
  @ApiResponse({
    status: 200,
    description: '모든 거래 내역을 반환합니다.',
    type: [Transaction],
  })
  @ApiQuery({
    name: 'sourceId',
    required: false,
    description: '수입원 ID로 필터링',
  })
  findAll(@Query('sourceId') sourceId?: string) {
    if (sourceId) {
      return this.transactionService.findAllBySourceId(sourceId);
    }
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 거래 내역 조회' })
  @ApiResponse({
    status: 200,
    description: '특정 거래 내역을 반환합니다.',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: '거래 내역을 찾을 수 없습니다.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '거래 내역 수정' })
  @ApiResponse({
    status: 200,
    description: '거래 내역이 수정되었습니다.',
    type: Transaction,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '거래 내역 삭제' })
  @ApiResponse({ status: 200, description: '거래 내역이 삭제되었습니다.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionService.remove(id);
  }
}
