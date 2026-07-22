import { ConflictException, NotFoundException } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepository } from './entities/repositories/account.repository';
import { UserRepository } from 'src/user/entities/repositories/user.repository';
import { UnitRepository } from 'src/unit/entities/repositories/unit.repository';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { GetAllAccountsDto } from './dtos/get-all-account.dto';
import { GetAccountStatisticDto } from './dtos/get-account-statistic.dto';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: MockRepository;
  let userRepository: MockRepository;
  let unitRepository: MockRepository;
  let bankRepository: MockRepository;
  const user = { id: 1 } as User;

  const dto: CreateAccountDto = {
    ownedBy: 1,
    ballance: 0,
    bankId: 10,
    unitId: 20,
    priority: 1,
  };

  beforeEach(() => {
    accountRepository = createMockRepository();
    userRepository = createMockRepository();
    unitRepository = createMockRepository();
    bankRepository = createMockRepository();

    service = new AccountService(
      accountRepository as unknown as AccountRepository,
      userRepository as unknown as UserRepository,
      unitRepository as unknown as UnitRepository,
      bankRepository as unknown as BankRepository,
    );

    userRepository.findOneByIdOrFail.mockResolvedValue({ id: 1 });
    unitRepository.findOne.mockResolvedValue({ id: 20 });
    bankRepository.findOne.mockResolvedValue({ id: 10 });
    accountRepository.findOne.mockResolvedValue(null);
    accountRepository.create.mockResolvedValue({ id: 100 });
    accountRepository.pagination.mockResolvedValue({ rows: [], count: 0 });
  });

  it('throws NotFoundException when the unit is not accessible to the user', async () => {
    unitRepository.findOne.mockResolvedValue(null);

    await expect(service.createAccount(dto, user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException when the bank is not accessible to the user', async () => {
    bankRepository.findOne.mockResolvedValue(null);

    await expect(service.createAccount(dto, user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws ConflictException when the same bank+unit+owner account already exists', async () => {
    accountRepository.findOne.mockResolvedValue({ id: 999 });

    await expect(service.createAccount(dto, user)).rejects.toThrow(
      ConflictException,
    );
  });

  it('creates the account scoped to the requesting user', async () => {
    await service.createAccount(dto, user);

    expect(accountRepository.create).toHaveBeenCalledWith({
      ...dto,
      userId: user.id,
    });
  });

  it('findOneAccount scopes the lookup to the requesting user', async () => {
    accountRepository.findOneOrFail.mockResolvedValue({ id: 1 });

    await expect(service.findOneAccount(1, user)).resolves.toEqual({ id: 1 });
    expect(accountRepository.findOneOrFail).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1, userId: 1 } }),
    );
  });

  it('findAllAccounts lists only the requesting user accounts by default', async () => {
    const query = { page: 1, size: 20 } as GetAllAccountsDto;

    await service.findAllAccounts(query, user);

    expect(accountRepository.pagination).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
      { page: 1, size: 20 },
    );
  });

  it('findAllAccounts applies ownedBy, bankId and unitId filters', async () => {
    const query = {
      page: 2,
      size: 5,
      ownedBy: 2,
      bankId: 10,
      unitId: 20,
    } as GetAllAccountsDto;

    await service.findAllAccounts(query, user);

    expect(accountRepository.pagination).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 1, ownedBy: 2, bankId: 10, unitId: 20 },
      }),
      { page: 2, size: 5 },
    );
  });

  it('getStatistic groups the user accounts by unit', async () => {
    const unit20 = { id: 20 };
    const unit30 = { id: 30 };
    accountRepository.findAll.mockResolvedValue([
      { unitId: 20, unit: unit20, ballance: 100 },
      { unitId: 20, unit: unit20, ballance: 50 },
      { unitId: 30, unit: unit30, ballance: 7 },
    ]);

    const query = {} as GetAccountStatisticDto;

    const result = await service.getStatistic(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
    expect(result).toEqual([
      { unitId: 20, unit: unit20, total: 150, accountCount: 2 },
      { unitId: 30, unit: unit30, total: 7, accountCount: 1 },
    ]);
  });

  it('getStatistic narrows to one unit when unitId is provided', async () => {
    accountRepository.findAll.mockResolvedValue([]);

    const query = { unitId: 20 } as GetAccountStatisticDto;

    await service.getStatistic(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1, unitId: 20 } }),
    );
  });
});
