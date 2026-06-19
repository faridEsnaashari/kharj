import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExchangeRepository } from './entities/repositories/exchange.repository';
import { CreateExchangeDto } from './dtos/create-exchange.dto';
import { User } from 'src/user/entities/user.entity';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { PaymentCategory } from 'src/payment/enums/payment-category.enum';
import { IncomeCategory } from 'src/income/enums/income-category.enum';

@Injectable()
export class ExchangeService {
  constructor(
    private exchangeRepository: ExchangeRepository,
    private paymentRepository: PaymentRepository,
    private incomeRepository: IncomeRepository,
    private accountRepository: AccountRepository,
  ) {}

  async createExchange(dto: CreateExchangeDto, user: User) {
    const { fromAccountId, toAccountId, fromAmount, toAmount, paidAt } = dto;

    const fromAcc = await this.accountRepository.findOne({
      id: fromAccountId,
      userId: user.id,
    });

    const toAcc = await this.accountRepository.findOne({
      id: toAccountId,
      userId: user.id,
    });

    if (!fromAcc || !toAcc) {
      throw new NotFoundException('account not fount');
    }

    if (fromAcc.ballance < fromAmount) {
      throw new UnprocessableEntityException('not enugh money');
    }

    await this.accountRepository.updateOneById(
      { ballance: fromAcc.ballance - fromAmount },
      fromAcc.id,
    );
    await this.accountRepository.updateOneById(
      { ballance: toAcc.ballance + toAmount },
      toAcc.id,
    );

    const payment = await this.paymentRepository.create({
      accountId: fromAcc.id,
      amount: fromAmount,
      remain: fromAcc.ballance - fromAmount,
      category: PaymentCategory.EXCHANGE,
      isMaman: false,
      isFun: false,
      paidAt,
    });

    const income = await this.incomeRepository.create({
      accountId: toAcc.id,
      remain: toAcc.ballance + toAmount,
      amount: toAmount,
      category: IncomeCategory.EXCHANGE,
      paidAt,
    });

    return this.exchangeRepository.create({
      paymentId: payment.id,
      incomeId: income.id,
      fromAmount,
      toAmount,
    });
  }
}
