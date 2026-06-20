import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeRepository } from './entities/repositories/exchange.repository';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { PaymentCategory } from 'src/payment/enums/payment-category.enum';
import { IncomeCategory } from 'src/income/enums/income-category.enum';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let exchangeRepository: MockRepository;
  let paymentRepository: MockRepository;
  let incomeRepository: MockRepository;
  let accountRepository: MockRepository;
  const user = { id: 1 } as User;

  const dto: CreateExchangeDto = {
    fromAccountId: 1,
    toAccountId: 2,
    fromAmount: 100,
    toAmount: 90,
    paidAt: '2024-01-01',
  };

  beforeEach(() => {
    exchangeRepository = createMockRepository();
    paymentRepository = createMockRepository();
    incomeRepository = createMockRepository();
    accountRepository = createMockRepository();

    service = new ExchangeService(
      exchangeRepository as unknown as ExchangeRepository,
      paymentRepository as unknown as PaymentRepository,
      incomeRepository as unknown as IncomeRepository,
      accountRepository as unknown as AccountRepository,
    );
  });

  it('throws NotFoundException when either account is missing', async () => {
    accountRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 2, ballance: 500 });

    await expect(service.createExchange(dto, user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws UnprocessableEntityException when the source balance is insufficient', async () => {
    accountRepository.findOne
      .mockResolvedValueOnce({ id: 1, ballance: 10 })
      .mockResolvedValueOnce({ id: 2, ballance: 500 });

    await expect(service.createExchange(dto, user)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('moves funds between accounts and links payment/income/exchange records', async () => {
    accountRepository.findOne
      .mockResolvedValueOnce({ id: 1, ballance: 500 })
      .mockResolvedValueOnce({ id: 2, ballance: 200 });
    accountRepository.updateOneById.mockResolvedValue(undefined);
    paymentRepository.create.mockResolvedValue({ id: 11 });
    incomeRepository.create.mockResolvedValue({ id: 22 });
    exchangeRepository.create.mockResolvedValue({ id: 33 });

    await service.createExchange(dto, user);

    expect(accountRepository.updateOneById).toHaveBeenCalledWith(
      { ballance: 400 },
      1,
    );
    expect(accountRepository.updateOneById).toHaveBeenCalledWith(
      { ballance: 290 },
      2,
    );
    expect(paymentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 1,
        amount: 100,
        category: PaymentCategory.EXCHANGE,
      }),
    );
    expect(incomeRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 2,
        amount: 90,
        category: IncomeCategory.EXCHANGE,
      }),
    );
    expect(exchangeRepository.create).toHaveBeenCalledWith({
      paymentId: 11,
      incomeId: 22,
      fromAmount: 100,
      toAmount: 90,
    });
  });
});
