import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UncompletePayment,
  UncompletePaymentModel,
  CreateUncompletePayment,
  UpdateUncompletePayment,
} from '../uncomplete-payment.entity';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';

@Injectable()
export class UncompletePaymentRepository extends CommonRepository<
  UncompletePayment,
  CreateUncompletePayment,
  UpdateUncompletePayment,
  UncompletePaymentModel
> {
  constructor(
    @InjectModel(UncompletePaymentModel) model: typeof UncompletePaymentModel,
  ) {
    super(model);
  }
}
