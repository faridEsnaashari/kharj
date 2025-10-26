import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import {
  CreateExchange,
  Exchange,
  ExchangeModel,
  UpdateExchange,
} from '../exchange.entity';

@Injectable()
export class ExchangeRepository {
  constructor(
    @InjectModel(ExchangeModel)
    private exchangeModel: typeof ExchangeModel,
  ) {}

  async create(data: CreateExchange, raw = true): Promise<Exchange> {
    const result = await this.exchangeModel.create(data);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<Exchange> | WhereOptions<Exchange>,
    raw = true,
  ): Promise<Exchange[]> {
    const result = await this.exchangeModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateExchange)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<Exchange> | WhereOptions<Exchange>,
    raw = true,
  ): Promise<Exchange | null> {
    const result = await this.exchangeModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateExchange)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneById(id: Exchange['id'], raw = true): Promise<Exchange | null> {
    const result = await this.exchangeModel.findByPk(id);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(id: Exchange['id'], raw = true): Promise<Exchange> {
    const result = await this.findOneById(id, raw);
    if (!result) throw new NotFoundException('exchange not found');
    return result;
  }

  async updateOneById(data: UpdateExchange, id: Exchange['id']): Promise<void> {
    await this.exchangeModel.update(data, { where: { id } });
  }
}
