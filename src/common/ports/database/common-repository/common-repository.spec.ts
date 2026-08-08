import { NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { CommonRepository } from './common-repository';

type TestEntity = { id: number; name: string };
type TestCreate = { name: string };
type TestUpdate = { name?: string };
type TestModel = Model<TestEntity, TestCreate>;

describe('CommonRepository', () => {
  let model: {
    name: string;
    create: jest.Mock;
    bulkCreate: jest.Mock;
    findAndCountAll: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    findByPk: jest.Mock;
    destroy: jest.Mock;
    count: jest.Mock;
  };
  let repository: CommonRepository<
    TestEntity,
    TestCreate,
    TestUpdate,
    TestModel
  >;
  const transaction = { id: 'tx' } as unknown as Transaction;

  beforeEach(() => {
    model = {
      name: 'TestModel',
      create: jest.fn(),
      bulkCreate: jest.fn(),
      findAndCountAll: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn(),
    };

    repository = new CommonRepository(model as unknown as ModelCtor<TestModel>);
  });

  describe('create', () => {
    it('passes the transaction through and returns a plain JSON clone by default', async () => {
      const instance = {
        id: 1,
        name: 'a',
        toJSON: () => ({ id: 1, name: 'a' }),
      };
      model.create.mockResolvedValue(instance);

      const result = await repository.create({ name: 'a' }, transaction);

      expect(model.create).toHaveBeenCalledWith({ name: 'a' }, { transaction });
      expect(result).toEqual({ id: 1, name: 'a' });
      expect(result).not.toBe(instance);
    });

    it('returns the model instance untouched when raw is false', async () => {
      const instance = { id: 1, name: 'a' };
      model.create.mockResolvedValue(instance);

      const result = await repository.create({ name: 'a' }, undefined, false);

      expect(result).toBe(instance);
    });
  });

  describe('bulkCreate', () => {
    it('passes the transaction through and returns plain JSON clones by default', async () => {
      model.bulkCreate.mockResolvedValue([{ id: 1, name: 'a' }]);

      const result = await repository.bulkCreate([{ name: 'a' }], transaction);

      expect(model.bulkCreate).toHaveBeenCalledWith([{ name: 'a' }], {
        transaction,
      });
      expect(result).toEqual([{ id: 1, name: 'a' }]);
    });
  });

  describe('pagination', () => {
    it('computes limit/offset from page and size and defaults to id ASC ordering', async () => {
      model.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await repository.pagination(
        { where: { name: 'a' } },
        { page: 3, size: 5 },
      );

      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
          offset: 10,
          order: [['id', 'ASC']],
          where: { name: 'a' },
        }),
      );
    });

    it('defaults limit to 10 and page to 1 when not provided', async () => {
      model.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await repository.pagination({}, {});

      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });

    it('passes plain where-only conditions through as the where clause', async () => {
      model.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await repository.pagination({ name: 'a' } as never, {
        page: 1,
        size: 10,
      });

      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: 'a' } }),
      );
    });

    it('passes the transaction through as its 4th argument, after raw', async () => {
      model.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await repository.pagination({}, { page: 1, size: 10 }, true, transaction);

      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ transaction }),
      );
    });
  });

  describe('findAll', () => {
    it('wraps a plain where-options object as the where clause', async () => {
      model.findAll.mockResolvedValue([]);

      await repository.findAll({ name: 'a' } as never);

      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: 'a' } }),
      );
    });

    it('passes a FindOptions object through untouched, including its own where', async () => {
      model.findAll.mockResolvedValue([]);

      await repository.findAll({
        where: { name: 'a' },
        order: [['id', 'DESC']],
      });

      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: 'a' },
          order: [['id', 'DESC']],
        }),
      );
    });

    it('returns plain JSON clones by default', async () => {
      model.findAll.mockResolvedValue([{ id: 1, name: 'a' }]);

      const result = await repository.findAll({});

      expect(result).toEqual([{ id: 1, name: 'a' }]);
    });

    it('passes the transaction through as its 3rd argument, after raw', async () => {
      model.findAll.mockResolvedValue([]);

      await repository.findAll({}, true, transaction);

      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ transaction }),
      );
    });
  });

  describe('findOne', () => {
    it('passes the transaction through', async () => {
      model.findOne.mockResolvedValue(null);

      await repository.findOne({ name: 'a' } as never, transaction);

      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: 'a' }, transaction }),
      );
    });

    it('returns null when nothing matches', async () => {
      model.findOne.mockResolvedValue(null);

      await expect(repository.findOne({})).resolves.toBeNull();
    });
  });

  describe('update', () => {
    it('updates rows matching the given conditions and passes the transaction through', async () => {
      await repository.update({ name: 'b' }, { id: 1 }, transaction);

      expect(model.update).toHaveBeenCalledWith(
        { name: 'b' },
        { where: { id: 1 }, transaction },
      );
    });
  });

  describe('updateOneById', () => {
    it('updates by id and passes the transaction through', async () => {
      await repository.updateOneById({ name: 'b' }, 7, transaction);

      expect(model.update).toHaveBeenCalledWith(
        { name: 'b' },
        { where: { id: 7 }, transaction },
      );
    });
  });

  describe('findOneById', () => {
    it('passes the transaction through and returns a plain JSON clone by default', async () => {
      model.findByPk.mockResolvedValue({ id: 1, name: 'a' });

      const result = await repository.findOneById(1, transaction);

      expect(model.findByPk).toHaveBeenCalledWith(1, { transaction });
      expect(result).toEqual({ id: 1, name: 'a' });
    });
  });

  describe('findOneByIdOrFail', () => {
    it('returns the record when found', async () => {
      model.findByPk.mockResolvedValue({ id: 1, name: 'a' });

      await expect(repository.findOneByIdOrFail(1)).resolves.toEqual({
        id: 1,
        name: 'a',
      });
    });

    it('throws NotFoundException naming the model when nothing is found', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(repository.findOneByIdOrFail(1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.findOneByIdOrFail(1)).rejects.toThrow(
        'TestModel not found',
      );
    });
  });

  describe('findOneOrFail', () => {
    it('returns the record when found', async () => {
      model.findOne.mockResolvedValue({ id: 1, name: 'a' });

      await expect(repository.findOneOrFail({})).resolves.toEqual({
        id: 1,
        name: 'a',
      });
    });

    it('throws NotFoundException when nothing is found', async () => {
      model.findOne.mockResolvedValue(null);

      await expect(repository.findOneOrFail({})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('passes the transaction through and returns the destroyed row count', async () => {
      model.destroy.mockResolvedValue(2);

      const result = await repository.delete({ where: { id: 1 } }, transaction);

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
        transaction,
      });
      expect(result).toBe(2);
    });
  });

  describe('deleteById', () => {
    it('deletes by id and passes the transaction through', async () => {
      model.destroy.mockResolvedValue(1);

      const result = await repository.deleteById(5, transaction);

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: 5 },
        transaction,
      });
      expect(result).toBe(1);
    });
  });

  describe('count', () => {
    it('passes the transaction through', async () => {
      model.count.mockResolvedValue(4);

      const result = await repository.count({ name: 'a' }, transaction);

      expect(model.count).toHaveBeenCalledWith({
        where: { name: 'a' },
        transaction,
      });
      expect(result).toBe(4);
    });
  });
});
