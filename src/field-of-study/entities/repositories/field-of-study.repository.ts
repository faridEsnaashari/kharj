import { Injectable } from '@nestjs/common';
import {
  CreateFieldOfStudy,
  FieldOfStudy,
  FieldOfStudyModel,
  UpdateFieldOfStudy,
} from '../field-of-study.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class FieldOfStudyRepository {
  constructor(
    @InjectModel(FieldOfStudyModel)
    private fieldOfStudyModel: typeof FieldOfStudyModel,
  ) {}

  async create(
    fieldOfStudy: CreateFieldOfStudy,
    raw = true,
  ): Promise<FieldOfStudy> {
    const result = await this.fieldOfStudyModel.create(fieldOfStudy);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async pagination(
    conditions: FindOptions<FieldOfStudy> | WhereOptions<FieldOfStudy>,
    raw = true,
  ): Promise<Paginated<FieldOfStudy>> {
    const result = await this.fieldOfStudyModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateFieldOfStudy)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findAll(
    conditions: FindOptions<FieldOfStudy> | WhereOptions<FieldOfStudy>,
    raw = true,
  ): Promise<FieldOfStudy[]> {
    const result = await this.fieldOfStudyModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateFieldOfStudy)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<FieldOfStudy> | WhereOptions<FieldOfStudy>,
    raw = true,
  ): Promise<FieldOfStudy | null> {
    const result = await this.fieldOfStudyModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateFieldOfStudy)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async updateOneById(
    data: UpdateFieldOfStudy,
    id: FieldOfStudy['id'],
  ): Promise<undefined> {
    await this.fieldOfStudyModel.update(data, { where: { id } });
  }

  async findOneById(
    id: FieldOfStudy['id'],
    raw = true,
  ): Promise<FieldOfStudy | null> {
    const result = await this.fieldOfStudyModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }
}
