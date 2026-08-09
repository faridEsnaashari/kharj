import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import { CreateUnit, UpdateUnit, Unit, UnitModel } from '../unit.entity';

@Injectable()
export class UnitRepository extends CommonRepository<
  Unit,
  CreateUnit,
  UpdateUnit,
  UnitModel
> {
  constructor(@InjectModel(UnitModel) model: typeof UnitModel) {
    super(model);
  }
}
