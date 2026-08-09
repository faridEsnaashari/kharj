import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { IncomeRepository } from './entities/repositories/income.repository';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { UpdateIncomeDto } from './dtos/update-income.dto';
import { GetAllIncomeDto } from './dtos/get-all-income.dto';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { User } from 'src/user/entities/user.entity';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { Income, UpdateIncome } from './entities/income.entity';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { calculateUpdatedBalance } from './logics/income.logic';
import { Sequelize } from 'sequelize-typescript';
import { getIncomeCategoryOptions } from './logics/income-category.logic';

@Injectable()
export class IncomeService {
  constructor(
    private incomeRepository: IncomeRepository,
    private accountRepository: AccountRepository,
    private seq: Sequelize,
  ) {}

  getIncomeCategories() {
    return getIncomeCategoryOptions();
  }

  async findOneIncome(id: number) {
    return this.incomeRepository.findOneByIdOrFail(id);
  }

  async getAllIncomes(query: GetAllIncomeDto, user: User) {
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

    const incomeWhere: WhereOptions<Income> = {
      accountId: accountIds,
      ...(query.category ? { category: query.category } : {}),
    };

    return this.incomeRepository.pagination(
      {
        where: incomeWhere,
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

  async createIncome(dto: CreateIncomeDto, user: User) {
    const account = await this.accountRepository.findOneOrFail({
      where: { id: dto.accountId, userId: user.id },
    });

    const dbTransaction = await this.seq.transaction();

    try {
      const newBalance = account.ballance + dto.amount;

      await this.accountRepository.updateOneById(
        { ballance: newBalance },
        account.id,
        dbTransaction,
      );

      const result = await this.incomeRepository.create(
        {
          ...dto,
          remain: newBalance,
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

  async updateIncome(id: number, dto: UpdateIncomeDto, user: User) {
    const income = (await this.incomeRepository.findOneOrFail({
      where: { id },
      include: [
        {
          model: AccountModel,
          as: 'account',
          where: { userId: user.id },
          required: true,
        },
      ],
    })) as unknown as Income;

    const newBalance = calculateUpdatedBalance(
      income.account.ballance,
      income.amount,
      dto.amount,
    );

    const dbTransaction = await this.seq.transaction();

    try {
      await this.accountRepository.updateOneById(
        { ballance: newBalance },
        income.accountId,
        dbTransaction,
      );

      const incomeUpdate: UpdateIncome = {
        amount: dto.amount,
        remain: newBalance,
        category: dto.category,
        description: dto.description,
        paidAt: dto.paidAt,
      };

      await this.incomeRepository.updateOneById(
        incomeUpdate,
        id,
        dbTransaction,
      );

      await dbTransaction.commit();
    } catch (err) {
      await dbTransaction.rollback();
      throw err;
    }

    return this.incomeRepository.findOneByIdOrFail(id);
  }

  async deleteIncome(id: number, user: User) {
    const dbTransaction = await this.seq.transaction();

    try {
      const income = await this.incomeRepository.findOneOrFail(
        {
          where: {
            id,
          },
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

      await this.accountRepository.update(
        {
          ballance: income.account.ballance - income.amount,
        },
        { id: income.accountId },
        dbTransaction,
      );

      const result = await this.incomeRepository.delete(
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
