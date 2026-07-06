import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { User } from 'src/user/entities/user.entity';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  CreateIncomeDto,
  createIncomeDtoSchema,
} from './dtos/create-income.dto';
import {
  UpdateIncomeDto,
  updateIncomeDtoSchema,
} from './dtos/update-income.dto';
import {
  GetAllIncomeDto,
  getAllIncomeDtoSchema,
} from './dtos/get-all-income.dto';

@Controller('income')
@UseGuards(HasAccessGuard)
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getAllIncomeDtoSchema))
  async getAllIncomes(
    @Req() req: { user: User },
    @Query() query: GetAllIncomeDto,
  ) {
    return this.incomeService.getAllIncomes(query, req.user);
  }

  @Get(':id')
  async findOneIncome(@Param('id') id: number) {
    return this.incomeService.findOneIncome(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createIncomeDtoSchema))
  async createIncome(@Req() req: { user: User }, @Body() dto: CreateIncomeDto) {
    return this.incomeService.createIncome(dto, req.user);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateIncomeDtoSchema))
  async updateIncome(
    @Param('id') id: number,
    @Req() req: { user: User },
    @Body() dto: UpdateIncomeDto,
  ) {
    return this.incomeService.updateIncome(id, dto, req.user);
  }
}
