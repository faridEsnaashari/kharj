import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { Paginated, PaginationData } from 'src/common/types/pagination.type';

@Injectable()
export class CommonRepository<
  T extends Record<string, unknown>,
  TCreate extends Record<string, unknown>,
  TUpdate extends Record<string, unknown>,
  TModel extends Model<T, TCreate>,
> {
  constructor(
    @InjectModel(Model)
    private readonly model: ModelCtor<TModel>,
  ) {}

  async create(entity: TCreate, raw?: true): Promise<T>;
  async create(entity: TCreate, raw?: false): Promise<TModel>;
  async create(entity: TCreate, raw?: boolean): Promise<T | TModel>;
  async create(entity: TCreate, raw = true): Promise<T | TModel> {
    const result = await this.model.create(
      entity as unknown as MakeNullishOptional<TCreate>,
    );
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async pagination(
    conditions: FindOptions<T> | WhereOptions<T>,
    ginationData: PaginationData,
    raw?: true,
  ): Promise<Paginated<T>>;
  async pagination(
    conditions: FindOptions<T> | WhereOptions<T>,
    paginationData: PaginationData,
    raw?: false,
  ): Promise<Paginated<TModel>>;
  async pagination(
    conditions: FindOptions<T> | WhereOptions<T>,
    paginationData: PaginationData,
    raw = true,
  ): Promise<Paginated<T | TModel>> {
    const limit = paginationData.size || 10;
    const offset = ((paginationData.page || 1) - 1) * limit;

    const result = await this.model.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as WhereOptions<T>)
        : undefined,
      limit,
      offset,
      order: [['id', 'ASC']],
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: true,
  ): Promise<T[]>;
  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: false,
  ): Promise<TModel[]>;
  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: boolean,
  ): Promise<T[] | TModel[]>;
  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw = true,
  ): Promise<T[] | TModel[]> {
    const result = await this.model.findAll({
      where: !('where' in conditions)
        ? (conditions as WhereOptions<T>)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: true,
  ): Promise<null | T>;
  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: false,
  ): Promise<null | TModel>;
  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: boolean,
  ): Promise<T | null | TModel>;
  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw = true,
  ): Promise<T | null | TModel> {
    const result = await this.model.findOne({
      where: !('where' in conditions)
        ? (conditions as WhereOptions<T>)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async updateOneById(data: TUpdate, id: number): Promise<void> {
    await this.model.update(data as Partial<T>, {
      where: { id } as unknown as WhereOptions<T>,
    });
  }

  async findOneById(id: number, raw?: true): Promise<null | T>;
  async findOneById(id: number, raw?: false): Promise<null | TModel>;
  async findOneById(id: number, raw?: boolean): Promise<T | null | TModel>;
  async findOneById(id: number, raw = true): Promise<T | null | TModel> {
    const result = await this.model.findByPk(id);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(id: number, raw?: true): Promise<T>;
  async findOneByIdOrFail(id: number, raw?: false): Promise<TModel>;
  async findOneByIdOrFail(id: number, raw?: boolean): Promise<T | TModel>;
  async findOneByIdOrFail(id: number, raw = true): Promise<T | TModel> {
    const result = await this.findOneById(id, raw);
    if (!result) throw new NotFoundException(`${this.model.name} not found`);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: true,
  ): Promise<T>;
  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: false,
  ): Promise<TModel>;
  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: boolean,
  ): Promise<T | TModel>;
  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw = true,
  ): Promise<T | TModel> {
    const result = await this.findOne(conditions, raw);

    if (!result) {
      throw new NotFoundException('user not found');
    }

    return result;
  }
}
