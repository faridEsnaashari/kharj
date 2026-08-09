import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User } from 'src/user/entities/user.entity';
import {
  GetRecentActivityDto,
  getRecentActivityDtoSchema,
} from './dtos/get-all-transactions.dto';

@Controller('transaction')
@UseGuards(HasAccessGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('recent-activity')
  @UsePipes(new ZodValidationPipe(getRecentActivityDtoSchema))
  async getRecentActivity(
    @Req() req: { user: User },
    @Query() query: GetRecentActivityDto,
  ) {
    return this.transactionService.getRecentActivity(query, req.user);
  }
}
