import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { AccountRepository } from './entities/repositories/account.repository';
import { CreateAccountDto } from './dtos/create-account.dto';
import { GetAllAccountsDto } from './dtos/get-all-account.dto';
import { GetAccountStatisticDto } from './dtos/get-account-statistic.dto';
import { UserRepository } from 'src/user/entities/repositories/user.repository';
import { User, UserModel } from 'src/user/entities/user.entity';
import { UnitRepository } from 'src/unit/entities/repositories/unit.repository';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';
import { BankModel } from 'src/bank/entities/bank.entity';
import { Account } from './entities/account.entity';
import {
  groupAccountsByUnit,
  sumWeeklyPaymentIncomeByUnit,
} from './logics/account.logic';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { date } from 'src/common/tools/date/date.tool';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private unitRepository: UnitRepository,
    private bankRepository: BankRepository,
    private paymentRepository: PaymentRepository,
    private incomeRepository: IncomeRepository,
  ) {}

  async findAllAccounts(query: GetAllAccountsDto, user: User) {
    const where: WhereOptions<Account> = {
      userId: user.id,
      ...(query.ownedBy ? { ownedBy: query.ownedBy } : {}),
      ...(query.bankId ? { bankId: query.bankId } : {}),
      ...(query.unitId ? { unitId: query.unitId } : {}),
    };

    return this.accountRepository.pagination(
      {
        where,
        include: [
          { model: UserModel, as: 'owner', attributes: ['id', 'name'] },
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
      { page: query.page, size: query.size },
    );
  }

  async findOneAccount(id: number, user: User) {
    return this.accountRepository.findOneOrFail({
      where: { id, userId: user.id },
      include: [
        { model: UserModel, as: 'owner', attributes: ['id', 'name'] },
        { model: BankModel, as: 'bank', attributes: ['id', 'name', 'symbol'] },
        { model: UnitModel, as: 'unit', attributes: ['id', 'name', 'symbol'] },
      ],
    });
  }

  async getGroupByUnit(query: GetAccountStatisticDto, user: User) {
    const where: WhereOptions<Account> = {
      userId: user.id,
      ...(query.unitId ? { unitId: query.unitId } : {}),
    };

    const accounts = await this.accountRepository.findAll({
      where,
      include: [
        { model: UnitModel, as: 'unit', attributes: ['id', 'name', 'symbol'] },
      ],
    });

    return groupAccountsByUnit(accounts);
  }

  async getWeeklyPaymentIncome(query: GetAccountStatisticDto, user: User) {
    const where: WhereOptions<Account> = {
      userId: user.id,
      ...(query.unitId ? { unitId: query.unitId } : {}),
    };

    const accounts = await this.accountRepository.findAll({ where });

    const accountIds = accounts.map((account) => account.id);
    const weekAgo = date().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss');

    const [payments, incomes] = await Promise.all([
      this.paymentRepository.findAll({
        where: { accountId: accountIds, paidAt: { [Op.gte]: weekAgo } },
      }),
      this.incomeRepository.findAll({
        where: { accountId: accountIds, paidAt: { [Op.gte]: weekAgo } },
      }),
    ]);

    return sumWeeklyPaymentIncomeByUnit(accounts, payments, incomes);
  }

  async createAccount(dto: CreateAccountDto, user: User) {
    const { ownedBy, bankId, unitId } = dto;

    await this.userRepository.findOneByIdOrFail(user.id);
    await this.userRepository.findOneByIdOrFail(ownedBy);

    const unit = await this.unitRepository.findOne({
      id: unitId,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (!unit) {
      throw new NotFoundException('unit-not-found');
    }

    const bank = await this.bankRepository.findOne({
      id: bankId,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (!bank) {
      throw new NotFoundException('bank-not-found');
    }

    const existing = await this.accountRepository.findOne({
      userId: user.id,
      ownedBy,
      bankId,
      unitId,
    });

    if (existing) {
      throw new ConflictException('account-exist');
    }

    return this.accountRepository.create({ ...dto, userId: user.id });
  }
}
