import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  createAccountDtoSchema,
} from './dtos/create-account.dto';
import {
  GetAllAccountsDto,
  getAllAccountsDtoSchema,
} from './dtos/get-all-account.dto';
import {
  GetAccountStatisticDto,
  getAccountStatisticDtoSchema,
} from './dtos/get-account-statistic.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { User } from 'src/user/entities/user.entity';

@Controller('account')
@UseGuards(HasAccessGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getAllAccountsDtoSchema))
  async findAllAccounts(
    @Req() req: { user: User },
    @Query() query: GetAllAccountsDto,
  ) {
    return this.accountService.findAllAccounts(query, req.user);
  }

  @Get('static/group-by-unit')
  @UsePipes(new ZodValidationPipe(getAccountStatisticDtoSchema))
  async getGroupByUnit(
    @Req() req: { user: User },
    @Query() query: GetAccountStatisticDto,
  ) {
    return this.accountService.getGroupByUnit(query, req.user);
  }

  @Get('static/weekly-payment-income')
  @UsePipes(new ZodValidationPipe(getAccountStatisticDtoSchema))
  async getWeeklyPaymentIncome(
    @Req() req: { user: User },
    @Query() query: GetAccountStatisticDto,
  ) {
    return this.accountService.getWeeklyPaymentIncome(query, req.user);
  }

  @Get(':id')
  async findOneAccount(@Param('id') id: number, @Req() req: { user: User }) {
    return this.accountService.findOneAccount(id, req.user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountDtoSchema))
  async createAccount(
    @Req() req: { user: User },
    @Body() dto: CreateAccountDto,
  ) {
    return this.accountService.createAccount(dto, req.user);
  }
}
