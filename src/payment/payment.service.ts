import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaymentRepository } from './entities/repositories/payment.repository';
import { User, UserModel } from 'src/user/entities/user.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { Payment } from './entities/payment.entity';
import { selectAccountsForPayment, sortAccounts } from './logics/payment.logic';
import { CreatePaymentDto } from './dtos/craete-payment.dto';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { GetAllPaymentsDto } from './dtos/get-all-payment.dto';
import { Paginated } from 'src/common/types/pagination.type';
import { UploadPaymentDto } from './dtos/upload-payment.dto';
import path from 'path';
import { xlsxToJson } from 'src/file/logics/xlsx.logic';
import { Bank } from 'src/account/enums/bank.enum';
import { convertResalatXlsx } from './logics/bank-xlsx/convert-resalat-xlsx.logic';
import { UncompeletePaymentRepository } from './entities/repositories/uncompelete-payment.repository';
import {
  CreateUncompeletePayment,
  UncompeletePayment,
} from './entities/uncompelete-payment.entity';
import { GetAllUncompeletePaymentsDto } from './dtos/get-all-uncompelete-payment.dto';
import { WhereOptions } from 'sequelize';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private uncompeletePaymentRepository: UncompeletePaymentRepository,
    private accountRepository: AccountRepository,
    private accountDebptRepository: AccountDebtRepository,
  ) {}

  async getAllPayments(
    query: GetAllPaymentsDto,
    user: User,
  ): Promise<Paginated<Payment>> {
    const accountIds = await this.accountRepository.findAll({
      where: { userId: user.id },
      attributes: ['id'],
    });

    if (accountIds.length < 0) {
      throw new NotFoundException('No accounts found for this user');
    }

    const payments = await this.paymentRepository.pagination(
      {
        where: { accountId: accountIds.map((a) => a.id) },
      },
      { page: query.page, size: query.size },
    );

    return payments;
  }

  async createPayment(dto: CreatePaymentDto, user: User): Promise<Payment[]> {
    const accounts = await this.accountRepository.findAll({
      where: { userId: user.id, bank: dto.bank },
      order: [['priority', 'ASC']],
    });

    if (accounts?.length === 0) {
      throw new NotFoundException('No accounts found for this user');
    }

    const targetUserId = dto.ownerId || user.id;
    if (!accounts.find((acc) => acc.ownedBy === targetUserId)) {
      throw new NotFoundException('target user id not found');
    }

    const sortedAccounts = sortAccounts(accounts, targetUserId);

    const { selectedAccounts, remain } = selectAccountsForPayment(
      sortedAccounts,
      dto.price,
    );

    if (remain > 0) {
      throw new UnprocessableEntityException('not enugh money in accounts');
    }

    await Promise.all(
      selectedAccounts.map((acc) =>
        this.accountRepository.updateOneById(
          { ballance: acc.ballance },
          acc.id,
        ),
      ),
    );

    const payments = await Promise.all(
      selectedAccounts.map(async (acc) => {
        const payment = await this.paymentRepository.create({
          accountId: acc.id,
          amount: acc.minus,
          category: dto.category,
          description: dto.description,
          isFun: dto.isFun,
          isMaman: dto.isMaman,
          paidAt: dto.paidAt,
        });

        if (acc.ownedBy !== targetUserId) {
          await this.accountDebptRepository.create({
            amount: acc.minus,
            paymentId: payment.id,
            fromUserId: acc.ownedBy,
            toUserId: targetUserId,
          });
        }

        return payment;
      }),
    );

    return payments;
  }

  async uploadBandExport(dto: UploadPaymentDto, user: User) {
    const { uploadedFile, bank } = dto;

    const account = await this.accountRepository.findOne({
      where: { userId: user.id, bank: bank },
      include: { model: UserModel, as: 'user' },
    });

    if (!account) {
      throw new NotFoundException('account-no-found');
    }

    const xlsx = xlsxToJson(
      path.resolve('./uploads/', './bank-upload', `./${uploadedFile}`),
    );

    if (!xlsx) {
      throw new UnprocessableEntityException('file-not-found');
    }

    let data: Omit<CreateUncompeletePayment, 'accountId'>[] | null = null;

    if (bank === Bank.RESALAT) {
      data = convertResalatXlsx(xlsx as Record<string, string>[]);
    }

    if (!data) {
      throw new UnprocessableEntityException('bank-mapping-failed');
    }

    const result = data.map((d) => ({ ...d, accountId: account.id }));

    return this.uncompeletePaymentRepository.bulkCreate(result);
  }

  async getAllUncompeletePayments(
    query: GetAllUncompeletePaymentsDto,
    user: User,
  ): Promise<Paginated<UncompeletePayment>> {
    const { page, size, bank } = query;

    const where: WhereOptions<Account> = { userId: user.id };
    if (bank) {
      where.bank = bank;
    }

    const accountIds = await this.accountRepository.findAll({
      where,
      attributes: ['id'],
    });

    if (accountIds.length < 0) {
      throw new NotFoundException('No accounts found for this user');
    }

    const result = await this.uncompeletePaymentRepository.pagination(
      {
        where: { accountId: accountIds.map((a) => a.id) },
      },
      { page, size },
    );

    return result;
  }
}
