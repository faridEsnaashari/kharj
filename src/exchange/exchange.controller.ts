import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User } from 'src/user/entities/user.entity';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import {
  createExchangeDtoSchema,
  CreateExchangeDto,
} from './dtos/create-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createExchangeDtoSchema))
  @UseGuards(HasAccessGuard)
  async createExchange(
    @Req() req: { user: User },
    @Body() dto: CreateExchangeDto,
  ) {
    return this.exchangeService.createExchange(dto, req.user);
  }
}
