import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUser, User, UserModel, UpdateUser } from '../user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async create(user: CreateUser, raw = true): Promise<User> {
    const result = await this.userModel.create(user);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async pagination(
    conditions: FindOptions<User> | WhereOptions<User>,
    raw = true,
  ): Promise<Paginated<User>> {
    const result = await this.userModel.findAndCountAll({
      where: !('where' in conditions) ? (conditions as UpdateUser) : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findAll(
    conditions: FindOptions<User> | WhereOptions<User>,
    raw = true,
  ): Promise<User[]> {
    const result = await this.userModel.findAll({
      where: !('where' in conditions) ? (conditions as UpdateUser) : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<User> | WhereOptions<User>,
    raw = true,
  ): Promise<User | null> {
    const result = await this.userModel.findOne({
      where: !('where' in conditions) ? (conditions as UpdateUser) : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async updateOneById(data: UpdateUser, id: User['id']): Promise<undefined> {
    await this.userModel.update(data, { where: { id } });
  }

  async findOneById(id: User['id'], raw = true): Promise<User | null> {
    const result = await this.userModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneOrFail(
    conditions: FindOptions<User> | WhereOptions<User>,
    raw = true,
  ): Promise<User> {
    const result = await this.findOne(conditions, raw);

    if (!result) {
      throw new NotFoundException('user not found');
    }

    return result;
  }

  async findOneByIdOrFail(id: User['id'], raw = true): Promise<User> {
    const result = await this.findOneById(id, raw);

    if (!result) {
      throw new NotFoundException('user not found');
    }

    return result;
  }
}
