import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import {
  CreateUncompeletePayment,
  UncompeletePayment,
  UncompeletePaymentModel,
  UpdateUncompeletePayment,
} from '../uncompelete-payment.entity';

@Injectable()
export class UncompeletePaymentRepository extends CommonRepository<
  UncompeletePayment,
  CreateUncompeletePayment,
  UpdateUncompeletePayment,
  UncompeletePaymentModel
> {
  constructor(
    @InjectModel(UncompeletePaymentModel) model: typeof UncompeletePaymentModel,
  ) {
    super(model);
  }
}
