import { Op } from 'sequelize';
import { DebtService } from './debt.service';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import { GetAllDebtDto } from './dtos/get-all-debt.dto';
import { GetDebtSummaryDto } from './dtos/get-debt-summary.dto';
import { Account } from 'src/account/entities/account.entity';
import { WhereOptions } from 'sequelize';

type CapturedFindOptions = {
  where: Record<string | symbol, unknown>;
  include: Array<{
    include: Array<{ where: WhereOptions<Account> }>;
  }>;
};

describe('DebtService', () => {
  let service: DebtService;
  let accountDebtRepository: MockRepository;
  const user = { id: 1 } as User;

  beforeEach(() => {
    accountDebtRepository = createMockRepository();

    service = new DebtService(
      accountDebtRepository as unknown as AccountDebtRepository,
    );

    accountDebtRepository.pagination.mockResolvedValue({ rows: [], count: 0 });
  });

  function capturedFindOptions(): CapturedFindOptions {
    return accountDebtRepository.pagination.mock
      .calls[0][0] as unknown as CapturedFindOptions;
  }

  it('always restricts debts to ones the user is part of', async () => {
    const query = { page: 1, size: 20 } as GetAllDebtDto;

    await service.getAllDebts(query, user);

    const findOptions = capturedFindOptions();

    expect(findOptions.where[Op.or as unknown as string]).toEqual([
      { fromUserId: 1 },
      { toUserId: 1 },
    ]);
    expect(accountDebtRepository.pagination).toHaveBeenCalledWith(
      expect.anything(),
      { page: 1, size: 20 },
    );
  });

  it('applies fromUserId and toUserId filters on top of the user scope', async () => {
    const query = {
      page: 1,
      size: 20,
      fromUserId: 3,
      toUserId: 4,
    } as GetAllDebtDto;

    await service.getAllDebts(query, user);

    const findOptions = capturedFindOptions();

    expect(findOptions.where.fromUserId).toBe(3);
    expect(findOptions.where.toUserId).toBe(4);
  });

  it('applies bankId and unitId filters to the payment account include', async () => {
    const query = {
      page: 1,
      size: 20,
      bankId: 10,
      unitId: 20,
    } as GetAllDebtDto;

    await service.getAllDebts(query, user);

    const findOptions = capturedFindOptions();
    const accountWhere = findOptions.include[0].include[0].where;

    expect(accountWhere).toEqual({ userId: 1, bankId: 10, unitId: 20 });
  });

  it('returns the paginated result untouched', async () => {
    const paginated = { rows: [{ id: 5 }], count: 1 };
    accountDebtRepository.pagination.mockResolvedValue(paginated);

    const query = { page: 1, size: 20 } as GetAllDebtDto;

    await expect(service.getAllDebts(query, user)).resolves.toBe(paginated);
  });

  describe('getDebtSummary', () => {
    it('restricts summary rows to debts the user is part of and narrows by bank/unit', async () => {
      accountDebtRepository.findAll.mockResolvedValue([]);

      const query = {
        groupBy: 'bank',
        bankId: 10,
        unitId: 20,
      } as GetDebtSummaryDto;

      await service.getDebtSummary(query, user);

      const findOptions = accountDebtRepository.findAll.mock
        .calls[0][0] as unknown as CapturedFindOptions;

      expect(findOptions.where[Op.or as unknown as string]).toEqual([
        { fromUserId: 1 },
        { toUserId: 1 },
      ]);
      expect(findOptions.include[0].include[0].where).toEqual({
        userId: 1,
        bankId: 10,
        unitId: 20,
      });
    });

    it('groups and nets the fetched rows via buildDebtSummary', async () => {
      accountDebtRepository.findAll.mockResolvedValue([
        {
          amount: 100,
          fromUserId: 1,
          fromUser: { id: 1, name: 'farid' },
          toUserId: 2,
          toUser: { id: 2, name: 'sara' },
          payment: {
            account: {
              bankId: 10,
              bank: { id: 10, name: 'Bank', symbol: 'B' },
              unitId: 20,
              unit: { id: 20, name: 'Unit', symbol: 'U' },
            },
          },
        },
      ]);

      const query = { groupBy: 'bank' } as GetDebtSummaryDto;

      const result = await service.getDebtSummary(query, user);

      expect(result.rows).toEqual([
        expect.objectContaining({ fromUserId: 1, toUserId: 2, amount: 100 }),
      ]);
      expect(result.totals).toEqual({ owedToYou: 100, youOwe: 0 });
    });
  });
});
