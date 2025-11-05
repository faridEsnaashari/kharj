import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import {
  CreateExchange,
  Exchange,
  ExchangeModel,
  UpdateExchange,
} from '../exchange.entity';

@Injectable()
export class ExchangeRepository extends CommonRepository<
  Exchange,
  CreateExchange,
  UpdateExchange,
  ExchangeModel
> {
  constructor(@InjectModel(ExchangeModel) model: typeof ExchangeModel) {
    super(model);
  }
}
