import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { User } from 'src/user/entities/user.entity';
import { CreateBankDto, createBankDtoSchema } from './dtos/create-bank.dto';
import { UpdateBankDto, updateBankDtoSchema } from './dtos/update-bank.dto';
import { GetAllBankDto, getAllBankDtoSchema } from './dtos/get-all-bank.dto';

@Controller('bank')
@UseGuards(HasAccessGuard)
export class BankController {
  constructor(private bankService: BankService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getAllBankDtoSchema))
  async findAllBanks(
    @Req() req: { user: User },
    @Query() query: GetAllBankDto,
  ) {
    return this.bankService.findAllBanks(query, req.user);
  }

  @Get(':id')
  async findOneBank(@Param('id') id: number, @Req() req: { user: User }) {
    return this.bankService.findOneBank(id, req.user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createBankDtoSchema))
  async createBank(@Req() req: { user: User }, @Body() dto: CreateBankDto) {
    return this.bankService.createBank(dto, req.user);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateBankDtoSchema))
  async updateBank(
    @Param('id') id: number,
    @Req() req: { user: User },
    @Body() dto: UpdateBankDto,
  ) {
    return this.bankService.updateBank(id, dto, req.user);
  }

  @Delete(':id')
  async deleteBank(@Param('id') id: number, @Req() req: { user: User }) {
    return this.bankService.deleteBank(id, req.user);
  }
}
