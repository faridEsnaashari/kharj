export type MockTransaction = {
  commit: jest.Mock;
  rollback: jest.Mock;
};

export type MockSequelize = {
  transaction: jest.Mock;
};

export function createMockSequelize(): MockSequelize {
  const transaction: MockTransaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  };

  return {
    transaction: jest.fn().mockResolvedValue(transaction),
  };
}
