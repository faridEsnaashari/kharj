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

  it('findOneAccount passes through to the repository', async () => {
    accountRepository.findOneById.mockResolvedValue({ id: 1 });

    await expect(service.findOneAccount(1)).resolves.toEqual({ id: 1 });
    expect(accountRepository.findOneById).toHaveBeenCalledWith(1);
  });
});
