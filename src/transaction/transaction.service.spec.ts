import { TransactionService } from './transaction.service';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import { GetRecentActivityDto } from './dtos/get-all-transactions.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let accountRepository: MockRepository;
  let paymentRepository: MockRepository;
  let incomeRepository: MockRepository;
  const user = { id: 1 } as User;

  beforeEach(() => {
    accountRepository = createMockRepository();
    paymentRepository = createMockRepository();
    incomeRepository = createMockRepository();

    service = new TransactionService(
      accountRepository as unknown as AccountRepository,
      paymentRepository as unknown as PaymentRepository,
      incomeRepository as unknown as IncomeRepository,
    );

    accountRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    paymentRepository.findAll.mockResolvedValue([]);
    incomeRepository.findAll.mockResolvedValue([]);
    paymentRepository.count.mockResolvedValue(0);
    incomeRepository.count.mockResolvedValue(0);
  });

  it('fetches page * size rows per source, scoped to the user accounts', async () => {
    const query = { page: 2, size: 10 } as GetRecentActivityDto;

    await service.getRecentActivity(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
    expect(paymentRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { accountId: [1, 2] }, limit: 20 }),
    );
    expect(incomeRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { accountId: [1, 2] }, limit: 20 }),
    );
  });

  it('merges payments and incomes sorted by paidAt descending', async () => {
    paymentRepository.findAll.mockResolvedValue([
      { id: 1, paidAt: '2024-01-04' },
      { id: 2, paidAt: '2024-01-02' },
    ]);
    incomeRepository.findAll.mockResolvedValue([
      { id: 3, paidAt: '2024-01-03' },
      { id: 4, paidAt: '2024-01-01' },
    ]);

    const query = { page: 1, size: 2 } as GetRecentActivityDto;

    const result = await service.getRecentActivity(query, user);

    expect(result.rows.map((t) => t.id)).toEqual([1, 3]);
    expect(result.rows.map((t) => t.type)).toEqual(['PAYMENT', 'INCOME']);
  });

  it('slices the requested page out of the merged list', async () => {
    paymentRepository.findAll.mockResolvedValue([
      { id: 1, paidAt: '2024-01-04' },
      { id: 2, paidAt: '2024-01-02' },
    ]);
    incomeRepository.findAll.mockResolvedValue([
      { id: 3, paidAt: '2024-01-03' },
      { id: 4, paidAt: '2024-01-01' },
    ]);

    const query = { page: 2, size: 2 } as GetRecentActivityDto;

    const result = await service.getRecentActivity(query, user);

    expect(result.rows.map((t) => t.id)).toEqual([2, 4]);
  });

  it('reports the combined total count of both sources', async () => {
    paymentRepository.count.mockResolvedValue(7);
    incomeRepository.count.mockResolvedValue(5);

    const query = { page: 1, size: 20 } as GetRecentActivityDto;

    const result = await service.getRecentActivity(query, user);

    expect(result.count).toBe(12);
    expect(paymentRepository.count).toHaveBeenCalledWith({
      accountId: [1, 2],
    });
    expect(incomeRepository.count).toHaveBeenCalledWith({ accountId: [1, 2] });
  });

  it('only queries payments when type is PAYMENT', async () => {
    const query = {
      page: 1,
      size: 20,
      type: 'PAYMENT',
    } as GetRecentActivityDto;

    const result = await service.getRecentActivity(query, user);

    expect(paymentRepository.findAll).toHaveBeenCalled();
    expect(paymentRepository.count).toHaveBeenCalled();
    expect(incomeRepository.findAll).not.toHaveBeenCalled();
    expect(incomeRepository.count).not.toHaveBeenCalled();
    expect(result.count).toBe(0);
  });

  it('only queries incomes when type is INCOME', async () => {
    const query = { page: 1, size: 20, type: 'INCOME' } as GetRecentActivityDto;

    await service.getRecentActivity(query, user);

    expect(incomeRepository.findAll).toHaveBeenCalled();
    expect(incomeRepository.count).toHaveBeenCalled();
    expect(paymentRepository.findAll).not.toHaveBeenCalled();
    expect(paymentRepository.count).not.toHaveBeenCalled();
  });

  it('narrows the account lookup to unitId when provided', async () => {
    const query = { page: 1, size: 20, unitId: 5 } as GetRecentActivityDto;

    await service.getRecentActivity(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1, unitId: 5 } }),
    );
  });

  it('narrows the account lookup to bankId and unitId when both provided', async () => {
    const query = {
      page: 1,
      size: 20,
      bankId: 3,
      unitId: 5,
    } as GetRecentActivityDto;

    await service.getRecentActivity(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1, bankId: 3, unitId: 5 } }),
    );
  });

  it('narrows the account lookup to ownedBy when provided', async () => {
    const query = {
      page: 1,
      size: 20,
      bankId: 3,
      unitId: 5,
      ownedBy: 9,
    } as GetRecentActivityDto;

    await service.getRecentActivity(query, user);

    expect(accountRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 1, bankId: 3, unitId: 5, ownedBy: 9 },
      }),
    );
  });
});
