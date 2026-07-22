export type MockRepository = {
  create: jest.Mock;
  bulkCreate: jest.Mock;
  pagination: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  updateOneById: jest.Mock;
  findOneById: jest.Mock;
  findOneByIdOrFail: jest.Mock;
  findOneOrFail: jest.Mock;
  delete: jest.Mock;
  deleteById: jest.Mock;
  count: jest.Mock;
};

export function createMockRepository(): MockRepository {
  return {
    create: jest.fn(),
    bulkCreate: jest.fn(),
    pagination: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateOneById: jest.fn(),
    findOneById: jest.fn(),
    findOneByIdOrFail: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
    deleteById: jest.fn(),
    count: jest.fn(),
  };
}
