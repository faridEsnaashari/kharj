import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import { CreateBank, UpdateBank, Bank, BankModel } from '../bank.entity';

@Injectable()
export class BankRepository extends CommonRepository<
  Bank,
  CreateBank,
  UpdateBank,
  BankModel
> {
  constructor(@InjectModel(BankModel) model: typeof BankModel) {
    super(model);
  }
}
