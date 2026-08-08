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
import { PaymentService } from './payment.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User } from 'src/user/entities/user.entity';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import {
  CreatePaymentDto,
  createPaymentDtoSchema,
} from './dtos/craete-payment.dto';
import {
  GetAllPaymentsDto,
  getAllPaymentsDtoSchema,
} from './dtos/get-all-payment.dto';
import {
  UpdatePaymentDto,
  updatePaymentDtoSchema,
} from './dtos/update-payment.dto';

@Controller('payment')
@UseGuards(HasAccessGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('categories')
  getPaymentCategories() {
    return this.paymentService.getPaymentCategories();
  }

  @Get()
  @UsePipes(new ZodValidationPipe(getAllPaymentsDtoSchema))
  async getAllPayments(
    @Req() req: { user: User },
    @Query() query: GetAllPaymentsDto,
  ) {
    return this.paymentService.getAllPayments(query, req.user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createPaymentDtoSchema))
  async createPayment(
    @Req() req: { user: User },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(dto, req.user);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updatePaymentDtoSchema))
  async updatePayment(
    @Param('id') id: number,
    @Req() req: { user: User },
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentService.updatePayment(id, dto, req.user);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: number, @Req() req: { user: User }) {
    return this.paymentService.deletePayment(id, req.user);
  }
}
