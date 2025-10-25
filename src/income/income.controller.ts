import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get(':id')
  async findOneIncome(@Param('id') id: number) {
    return this.incomeService.findOneIncome(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createIncomeDtoSchema))
  @UseGuards(HasAccessGuard)
  async createIncome(@Req() req: { user: User }, @Body() dto: CreateIncomeDto) {
    return this.incomeService.createIncome(dto, req.user);
  }
}
