import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import {
  AccountDebt,
  AccountDebtModel,
  CreateAccountDebt,
  UpdateAccountDebt,
} from '../account-debt.entity';

@Injectable()
export class AccountDebtRepository extends CommonRepository<
  AccountDebt,
  CreateAccountDebt,
  UpdateAccountDebt,
  AccountDebtModel
> {
  constructor(@InjectModel(AccountDebtModel) model: typeof AccountDebtModel) {
    super(model);
  }
}
