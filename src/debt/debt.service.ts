import { Injectable } from '@nestjs/common';
import { Includeable, Op, WhereOptions } from 'sequelize';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { AccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { User, UserModel } from 'src/user/entities/user.entity';
import { GetAllDebtDto } from './dtos/get-all-debt.dto';
import { GetDebtSummaryDto } from './dtos/get-debt-summary.dto';
import { buildDebtSummary } from './logics/debt.logic';
import { DebtSummary } from './logics/debt.logic.type';

@Injectable()
export class DebtService {
  constructor(private accountDebtRepository: AccountDebtRepository) {}

  private buildDebtInclude(accountWhere: WhereOptions<Account>): Includeable[] {
    return [
      {
        model: PaymentModel,
        as: 'payment',
        required: true,
        include: [
          {
            model: AccountModel,
            as: 'account',
            required: true,
            where: accountWhere,
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
        ],
      },
      { model: UserModel, as: 'fromUser', attributes: ['id', 'name'] },
      { model: UserModel, as: 'toUser', attributes: ['id', 'name'] },
    ];
  }

  async getAllDebts(query: GetAllDebtDto, user: User) {
    const debtWhere: WhereOptions<AccountDebt> = {
      [Op.or]: [{ fromUserId: user.id }, { toUserId: user.id }],
      ...(query.fromUserId ? { fromUserId: query.fromUserId } : {}),
      ...(query.toUserId ? { toUserId: query.toUserId } : {}),
    };

    const accountWhere: WhereOptions<Account> = {
      userId: user.id,
      ...(query.bankId ? { bankId: query.bankId } : {}),
      ...(query.unitId ? { unitId: query.unitId } : {}),
    };

    return this.accountDebtRepository.pagination(
      {
        where: debtWhere,
        include: this.buildDebtInclude(accountWhere),
        order: [['createdAt', 'DESC']],
      },
      { page: query.page, size: query.size },
    );
  }

  async getDebtSummary(
    query: GetDebtSummaryDto,
    user: User,
  ): Promise<DebtSummary> {
    const debtWhere: WhereOptions<AccountDebt> = {
      [Op.or]: [{ fromUserId: user.id }, { toUserId: user.id }],
    };

    const accountWhere: WhereOptions<Account> = {
      userId: user.id,
      ...(query.bankId ? { bankId: query.bankId } : {}),
      ...(query.unitId ? { unitId: query.unitId } : {}),
    };

    const rows = await this.accountDebtRepository.findAll({
      where: debtWhere,
      include: this.buildDebtInclude(accountWhere),
    });

    return buildDebtSummary(rows, query.groupBy, user.id);
  }
}
