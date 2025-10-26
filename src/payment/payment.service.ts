import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaymentRepository } from './entities/repositories/payment.repository';
import { User } from 'src/user/entities/user.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { Payment } from './entities/payment.entity';
import { selectAccountsForPayment } from './logics/payment.logic';
import { CreatePaymentDto } from './dtos/craete-payment.dto';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private accountRepository: AccountRepository,
    private accountDebptRepository: AccountDebtRepository,
  ) {}

  async createPayment(dto: CreatePaymentDto, user: User): Promise<Payment[]> {
    const accounts = await this.accountRepository.findAll({
      where: { userId: user.id, bank: dto.bank },
      order: [['priority', 'ASC']],
    });

    if (accounts?.length === 0) {
      throw new NotFoundException('No accounts found for this user');
    }

    const { selectedAccounts, remain } = selectAccountsForPayment(
      accounts,
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
        });

        if (acc.ownedBy !== user.id) {
          await this.accountDebptRepository.create({
            amount: acc.minus,
            paymentId: payment.id,
            fromUserId: acc.ownedBy,
            toUserId: user.id,
          });
        }

        return payment;
      }),
    );

    return payments;
  }
}
