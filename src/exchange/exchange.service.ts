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
import { Sequelize } from 'sequelize-typescript';
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { IncomeModel } from 'src/income/entities/income.entity';
import { AccountModel } from 'src/account/entities/account.entity';

@Injectable()
export class ExchangeService {
  constructor(
    private exchangeRepository: ExchangeRepository,
    private paymentRepository: PaymentRepository,
    private incomeRepository: IncomeRepository,
    private accountRepository: AccountRepository,
    private seq: Sequelize,
  ) {}

  async createExchange(dto: CreateExchangeDto, user: User) {
    const { fromAccountId, toAccountId, toUser, fromAmount, toAmount, paidAt } =
      dto;

    const fromAcc = await this.accountRepository.findOne({
      id: fromAccountId,
      userId: user.id,
    });

    const toAcc = await this.accountRepository.findOne({
      id: toAccountId,
      userId: toUser,
    });

    if (!fromAcc || !toAcc) {
      throw new NotFoundException('account not fount');
    }

    if (fromAcc.ballance < fromAmount) {
      throw new UnprocessableEntityException('not enugh money');
    }

    const dbTransaction = await this.seq.transaction();

    try {
      await this.accountRepository.updateOneById(
        { ballance: fromAcc.ballance - fromAmount },
        fromAcc.id,
        dbTransaction,
      );
      await this.accountRepository.updateOneById(
        { ballance: toAcc.ballance + toAmount },
        toAcc.id,
        dbTransaction,
      );

      const payment = await this.paymentRepository.create(
        {
          accountId: fromAcc.id,
          amount: fromAmount,
          remain: fromAcc.ballance - fromAmount,
          category: PaymentCategory.EXCHANGE,
          isMaman: false,
          isFun: false,
          paidAt,
        },
        dbTransaction,
      );

      const income = await this.incomeRepository.create(
        {
          accountId: toAcc.id,
          remain: toAcc.ballance + toAmount,
          amount: toAmount,
          category: IncomeCategory.EXCHANGE,
          paidAt,
        },
        dbTransaction,
      );

      const result = await this.exchangeRepository.create(
        {
          paymentId: payment.id,
          incomeId: income.id,
          fromAmount,
          toAmount,
        },
        dbTransaction,
      );

      await dbTransaction.commit();

      return result;
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  }

  async deleteExchange(id: number, user: User) {
    const dbTransaction = await this.seq.transaction();

    try {
      const exchange = await this.exchangeRepository.findOneOrFail(
        {
          where: { id },
          include: [
            {
              model: PaymentModel,
              as: 'payment',
              include: [{ model: AccountModel, as: 'account' }],
            },
            {
              model: IncomeModel,
              as: 'income',
              include: [{ model: AccountModel, as: 'account' }],
            },
          ],
        },
        dbTransaction,
      );

      if (exchange.payment.account.userId !== user.id) {
        throw new NotFoundException('exchange-not-found');
      }

      await this.accountRepository.updateOneById(
        { ballance: exchange.payment.account.ballance + exchange.fromAmount },
        exchange.payment.account.id,
        dbTransaction,
      );

      await this.accountRepository.updateOneById(
        { ballance: exchange.income.account.ballance - exchange.toAmount },
        exchange.income.account.id,
        dbTransaction,
      );

      const result = await this.exchangeRepository.delete(
        { where: { id } },
        dbTransaction,
      );

      await this.paymentRepository.delete(
        { where: { id: exchange.paymentId } },
        dbTransaction,
      );

      await this.incomeRepository.delete(
        { where: { id: exchange.incomeId } },
        dbTransaction,
      );

      await dbTransaction.commit();

      return result;
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  }
}
