import { IncomeService } from './income.service';
import { IncomeRepository } from './entities/repositories/income.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { IncomeCategory } from './enums/income-category.enum';

describe('IncomeService', () => {
  let service: IncomeService;
  let incomeRepository: MockRepository;
  let accountRepository: MockRepository;
  const user = { id: 1 } as User;

  const dto: CreateIncomeDto = {
    accountId: 5,
    amount: 200,
    category: 'SALARY' as IncomeCategory,
    paidAt: '2024-01-01',
  };

  beforeEach(() => {
    incomeRepository = createMockRepository();
    accountRepository = createMockRepository();

    service = new IncomeService(
      incomeRepository as unknown as IncomeRepository,
      accountRepository as unknown as AccountRepository,
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

    expect(accountRepository.findOneOrFail).toHaveBeenCalledWith({
      id: 5,
      userId: user.id,
    });
    expect(incomeRepository.create).toHaveBeenCalledWith({
      ...dto,
      accountId: 5,
      remain: 500,
    });
    expect(accountRepository.updateOneById).toHaveBeenCalledWith(
      { ballance: 500 },
      5,
    );
  });

  it('findOneIncome passes through to the repository', async () => {
    incomeRepository.findOneById.mockResolvedValue({ id: 1 });

    await expect(service.findOneIncome(1)).resolves.toEqual({ id: 1 });
  });
});
