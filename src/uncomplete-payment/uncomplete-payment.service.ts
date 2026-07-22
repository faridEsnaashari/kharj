import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';
import { PaymentModel } from '../payment/entities/payment.entity';
import { Paginated } from 'src/common/types/pagination.type';
import { UploadPaymentDto } from './dtos/upload-payment.dto';
import path from 'path';
import { xlsxToJson } from 'src/file/logics/xlsx.logic';
import { BankProvider } from 'src/bank/enums/bank-provider.enum';
import { UncompletePaymentRepository } from './entities/repositories/uncomplete-payment.repository';
import {
  CreateUncompletePayment,
  UncompletePayment,
} from './entities/uncomplete-payment.entity';
import { GetAllUncompletePaymentsDto } from './dtos/get-all-uncomplete-payment.dto';
import { WhereOptions } from 'sequelize';
import { Account } from 'src/account/entities/account.entity';
import { PaymentTextDto } from './dtos/payment-text.dto';
import { convertResalatText } from './logics/resalat/convert-resalat-text.logic';
import { convertResalatXlsx } from './logics/resalat/convert-resalat-xlsx.logic';
import { convertPasargadText } from './logics/pasargad/convert-pasargad-text.logic';
import {
  convertPasargadXlsx,
  PasargadBillRow,
} from './logics/pasargad/convert-pasargad-xlsx.logic';
import { convertMelyXlsx } from './logics/mely/convert-mely-xlsx.logic';
import { IncomeModel } from 'src/income/entities/income.entity';
import { DeleteUncompletePaymentsDto } from './dtos/delete-uncomplete-payment.dto';

@Injectable()
export class UncompletePaymentService {
  constructor(
    private uncompletePaymentRepository: UncompletePaymentRepository,
    private accountRepository: AccountRepository,
    private bankRepository: BankRepository,
  ) {}

  async uploadBandExport(dto: UploadPaymentDto, user: User) {
    const { uploadedFile, bankId } = dto;

    const account = await this.accountRepository.findOne({
      where: { userId: user.id, bankId },
    });

    if (!account) {
      throw new NotFoundException('account-no-found');
    }

    const bank = await this.bankRepository.findOneByIdOrFail(bankId);

    const xlsx = xlsxToJson(
      path.resolve('./uploads/', './bank-upload', `./${uploadedFile}`),
    );

    if (!xlsx) {
      throw new UnprocessableEntityException('file-not-found');
    }

    let data: Omit<CreateUncompletePayment, 'accountId'>[] | null = null;

    if (bank.symbol === BankProvider.RESALAT) {
      data = convertResalatXlsx(xlsx as Record<string, string>[]);
    }

    if (bank.symbol === BankProvider.PASARGAD) {
      data = convertPasargadXlsx(xlsx as PasargadBillRow[]);
    }

    if (bank.symbol === BankProvider.MELY) {
      data = convertMelyXlsx(xlsx as Record<string, string>[]);
    }

    if (!data) {
      throw new UnprocessableEntityException('bank-mapping-failed');
    }

    const result = data.map((d) => ({ ...d, accountId: account.id }));

    return this.uncompletePaymentRepository.bulkCreate(result);
  }

  async getAllUncompletePayments(
    query: GetAllUncompletePaymentsDto,
    user: User,
  ): Promise<Paginated<UncompletePayment>> {
    const { page, size, bankId } = query;

    const where: WhereOptions<Account> = { userId: user.id };
    if (bankId) {
      where.bankId = bankId;
    }

    const accountIds = await this.accountRepository.findAll({
      where,
      attributes: ['id'],
    });

    if (accountIds.length < 0) {
      throw new NotFoundException('No accounts found for this user');
    }

    const result = await this.uncompletePaymentRepository.pagination(
      {
        where: {
          accountId: accountIds.map((a) => a.id),
          '$payment.uncomplete_payment_id$': null,
          '$income.uncomplete_payment_id$': null,
        },
        include: [
          {
            model: PaymentModel,
            as: 'payment',
          },
          {
            model: IncomeModel,
            as: 'income',
          },
        ],
        order: [['paidAt', 'ASC']],
      },
      { page, size },
    );

    return result;
  }

  async paymentText(dto: PaymentTextDto, user: User) {
    const { text, bankId } = dto;

    const account = await this.accountRepository.findOne({
      where: { userId: user.id, bankId },
    });

    if (!account) {
      throw new NotFoundException('account-no-found');
    }

    const bank = await this.bankRepository.findOneByIdOrFail(bankId);

    let data: Omit<CreateUncompletePayment, 'accountId'> | null = null;

    if (bank.symbol === BankProvider.RESALAT) {
      data = convertResalatText(text);
    }

    if (bank.symbol === BankProvider.PASARGAD) {
      data = convertPasargadText(text);
    }

    if (!data) {
      throw new UnprocessableEntityException('bank-mapping-failed');
    }

    const result = { ...data, accountId: account.id };

    return this.uncompletePaymentRepository.create(result);
  }

  async deleteUncompletePayment(dto: DeleteUncompletePaymentsDto, user: User) {
    const { id } = dto;

    const uncomplete =
      await this.uncompletePaymentRepository.findOneByIdOrFail(id);

    const account = await this.accountRepository.findOne({
      where: { userId: user.id, id: uncomplete.accountId },
    });

    if (!account) {
      throw new NotFoundException('account-no-found');
    }

    return this.uncompletePaymentRepository.deleteById(id);
  }
}
