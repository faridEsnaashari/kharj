import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { AccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { User, UserModel } from 'src/user/entities/user.entity';
import { GetAllDebtDto } from './dtos/get-all-debt.dto';

@Injectable()
export class DebtService {
  constructor(private accountDebtRepository: AccountDebtRepository) {}

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
        include: [
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
        ],
        order: [['createdAt', 'DESC']],
      },
      { page: query.page, size: query.size },
    );
  }
}
