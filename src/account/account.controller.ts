import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  createAccountDtoSchema,
} from './dtos/create-account.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':id')
  async findOneAccount(@Param('id') id: number) {
    return this.accountService.findOneAccount(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountDtoSchema))
  @UseGuards(HasAccessGuard)
  async createAccount(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto);
  }
}
