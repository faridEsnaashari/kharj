import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User } from 'src/user/entities/user.entity';
import { GetAllDebtDto, getAllDebtDtoSchema } from './dtos/get-all-debt.dto';

@Controller('debt')
@UseGuards(HasAccessGuard)
export class DebtController {
  constructor(private debtService: DebtService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getAllDebtDtoSchema))
  async getAllDebts(@Req() req: { user: User }, @Query() query: GetAllDebtDto) {
    return this.debtService.getAllDebts(query, req.user);
  }
}
