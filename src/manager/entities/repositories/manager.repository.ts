import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateManager,
  Manager,
  ManagerModel,
  UpdateManager,
} from '../manager.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class ManagerRepository {
  constructor(
    @InjectModel(ManagerModel)
    private managerModel: typeof ManagerModel,
  ) {}

  async create(manager: CreateManager, raw = true): Promise<Manager> {
    const result = await this.managerModel.create(manager);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async pagination(
    conditions: FindOptions<Manager> | WhereOptions<Manager>,
    raw = true,
  ): Promise<Paginated<Manager>> {
    const result = await this.managerModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateManager)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findAll(
    conditions: FindOptions<Manager> | WhereOptions<Manager>,
    raw = true,
  ): Promise<Manager[]> {
    const result = await this.managerModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateManager)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<Manager> | WhereOptions<Manager>,
    raw = true,
  ): Promise<Manager | null> {
    const result = await this.managerModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateManager)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async updateOneById(
    data: UpdateManager,
    id: Manager['id'],
  ): Promise<undefined> {
    await this.managerModel.update(data, { where: { id } });
  }

  async findOneById(id: Manager['id'], raw = true): Promise<Manager | null> {
    const result = await this.managerModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneByIdOrFail(id: Manager['id'], raw = true): Promise<Manager> {
    const result = await this.findOneById(id, raw);

    if (!result) {
      throw new NotFoundException('manager not found');
    }

    return result;
  }
}
