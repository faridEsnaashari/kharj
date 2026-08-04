import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { PaymentRepository } from './entities/repositories/payment.repository';
import { User } from 'src/user/entities/user.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { Payment, UpdatePayment } from './entities/payment.entity';
import {
  selectAccountsForPayment,
  sortAccounts,
  restoreBalance,
  deductBalance,
  hasSufficientBalance,
} from './logics/payment.logic';
import { CreatePaymentDto } from './dtos/craete-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { GetAllPaymentsDto } from './dtos/get-all-payment.dto';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { UpdateAccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { UncompletePaymentRepository } from 'src/uncomplete-payment/entities/repositories/uncomplete-payment.repository';
import { Paginated } from 'src/common/types/pagination.type';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private uncompletePaymentRepository: UncompletePaymentRepository,
    private accountRepository: AccountRepository,
    private accountDebtRepository: AccountDebtRepository,
    private seq: Sequelize,
  ) {}

  async getAllPayments(
    query: GetAllPaymentsDto,
    user: User,
  ): Promise<Paginated<Payment>> {
    const accountWhere: WhereOptions<Account> = {
      userId: user.id,
      ...(query.bankId ? { bankId: query.bankId } : {}),
      ...(query.unitId ? { unitId: query.unitId } : {}),
      ...(query.ownedBy ? { ownedBy: query.ownedBy } : {}),
    };

    const accounts = await this.accountRepository.findAll({
      where: accountWhere,
      attributes: ['id'],
    });

    const accountIds = accounts.map((a) => a.id);

    const paymentWhere: WhereOptions<Payment> = {
      accountId: accountIds,
      ...(query.category ? { category: query.category } : {}),
    };

    return this.paymentRepository.pagination(
      {
        where: paymentWhere,
        include: [
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
        ],
        order: [['paidAt', 'DESC']],
      },
      { page: query.page, size: query.size },
    );
  }

  async createPayment(dto: CreatePaymentDto, user: User): Promise<Payment[]> {
    const accounts = await this.accountRepository.findAll({
      where: { userId: user.id, bankId: dto.bankId, unitId: dto.unitId },
      order: [['priority', 'ASC']],
    });

    if (accounts.length === 0) {
      throw new NotFoundException('no-accounts-found');
    }

    if (dto.uncompletePaymentId) {
      const un = await this.uncompletePaymentRepository.findOneById(
        dto.uncompletePaymentId,
      );

      if (!un) {
        throw new NotFoundException('uncomplete-payment-not-found');
      }
    }

    const targetUserId = dto.ownerId || user.id;

    if (!accounts.find((acc) => acc.ownedBy === targetUserId)) {
      throw new NotFoundException('target-user-not-found');
    }

    const sortedAccounts = sortAccounts(accounts, targetUserId);
    const { selectedAccounts, remain } = selectAccountsForPayment(
      sortedAccounts,
      dto.price,
    );

    if (remain > 0) {
      throw new UnprocessableEntityException('insufficient-balance');
    }

    const dbTransaction = await this.seq.transaction();

    try {
      await Promise.all(
        selectedAccounts.map((acc) =>
          this.accountRepository.updateOneById(
            { ballance: acc.ballance },
            acc.id,
            dbTransaction,
          ),
        ),
      );

      const payments = await Promise.all(
        selectedAccounts.map(async (acc) => {
          const payment = await this.paymentRepository.create(
            {
              accountId: acc.id,
              amount: acc.minus,
              remain: acc.ballance,
              category: dto.category,
              description: dto.description,
              isFun: dto.isFun,
              isMaman: dto.isMaman,
              paidAt: dto.paidAt,
              uncompletePaymentId: dto.uncompletePaymentId,
            },
            dbTransaction,
          );

          if (acc.ownedBy !== targetUserId) {
            await this.accountDebtRepository.create(
              {
                amount: acc.minus,
                paymentId: payment.id,
                fromUserId: acc.ownedBy,
                toUserId: targetUserId,
              },
              dbTransaction,
            );
          }

          return payment;
        }),
      );

      await dbTransaction.commit();

      return payments;
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }
  }

  async updatePayment(
    id: number,
    dto: UpdatePaymentDto,
    user: User,
  ): Promise<Payment> {
    const payment = (await this.paymentRepository.findOneOrFail({
      where: { id },
      include: [
        {
          model: AccountModel,
          as: 'account',
          where: { userId: user.id },
          required: true,
        },
      ],
    })) as unknown as Payment;

    const restored = restoreBalance(payment.account.ballance, payment.amount);

    if (!hasSufficientBalance(restored, dto.price)) {
      throw new UnprocessableEntityException('insufficient-balance');
    }

    const newBalance = deductBalance(restored, dto.price);

    const dbTransaction = await this.seq.transaction();

    try {
      await this.accountRepository.updateOneById(
        { ballance: newBalance },
        payment.accountId,
        dbTransaction,
      );

      const debt = await this.accountDebtRepository.findOne(
        { where: { paymentId: id } },
        dbTransaction,
      );

      if (debt) {
        const debtUpdate: UpdateAccountDebt = { amount: dto.price };
        await this.accountDebtRepository.updateOneById(
          debtUpdate,
          debt.id,
          dbTransaction,
        );
      }

      const paymentUpdate: UpdatePayment = {
        amount: dto.price,
        remain: newBalance,
        category: dto.category,
        description: dto.description,
        isFun: dto.isFun,
        isMaman: dto.isMaman,
        paidAt: dto.paidAt,
      };

      await this.paymentRepository.updateOneById(
        paymentUpdate,
        id,
        dbTransaction,
      );

      await dbTransaction.commit();
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }

    return this.paymentRepository.findOneByIdOrFail(id);
  }

  async deletePayment(id: number, user: User): Promise<number> {
    const dbTransaction = await this.seq.transaction();

    try {
      const payment = await this.paymentRepository.findOneOrFail(
        {
          where: { id },
          include: [
            {
              model: AccountModel,
              as: 'account',
              where: { userId: user.id },
              required: true,
            },
          ],
        },
        dbTransaction,
      );

      const restored = restoreBalance(payment.account.ballance, payment.amount);

      await this.accountRepository.updateOneById(
        { ballance: restored },
        payment.accountId,
        dbTransaction,
      );

      await this.accountDebtRepository.delete(
        { where: { paymentId: id } },
        dbTransaction,
      );

      const result = await this.paymentRepository.delete(
        { where: { id } },
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
