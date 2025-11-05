import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Account,
  AccountModel,
  CreateAccount,
  UpdateAccount,
} from '../account.entity';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';

@Injectable()
export class AccountRepository extends CommonRepository<
  Account,
  CreateAccount,
  UpdateAccount,
  AccountModel
> {
  constructor(@InjectModel(AccountModel) model: typeof AccountModel) {
    super(model);
  }
}
