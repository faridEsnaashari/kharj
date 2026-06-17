import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { User } from 'src/user/entities/user.entity';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { UncompletePaymentService } from './uncomplete-payment.service';
import {
  UploadPaymentDto,
  uploadPaymentDtoSchema,
} from './dtos/upload-payment.dto';
import {
  GetAllUncompletePaymentsDto,
  getAllUncompletePaymentsDtoSchema,
} from './dtos/get-all-uncomplete-payment.dto';
import { PaymentTextDto, PaymentTextDtoSchema } from './dtos/payment-text.dto';
import {
  DeleteUncompletePaymentsDto,
  deleteUncompletePaymentsDtoSchema,
} from './dtos/delete-uncomplete-payment.dto';

@Controller('uncomplete-payments')
export class UncompletePaymentController {
  constructor(private uncompletePaymentService: UncompletePaymentService) {}

  @Post('upload/bank-export')
  @UsePipes(new ZodValidationPipe(uploadPaymentDtoSchema))
  @UseGuards(HasAccessGuard)
  async uploadPayment(
    @Body() dto: UploadPaymentDto,
    @Req() req: { user: User },
  ) {
    return this.uncompletePaymentService.uploadBandExport(dto, req.user);
  }

  @Get('')
  @UseGuards(HasAccessGuard)
  @UsePipes(new ZodValidationPipe(getAllUncompletePaymentsDtoSchema))
  async getAllUncompletePayments(
    @Req() req: { user: User },
    @Query() query: GetAllUncompletePaymentsDto,
  ) {
    return this.uncompletePaymentService.getAllUncompletePayments(
      query,
      req.user,
    );
  }

  @Post('text')
  @UsePipes(new ZodValidationPipe(PaymentTextDtoSchema))
  @UseGuards(HasAccessGuard)
  async paymentText(@Body() dto: PaymentTextDto, @Req() req: { user: User }) {
    return this.uncompletePaymentService.paymentText(dto, req.user);
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(deleteUncompletePaymentsDtoSchema))
  @UseGuards(HasAccessGuard)
  async deleteUncompletePayment(
    @Param() dto: DeleteUncompletePaymentsDto,
    @Req() req: { user: User },
  ) {
    return this.uncompletePaymentService.deleteUncompletePayment(dto, req.user);
  }
}
