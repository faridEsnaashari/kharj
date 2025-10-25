import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAccount,
  Account,
  AccountModel,
  UpdateAccount,
} from '../account.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel(AccountModel)
    private accountModel: typeof AccountModel,
  ) {}

  async create(account: CreateAccount, raw = true): Promise<Account> {
    const result = await this.accountModel.create(account);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async pagination(
    conditions: FindOptions<Account> | WhereOptions<Account>,
    raw = true,
  ): Promise<Paginated<Account>> {
    const result = await this.accountModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateAccount)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<Account> | WhereOptions<Account>,
    raw = true,
  ): Promise<Account[]> {
    const result = await this.accountModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateAccount)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<Account> | WhereOptions<Account>,
    raw = true,
  ): Promise<Account | null> {
    const result = await this.accountModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateAccount)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async updateOneById(data: UpdateAccount, id: Account['id']): Promise<void> {
    await this.accountModel.update(data, { where: { id } });
  }

  async findOneById(id: Account['id'], raw = true): Promise<Account | null> {
    const result = await this.accountModel.findByPk(id);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(id: Account['id'], raw = true): Promise<Account> {
    const result = await this.findOneById(id, raw);
    if (!result) throw new NotFoundException('Account not found');
    return result;
  }

  async findOneOrFail(
    conditions: FindOptions<Account> | WhereOptions<Account>,
    raw = true,
  ): Promise<Account> {
    const result = await this.findOne(conditions, raw);

    if (!result) {
      throw new NotFoundException('account not found');
    }

    return result;
  }
}
