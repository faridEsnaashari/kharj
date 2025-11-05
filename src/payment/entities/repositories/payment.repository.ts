import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Payment,
  PaymentModel,
  CreatePayment,
  UpdatePayment,
} from '../payment.entity';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';

@Injectable()
export class PaymentRepository extends CommonRepository<
  Payment,
  CreatePayment,
  UpdatePayment,
  PaymentModel
> {
  constructor(@InjectModel(PaymentModel) model: typeof PaymentModel) {
    super(model);
  }
}
