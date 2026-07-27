import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { User } from 'src/user/entities/user.entity';
import { GetRecentActivityDto } from './dtos/get-all-transactions.dto';
import { Paginated } from 'src/common/types/pagination.type';
import { Transaction } from './types/transaction.type';
import { TransactionType } from './enums/transaction-type.enum';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';
import {
  mergeAndSortByDate,
  slicePage,
  fetchLimitForPage,
} from './logics/transaction.logic';

@Injectable()
export class TransactionService {
  constructor(
    private accountRepository: AccountRepository,
    private paymentRepository: PaymentRepository,
    private incomeRepository: IncomeRepository,
  ) {}

  async getRecentActivity(
    query: GetRecentActivityDto,
    user: User,
  ): Promise<Paginated<Transaction>> {
    const { page, size, type, bankId, unitId, ownedBy } = query;
    const limit = fetchLimitForPage(page, size);
    const includePayments = !type || type === TransactionType.PAYMENT;
    const includeIncomes = !type || type === TransactionType.INCOME;

    const accountWhere: WhereOptions<Account> = {
      userId: user.id,
      ...(bankId ? { bankId } : {}),
      ...(unitId ? { unitId } : {}),
      ...(ownedBy ? { ownedBy } : {}),
    };

    const accounts = await this.accountRepository.findAll({
      where: accountWhere,
      attributes: ['id'],
    });

    const accountIds = accounts.map((a) => a.id);

    const accountInclude = [
      {
        model: AccountModel,
        as: 'account',
        attributes: ['id', 'ownedBy', 'bankId', 'unitId'],
        include: [
          {
            model: BankModel,
            as: 'bank',
            attributes: ['id', 'name', 'symbol'],
          },
          {
            model: UnitModel,
            as: 'unit',
            attributes: ['id', 'name', 'symbol'],
          },
        ],
      },
    ];

    let paymentsPromise: Promise<Payment[]> = Promise.resolve([]);
    let paymentCountPromise: Promise<number> = Promise.resolve(0);

    if (includePayments) {
      paymentsPromise = this.paymentRepository.findAll({
        where: { accountId: accountIds },
        include: accountInclude,
        order: [['paidAt', 'DESC']],
        limit,
      });
      paymentCountPromise = this.paymentRepository.count({
        accountId: accountIds,
      });
    }

    let incomesPromise: Promise<Income[]> = Promise.resolve([]);
    let incomeCountPromise: Promise<number> = Promise.resolve(0);

    if (includeIncomes) {
      incomesPromise = this.incomeRepository.findAll({
        where: { accountId: accountIds },
        include: accountInclude,
        order: [['paidAt', 'DESC']],
        limit,
      });
      incomeCountPromise = this.incomeRepository.count({
        accountId: accountIds,
      });
    }

    const [payments, incomes, paymentCount, incomeCount] = await Promise.all([
      paymentsPromise,
      incomesPromise,
      paymentCountPromise,
      incomeCountPromise,
    ]);

    const merged = mergeAndSortByDate(payments, incomes);
    const rows = slicePage(merged, page, size);

    return { rows, count: paymentCount + incomeCount };
  }
}
