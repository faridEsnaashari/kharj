import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateIncome,
  Income,
  IncomeModel,
  UpdateIncome,
} from '../income.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class IncomeRepository {
  constructor(
    @InjectModel(IncomeModel)
    private incomeModel: typeof IncomeModel,
  ) {}

  async create(income: CreateIncome, raw = true): Promise<Income> {
    const result = await this.incomeModel.create(income);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async pagination(
    conditions: FindOptions<Income> | WhereOptions<Income>,
    raw = true,
  ): Promise<Paginated<Income>> {
    const result = await this.incomeModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateIncome)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<Income> | WhereOptions<Income>,
    raw = true,
  ): Promise<Income[]> {
    const result = await this.incomeModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateIncome)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<Income> | WhereOptions<Income>,
    raw = true,
  ): Promise<Income | null> {
    const result = await this.incomeModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateIncome)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async updateOneById(data: UpdateIncome, id: Income['id']): Promise<void> {
    await this.incomeModel.update(data, { where: { id } });
  }

  async findOneById(id: Income['id'], raw = true): Promise<Income | null> {
    const result = await this.incomeModel.findByPk(id);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(id: Income['id'], raw = true): Promise<Income> {
    const result = await this.findOneById(id, raw);
    if (!result) throw new NotFoundException('Income not found');
    return result;
  }
}
