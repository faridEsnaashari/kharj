import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './entities/repositories/payment.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { UncompletePaymentRepository } from 'src/uncomplete-payment/entities/repositories/uncomplete-payment.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { CreatePaymentDto } from './dtos/craete-payment.dto';
import { PaymentCategory } from './enums/payment-category.enum';

function buildAccount(overrides: Partial<Account>): Account {
  return {
    id: 1,
    userId: 1,
    ownedBy: 1,
    ballance: 0,
    bankId: 10,
    unitId: 20,
    priority: 1,
    ...overrides,
  } as Account;
}

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: MockRepository;
  let uncompletePaymentRepository: MockRepository;
  let accountRepository: MockRepository;
  let accountDebptRepository: MockRepository;
  const user = { id: 1 } as User;

  const baseDto: CreatePaymentDto = {
    price: 100,
    bankId: 10,
    unitId: 20,
    category: PaymentCategory.FOOD ?? ('FOOD' as PaymentCategory),
    isFun: false,
    isMaman: false,
    ownerId: 1,
    paidAt: '2024-01-01',
  };

  beforeEach(() => {
    paymentRepository = createMockRepository();
    uncompletePaymentRepository = createMockRepository();
    accountRepository = createMockRepository();
    accountDebptRepository = createMockRepository();

    service = new PaymentService(
      paymentRepository as unknown as PaymentRepository,
      uncompletePaymentRepository as unknown as UncompletePaymentRepository,
      accountRepository as unknown as AccountRepository,
      accountDebptRepository as unknown as AccountDebtRepository,
    );

    paymentRepository.create.mockImplementation((data) =>
      Promise.resolve({ id: Math.random(), ...data }),
    );
    accountRepository.updateOneById.mockResolvedValue(undefined);
    accountDebptRepository.create.mockResolvedValue({ id: 1 });
  });

  it('throws NotFoundException when no accounts match bank+unit', async () => {
    accountRepository.findAll.mockResolvedValue([]);

    await expect(service.createPayment(baseDto, user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException when uncompletePaymentId does not exist', async () => {
    accountRepository.findAll.mockResolvedValue([
      buildAccount({ id: 1, ownedBy: 1, ballance: 500 }),
    ]);
    uncompletePaymentRepository.findOneById.mockResolvedValue(null);

    await expect(
      service.createPayment({ ...baseDto, uncompletePaymentId: 99 }, user),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when the target owner has no account in this group', async () => {
    accountRepository.findAll.mockResolvedValue([
      buildAccount({ id: 1, ownedBy: 1, ballance: 500 }),
    ]);

    await expect(
      service.createPayment({ ...baseDto, ownerId: 999 }, user),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws UnprocessableEntityException when total funds are insufficient', async () => {
    accountRepository.findAll.mockResolvedValue([
      buildAccount({ id: 1, ownedBy: 1, ballance: 10 }),
    ]);

    await expect(
      service.createPayment({ ...baseDto, price: 100 }, user),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('pays from the owner own funds without creating a debt', async () => {
    accountRepository.findAll.mockResolvedValue([
      buildAccount({ id: 1, ownedBy: 1, ballance: 500 }),
    ]);

    const result = await service.createPayment(
      { ...baseDto, price: 100, ownerId: 1 },
      user,
    );

    expect(result).toHaveLength(1);
    expect(accountRepository.updateOneById).toHaveBeenCalledWith(
      { ballance: 400 },
      1,
    );
    expect(accountDebptRepository.create).not.toHaveBeenCalled();
  });

  it('pulls from another owner share and creates a debt record', async () => {
    accountRepository.findAll.mockResolvedValue([
      buildAccount({ id: 1, ownedBy: 1, ballance: 0 }), // target owner, empty
      buildAccount({ id: 2, ownedBy: 2, ballance: 500 }), // other owner funds it
    ]);

    await service.createPayment({ ...baseDto, price: 100, ownerId: 1 }, user);

    expect(accountDebptRepository.create).toHaveBeenCalledWith({
      amount: 100,
      paymentId: expect.any(Number),
      fromUserId: 2,
      toUserId: 1,
    });
  });
});
