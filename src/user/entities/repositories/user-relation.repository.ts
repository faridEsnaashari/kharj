import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import {
  UserRelation,
  UserRelationModel,
  CreateUserRelation,
  UpdateUserRelation,
} from '../user-relation.entity';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class UserRelationRepository {
  constructor(
    @InjectModel(UserRelationModel)
    private userRelationModel: typeof UserRelationModel,
  ) {}

  async create(data: CreateUserRelation, raw = true): Promise<UserRelation> {
    const result = await this.userRelationModel.create(data);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async pagination(
    conditions: FindOptions<UserRelation> | WhereOptions<UserRelation>,
    raw = true,
  ): Promise<Paginated<UserRelation>> {
    const result = await this.userRelationModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateUserRelation)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<UserRelation> | WhereOptions<UserRelation>,
    raw = true,
  ): Promise<UserRelation[]> {
    const result = await this.userRelationModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateUserRelation)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<UserRelation> | WhereOptions<UserRelation>,
    raw = true,
  ): Promise<UserRelation | null> {
    const result = await this.userRelationModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateUserRelation)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async updateOneById(
    data: UpdateUserRelation,
    id: UserRelation['id'],
  ): Promise<void> {
    await this.userRelationModel.update(data, { where: { id } });
  }

  async findOneById(
    id: UserRelation['id'],
    raw = true,
  ): Promise<UserRelation | null> {
    const result = await this.userRelationModel.findByPk(id);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(
    id: UserRelation['id'],
    raw = true,
  ): Promise<UserRelation> {
    const result = await this.findOneById(id, raw);
    if (!result) throw new NotFoundException('User relation not found');
    return result;
  }
}
