import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountDebt,
  AccountDebtModel,
  CreateAccountDebt,
  UpdateAccountDebt,
} from '../account-debt.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';

@Injectable()
export class AccountDebtRepository {
  constructor(
    @InjectModel(AccountDebtModel)
    private accountDebtModel: typeof AccountDebtModel,
  ) {}

  async create(data: CreateAccountDebt, raw = true): Promise<AccountDebt> {
    const result = await this.accountDebtModel.create(data);
    if (raw) return JSON.parse(JSON.stringify(result));
    return result;
  }

  async findAll(
    conditions: FindOptions<AccountDebt> | WhereOptions<AccountDebt>,
    raw = true,
  ): Promise<AccountDebt[]> {
    const result = await this.accountDebtModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateAccountDebt)
        : undefined,
      ...conditions,
    });
    if (raw) return JSON.parse(JSON.stringify(result));
    return result;
  }

  async findOne(
    conditions: FindOptions<AccountDebt> | WhereOptions<AccountDebt>,
    raw = true,
  ): Promise<AccountDebt | null> {
    const result = await this.accountDebtModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateAccountDebt)
        : undefined,
      ...conditions,
    });
    if (raw) return JSON.parse(JSON.stringify(result));
    return result;
  }

  async updateOneById(
    data: UpdateAccountDebt,
    id: AccountDebt['id'],
  ): Promise<void> {
    await this.accountDebtModel.update(data, { where: { id } });
  }

  async findOneOrFail(
    conditions: FindOptions<AccountDebt> | WhereOptions<AccountDebt>,
    raw = true,
  ): Promise<AccountDebt> {
    const result = await this.findOne(conditions, raw);
    if (!result) throw new NotFoundException('AccountDebt not found');
    return result;
  }

  async findOneByIdOrFail(
    id: AccountDebt['id'],
    raw = true,
  ): Promise<AccountDebt> {
    const result = await this.accountDebtModel.findByPk(id);
    if (!result) throw new NotFoundException('AccountDebt not found');
    if (raw) return JSON.parse(JSON.stringify(result));
    return result;
  }
}
