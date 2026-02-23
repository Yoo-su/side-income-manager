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
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.create(createTransactionDto, user.id);
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
  @ApiQuery({
    name: 'page',
    required: false,
    description: '조회할 페이지 번호 (기본: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 항목 수 (기본: 20)',
    type: Number,
  })
  findAll(
    @CurrentUser() user: User,
    @Query('sourceId') sourceId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    if (sourceId) {
      return this.transactionService.findAllBySourceId(
        sourceId,
        page,
        limit,
        user.id,
      );
    }
    return this.transactionService.findAll(page, limit, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 거래 내역 조회' })
  @ApiResponse({
    status: 200,
    description: '특정 거래 내역을 반환합니다.',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: '거래 내역을 찾을 수 없습니다.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.transactionService.findOne(id, user.id);
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
    @CurrentUser() user: User,
  ) {
    return this.transactionService.update(id, updateTransactionDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '거래 내역 삭제' })
  @ApiResponse({ status: 200, description: '거래 내역이 삭제되었습니다.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.transactionService.remove(id, user.id);
  }
}
