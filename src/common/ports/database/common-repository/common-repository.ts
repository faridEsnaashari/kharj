import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Attributes,
  DestroyOptions,
  FindOptions,
  Transaction,
  WhereOptions,
} from 'sequelize';
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

  async create(
    entity: TCreate,
    dbTransactin?: Transaction,
    raw?: true,
  ): Promise<T>;
  async create(
    entity: TCreate,
    dbTransactin?: Transaction,
    raw?: false,
  ): Promise<TModel>;
  async create(
    entity: TCreate,
    dbTransactin?: Transaction,
    raw?: boolean,
  ): Promise<T | TModel>;
  async create(
    entity: TCreate,
    dbTransactin?: Transaction,
    raw = true,
  ): Promise<T | TModel> {
    const result = await this.model.create(
      entity as unknown as MakeNullishOptional<TCreate>,
      { transaction: dbTransactin },
    );

    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async bulkCreate(
    entity: TCreate[],
    dbTransactin?: Transaction,
    raw?: true,
  ): Promise<T[]>;
  async bulkCreate(
    entity: TCreate[],
    dbTransactin?: Transaction,
    raw?: false,
  ): Promise<TModel[]>;
  async bulkCreate(
    entity: TCreate[],
    dbTransactin?: Transaction,
    raw?: boolean,
  ): Promise<T[] | TModel[]>;
  async bulkCreate(
    entity: TCreate[],
    dbTransactin?: Transaction,
    raw = true,
  ): Promise<T[] | TModel[]> {
    const result = await this.model.bulkCreate(
      entity as unknown as MakeNullishOptional<TCreate>[],
      { transaction: dbTransactin },
    );
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async pagination(
    conditions: FindOptions<T> | WhereOptions<T>,
    paginationData: PaginationData,
    raw?: true,
    dbTransactin?: Transaction,
  ): Promise<Paginated<T>>;
  async pagination(
    conditions: FindOptions<T> | WhereOptions<T>,
    paginationData: PaginationData,
    raw?: false,
    dbTransactin?: Transaction,
  ): Promise<Paginated<TModel>>;
  async pagination(
    conditions: FindOptions<T> | WhereOptions<T>,
    paginationData: PaginationData,
    raw = true,
    dbTransactin?: Transaction,
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
      transaction: dbTransactin,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: true,
    dbTransactin?: Transaction,
  ): Promise<T[]>;
  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: false,
    dbTransactin?: Transaction,
  ): Promise<TModel[]>;
  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw?: boolean,
    dbTransactin?: Transaction,
  ): Promise<T[] | TModel[]>;
  async findAll(
    conditions: FindOptions<T> | WhereOptions<T>,
    raw = true,
    dbTransactin?: Transaction,
  ): Promise<T[] | TModel[]> {
    const result = await this.model.findAll({
      where: !('where' in conditions)
        ? (conditions as WhereOptions<T>)
        : undefined,
      transaction: dbTransactin,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw?: true,
  ): Promise<null | T>;
  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw?: false,
  ): Promise<null | TModel>;
  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw?: boolean,
  ): Promise<T | null | TModel>;
  async findOne(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw = true,
  ): Promise<T | null | TModel> {
    const result = await this.model.findOne({
      where: !('where' in conditions)
        ? (conditions as WhereOptions<T>)
        : undefined,
      transaction: dbTransactin,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async update(
    data: TUpdate,
    conditions: WhereOptions<T>,
    dbTransactin?: Transaction,
  ): Promise<void> {
    await this.model.update(data as Partial<T>, {
      where: { ...conditions } as unknown as WhereOptions<T>,
      transaction: dbTransactin,
    });
  }

  async updateOneById(
    data: TUpdate,
    id: number,
    dbTransactin?: Transaction,
  ): Promise<void> {
    await this.model.update(data as Partial<T>, {
      where: { id } as unknown as WhereOptions<T>,
      transaction: dbTransactin,
    });
  }

  async findOneById(
    id: number,
    dbTransactin?: Transaction,
    raw?: true,
  ): Promise<null | T>;
  async findOneById(
    id: number,
    dbTransactin?: Transaction,
    raw?: false,
  ): Promise<null | TModel>;
  async findOneById(
    id: number,
    dbTransactin?: Transaction,
    raw?: boolean,
  ): Promise<T | null | TModel>;
  async findOneById(
    id: number,
    dbTransactin?: Transaction,
    raw = true,
  ): Promise<T | null | TModel> {
    const result = await this.model.findByPk(id, { transaction: dbTransactin });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(
    id: number,
    dbTransactin?: Transaction,
    raw?: true,
  ): Promise<T>;
  async findOneByIdOrFail(
    id: number,
    dbTransactin?: Transaction,
    raw?: false,
  ): Promise<TModel>;
  async findOneByIdOrFail(
    id: number,
    dbTransactin?: Transaction,
    raw?: boolean,
  ): Promise<T | TModel>;
  async findOneByIdOrFail(
    id: number,
    dbTransactin?: Transaction,
    raw = true,
  ): Promise<T | TModel> {
    const result = await this.findOneById(id, dbTransactin, raw);
    if (!result) throw new NotFoundException(`${this.model.name} not found`);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw?: true,
  ): Promise<T>;
  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw?: false,
  ): Promise<TModel>;
  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw?: boolean,
  ): Promise<T | TModel>;
  async findOneOrFail(
    conditions: FindOptions<T> | WhereOptions<T>,
    dbTransactin?: Transaction,
    raw = true,
  ): Promise<T | TModel> {
    const result = await this.findOne(conditions, dbTransactin, raw);

    if (!result) {
      throw new NotFoundException('not found');
    }

    return result;
  }

  async delete(
    conditions: DestroyOptions<Attributes<TModel>>,
    dbTransactin?: Transaction,
  ): Promise<number> {
    return this.model.destroy({ ...conditions, transaction: dbTransactin });
  }

  async deleteById(id: number, dbTransactin?: Transaction): Promise<number> {
    return this.delete(
      { where: { id } } as unknown as Attributes<TModel>,
      dbTransactin,
    );
  }

  async count(
    conditions: WhereOptions<T>,
    dbTransactin?: Transaction,
  ): Promise<number> {
    return this.model.count({ where: conditions, transaction: dbTransactin });
  }
}
