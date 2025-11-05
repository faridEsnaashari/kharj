import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import {
  CreateIncome,
  Income,
  IncomeModel,
  UpdateIncome,
} from '../income.entity';

@Injectable()
export class IncomeRepository extends CommonRepository<
  Income,
  CreateIncome,
  UpdateIncome,
  IncomeModel
> {
  constructor(@InjectModel(IncomeModel) model: typeof IncomeModel) {
    super(model);
  }
}
