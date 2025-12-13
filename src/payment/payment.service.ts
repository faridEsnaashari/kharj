import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaymentRepository } from './entities/repositories/payment.repository';
import { User } from 'src/user/entities/user.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { Payment } from './entities/payment.entity';
import { selectAccountsForPayment, sortAccounts } from './logics/payment.logic';
import { CreatePaymentDto } from './dtos/craete-payment.dto';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { GetAllPaymentsDto } from './dtos/get-all-payment.dto';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
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
}
