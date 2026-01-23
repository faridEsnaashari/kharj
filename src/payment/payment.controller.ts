import {
  Body,
  Controller,
  Get,
  Post,
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
  UploadPaymentDto,
  uploadPaymentDtoSchema,
} from './dtos/upload-payment.dto';
import {
  GetAllUncompeletePaymentsDto,
  getAllUncompeletePaymentsDtoSchema,
} from './dtos/get-all-uncompelete-payment.dto';
import { PaymentTextDto, PaymentTextDtoSchema } from './dtos/payment-text.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UseGuards(HasAccessGuard)
  @UsePipes(new ZodValidationPipe(createPaymentDtoSchema))
  async createPayment(
    @Req() req: { user: User },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(dto, req.user);
  }

  @Get()
  @UseGuards(HasAccessGuard)
  @UsePipes(new ZodValidationPipe(getAllPaymentsDtoSchema))
  async getAllPayments(
    @Req() req: { user: User },
    @Query() query: GetAllPaymentsDto,
  ) {
    return this.paymentService.getAllPayments(query, req.user);
  }

  @Post('upload/bank-export')
  @UsePipes(new ZodValidationPipe(uploadPaymentDtoSchema))
  @UseGuards(HasAccessGuard)
  async uploadPayment(
    @Body() dto: UploadPaymentDto,
    @Req() req: { user: User },
  ) {
    return this.paymentService.uploadBandExport(dto, req.user);
  }

  @Get('uncompeletes')
  @UseGuards(HasAccessGuard)
  @UsePipes(new ZodValidationPipe(getAllUncompeletePaymentsDtoSchema))
  async getAllUncompeletePayments(
    @Req() req: { user: User },
    @Query() query: GetAllUncompeletePaymentsDto,
  ) {
    return this.paymentService.getAllUncompeletePayments(query, req.user);
  }

  @Post('text')
  @UsePipes(new ZodValidationPipe(PaymentTextDtoSchema))
  @UseGuards(HasAccessGuard)
  async paymentText(@Body() dto: PaymentTextDto, @Req() req: { user: User }) {
    return this.paymentService.paymentText(dto, req.user);
  }
}
