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
import {
  createMockSequelize,
  MockSequelize,
} from 'src/common/test-utils/mock-sequelize';
import { User } from 'src/user/entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { CreatePaymentDto } from './dtos/craete-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { GetAllPaymentsDto } from './dtos/get-all-payment.dto';
import { PaymentCategory } from './enums/payment-category.enum';
import { Sequelize } from 'sequelize-typescript';

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
  let seq: MockSequelize;
  const user = { id: 1 } as User;

  const baseDto: CreatePaymentDto = {
    price: 100,
    bankId: 10,
    unitId: 20,
    category: PaymentCategory.FOOD,
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
    seq = createMockSequelize();

    service = new PaymentService(
      paymentRepository as unknown as PaymentRepository,
      uncompletePaymentRepository as unknown as UncompletePaymentRepository,
      accountRepository as unknown as AccountRepository,
      accountDebptRepository as unknown as AccountDebtRepository,
      seq as unknown as Sequelize,
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

  it('getAllPayments resolves the user account ids and filters payments by them', async () => {
    accountRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    paymentRepository.pagination.mockResolvedValue({ rows: [], count: 0 });

    const query = { page: 1, size: 20 } as GetAllPaymentsDto;

    await service.getAllPayments(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
    expect(paymentRepository.pagination).toHaveBeenCalledWith(
      expect.objectContaining({ where: { accountId: [1, 2] } }),
      { page: 1, size: 20 },
    );
  });

  it('getAllPayments applies account and category filters', async () => {
    accountRepository.findAll.mockResolvedValue([{ id: 1 }]);
    paymentRepository.pagination.mockResolvedValue({ rows: [], count: 0 });

    const query = {
      page: 1,
      size: 20,
      bankId: 10,
      unitId: 20,
      ownedBy: 2,
      category: PaymentCategory.RENT,
    } as GetAllPaymentsDto;

    await service.getAllPayments(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 1, bankId: 10, unitId: 20, ownedBy: 2 },
      }),
    );
    expect(paymentRepository.pagination).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: [1], category: PaymentCategory.RENT },
      }),
      { page: 1, size: 20 },
    );
  });

  describe('updatePayment', () => {
    const updateDto: UpdatePaymentDto = {
      price: 250,
      category: PaymentCategory.FOOD,
      isFun: false,
      isMaman: false,
      paidAt: '2024-01-02',
    };

    beforeEach(() => {
      // account balance 300 with an original payment of 100 → 400 restorable
      paymentRepository.findOneOrFail.mockResolvedValue({
        id: 7,
        amount: 100,
        accountId: 5,
        account: { ballance: 300 },
      });
      accountDebptRepository.findOne.mockResolvedValue(null);
      paymentRepository.updateOneById.mockResolvedValue(undefined);
      paymentRepository.findOneByIdOrFail.mockResolvedValue({ id: 7 });
    });

    it('reverses the original amount before applying the new price', async () => {
      await service.updatePayment(7, updateDto, user);

      // 300 + 100 (restore) - 250 (new price) = 150
      expect(accountRepository.updateOneById).toHaveBeenCalledWith(
        { ballance: 150 },
        5,
      );
    });

    it('persists the new price and running balance on the payment', async () => {
      await service.updatePayment(7, updateDto, user);

      expect(paymentRepository.updateOneById).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 250, remain: 150 }),
        7,
      );
    });

    it('throws UnprocessableEntityException when the restored balance cannot cover the new price', async () => {
      await expect(
        service.updatePayment(7, { ...updateDto, price: 500 }, user),
      ).rejects.toThrow(UnprocessableEntityException);

      expect(accountRepository.updateOneById).not.toHaveBeenCalled();
      expect(paymentRepository.updateOneById).not.toHaveBeenCalled();
    });

    it('updates the linked debt amount when one exists', async () => {
      accountDebptRepository.findOne.mockResolvedValue({ id: 3 });

      await service.updatePayment(7, updateDto, user);

      expect(accountDebptRepository.updateOneById).toHaveBeenCalledWith(
        { amount: 250 },
        3,
      );
    });

    it('leaves debts untouched when none is linked to the payment', async () => {
      await service.updatePayment(7, updateDto, user);

      expect(accountDebptRepository.updateOneById).not.toHaveBeenCalled();
    });

    it('returns the freshly loaded payment', async () => {
      await expect(service.updatePayment(7, updateDto, user)).resolves.toEqual({
        id: 7,
      });
    });
  });

  describe('deletePayment', () => {
    beforeEach(() => {
      paymentRepository.findOneOrFail.mockResolvedValue({
        id: 7,
        accountId: 5,
        amount: 100,
        account: { ballance: 300 },
      });
      paymentRepository.delete.mockResolvedValue(1);
      accountDebptRepository.delete.mockResolvedValue(0);
    });

    it('restores the balance the payment had deducted', async () => {
      const dbTransaction = await seq.transaction();

      await service.deletePayment(7, user);

      expect(accountRepository.updateOneById).toHaveBeenCalledWith(
        { ballance: 400 },
        5,
        dbTransaction,
      );
    });

    it('removes any debt tied to this payment before deleting it', async () => {
      const dbTransaction = await seq.transaction();

      await service.deletePayment(7, user);

      expect(accountDebptRepository.delete).toHaveBeenCalledWith(
        { where: { paymentId: 7 } },
        dbTransaction,
      );
      expect(paymentRepository.delete).toHaveBeenCalledWith(
        { where: { id: 7 } },
        dbTransaction,
      );
    });

    it('only touches payments owned by the requesting user', async () => {
      await service.deletePayment(7, user);

      const findArgs = paymentRepository.findOneOrFail.mock
        .calls[0][0] as unknown as {
        include: Array<{ where: { userId: number } }>;
      };

      expect(findArgs.include[0].where).toEqual({ userId: 1 });
    });

    it('rolls back the transaction when the payment cannot be found', async () => {
      const dbTransaction = await seq.transaction();
      paymentRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException('not found'),
      );

      await expect(service.deletePayment(7, user)).rejects.toThrow(
        NotFoundException,
      );
      expect(dbTransaction.rollback).toHaveBeenCalled();
    });
  });
});
