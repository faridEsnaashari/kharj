import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateExpert,
  Expert,
  ExpertModel,
  UpdateExpert,
} from '../expert.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class ExpertRepository {
  constructor(
    @InjectModel(ExpertModel)
    private expertModel: typeof ExpertModel,
  ) {}

  async create(expert: CreateExpert, raw = true): Promise<Expert> {
    const result = await this.expertModel.create(expert);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async pagination(
    conditions: FindOptions<Expert> | WhereOptions<Expert>,
    raw = true,
  ): Promise<Paginated<Expert>> {
    const result = await this.expertModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateExpert)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findAll(
    conditions: FindOptions<Expert> | WhereOptions<Expert>,
    raw = true,
  ): Promise<Expert[]> {
    const result = await this.expertModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateExpert)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<Expert> | WhereOptions<Expert>,
    raw = true,
  ): Promise<Expert | null> {
    const result = await this.expertModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateExpert)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async updateOneById(
    data: UpdateExpert,
    id: Expert['id'],
  ): Promise<undefined> {
    await this.expertModel.update(data, { where: { id } });
  }

  async findOneById(id: Expert['id'], raw = true): Promise<Expert | null> {
    const result = await this.expertModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneByIdOrFail(id: Expert['id'], raw = true): Promise<Expert> {
    const result = await this.findOneById(id, raw);

    if (!result) {
      throw new NotFoundException('expert not found');
    }

    return result;
  }
}
