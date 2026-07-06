import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { User } from 'src/user/entities/user.entity';
import { GetRecentActivityDto } from './dtos/get-all-transactions.dto';
import { Paginated } from 'src/common/types/pagination.type';
import { Transaction } from './types/transaction.type';
import { AccountModel } from 'src/account/entities/account.entity';
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
    const { page, size } = query;
    const limit = fetchLimitForPage(page, size);

    const accounts = await this.accountRepository.findAll({
      where: { userId: user.id },
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

    const [payments, incomes, paymentCount, incomeCount] = await Promise.all([
      this.paymentRepository.findAll({
        where: { accountId: accountIds },
        include: accountInclude,
        order: [['paidAt', 'DESC']],
        limit,
      }),
      this.incomeRepository.findAll({
        where: { accountId: accountIds },
        include: accountInclude,
        order: [['paidAt', 'DESC']],
        limit,
      }),
      this.paymentRepository.count({ accountId: accountIds }),
      this.incomeRepository.count({ accountId: accountIds }),
    ]);

    const merged = mergeAndSortByDate(payments, incomes);
    const rows = slicePage(merged, page, size);

    return { rows, count: paymentCount + incomeCount };
  }
}
