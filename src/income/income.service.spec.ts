import { IncomeService } from './income.service';
import { IncomeRepository } from './entities/repositories/income.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import {
  createMockSequelize,
  MockSequelize,
} from 'src/common/test-utils/mock-sequelize';
import { User } from 'src/user/entities/user.entity';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { UpdateIncomeDto } from './dtos/update-income.dto';
import { GetAllIncomeDto } from './dtos/get-all-income.dto';
import { IncomeCategory } from './enums/income-category.enum';
import { Sequelize } from 'sequelize-typescript';

describe('IncomeService', () => {
  let service: IncomeService;
  let incomeRepository: MockRepository;
  let accountRepository: MockRepository;
  let seq: MockSequelize;
  const user = { id: 1 } as User;

  const dto: CreateIncomeDto = {
    accountId: 5,
    amount: 200,
    category: IncomeCategory.HOGHOOGH,
    paidAt: '2024-01-01',
  };

  beforeEach(() => {
    incomeRepository = createMockRepository();
    accountRepository = createMockRepository();
    seq = createMockSequelize();

    service = new IncomeService(
      incomeRepository as unknown as IncomeRepository,
      accountRepository as unknown as AccountRepository,
      seq as unknown as Sequelize,
    );
  });

  it('creates the income with the new running balance and updates the account', async () => {
    accountRepository.findOneOrFail.mockResolvedValue({
      id: 5,
      ballance: 300,
    });
    accountRepository.updateOneById.mockResolvedValue(undefined);
    incomeRepository.create.mockResolvedValue({ id: 1 });

    await service.createIncome(dto, user);

    const dbTransaction = await seq.transaction();

    expect(accountRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 5, userId: user.id },
    });
    expect(incomeRepository.create).toHaveBeenCalledWith(
      {
        ...dto,
        accountId: 5,
        remain: 500,
      },
      dbTransaction,
    );
    expect(accountRepository.updateOneById).toHaveBeenCalledWith(
      { ballance: 500 },
      5,
      dbTransaction,
    );
  });

  it('findOneIncome passes through to the repository', async () => {
    incomeRepository.findOneByIdOrFail.mockResolvedValue({ id: 1 });

    await expect(service.findOneIncome(1)).resolves.toEqual({ id: 1 });
    expect(incomeRepository.findOneByIdOrFail).toHaveBeenCalledWith(1);
  });

  it('getAllIncomes resolves the user account ids and filters incomes by them', async () => {
    accountRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    incomeRepository.pagination.mockResolvedValue({ rows: [], count: 0 });

    const query = { page: 1, size: 20 } as GetAllIncomeDto;

    await service.getAllIncomes(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
    expect(incomeRepository.pagination).toHaveBeenCalledWith(
      expect.objectContaining({ where: { accountId: [1, 2] } }),
      { page: 1, size: 20 },
    );
  });

  it('getAllIncomes applies account and category filters', async () => {
    accountRepository.findAll.mockResolvedValue([{ id: 1 }]);
    incomeRepository.pagination.mockResolvedValue({ rows: [], count: 0 });

    const query = {
      page: 1,
      size: 20,
      bankId: 10,
      unitId: 20,
      ownedBy: 2,
      category: IncomeCategory.LOAN,
    } as GetAllIncomeDto;

    await service.getAllIncomes(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 1, bankId: 10, unitId: 20, ownedBy: 2 },
      }),
    );
    expect(incomeRepository.pagination).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: [1], category: IncomeCategory.LOAN },
      }),
      { page: 1, size: 20 },
    );
  });

  describe('updateIncome', () => {
    const updateDto: UpdateIncomeDto = {
      amount: 150,
      category: IncomeCategory.HOGHOOGH,
      paidAt: '2024-01-02',
    };

    beforeEach(() => {
      incomeRepository.findOneOrFail.mockResolvedValue({
        id: 9,
        amount: 100,
        accountId: 5,
        account: { ballance: 300 },
      });
      accountRepository.updateOneById.mockResolvedValue(undefined);
      incomeRepository.updateOneById.mockResolvedValue(undefined);
      incomeRepository.findOneByIdOrFail.mockResolvedValue({ id: 9 });
    });

    it('reverses the original amount and applies the new one to the account', async () => {
      await service.updateIncome(9, updateDto, user);

      // 300 - 100 (original) + 150 (new) = 350
      expect(accountRepository.updateOneById).toHaveBeenCalledWith(
        { ballance: 350 },
        5,
      );
    });

    it('persists the new amount and running balance on the income', async () => {
      await service.updateIncome(9, updateDto, user);

      expect(incomeRepository.updateOneById).toHaveBeenCalledWith(
        {
          amount: 150,
          remain: 350,
          category: updateDto.category,
          description: undefined,
          paidAt: updateDto.paidAt,
        },
        9,
      );
    });

    it('only touches incomes owned by the requesting user', async () => {
      await service.updateIncome(9, updateDto, user);

      const findArgs = incomeRepository.findOneOrFail.mock
        .calls[0][0] as unknown as {
        include: Array<{ where: { userId: number } }>;
      };

      expect(findArgs.include[0].where).toEqual({ userId: 1 });
    });

    it('returns the freshly loaded income', async () => {
      await expect(service.updateIncome(9, updateDto, user)).resolves.toEqual({
        id: 9,
      });
    });
  });
});
