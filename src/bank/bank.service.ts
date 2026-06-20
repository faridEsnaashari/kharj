import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { BankRepository } from './entities/repositories/bank.repository';
import { CreateBankDto } from './dtos/create-bank.dto';
import { UpdateBankDto } from './dtos/update-bank.dto';
import { User } from 'src/user/entities/user.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';

@Injectable()
export class BankService {
  constructor(
    private bankRepository: BankRepository,
    private accountRepository: AccountRepository,
  ) {}

  async findAllBanks(user: User) {
    return this.bankRepository.findAll({
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });
  }

  async findOneBank(id: number, user: User) {
    const bank = await this.bankRepository.findOne({
      id,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (!bank) {
      throw new NotFoundException('bank-not-found');
    }

    return bank;
  }

  async createBank(dto: CreateBankDto, user: User) {
    const existing = await this.bankRepository.findOne({
      symbol: dto.symbol,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (existing) {
      throw new ConflictException('bank-exist');
    }

    return this.bankRepository.create({ ...dto, userId: user.id });
  }

  async updateBank(id: number, dto: UpdateBankDto, user: User) {
    const bank = await this.bankRepository.findOne({ id, userId: user.id });

    if (!bank) {
      throw new NotFoundException('bank-not-found');
    }

    const existing = await this.bankRepository.findOne({
      symbol: dto.symbol,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (existing && existing.id !== id) {
      throw new ConflictException('bank-exist');
    }

    await this.bankRepository.updateOneById(dto, id);

    return this.findOneBank(id, user);
  }

  async deleteBank(id: number, user: User) {
    const bank = await this.bankRepository.findOne({ id, userId: user.id });

    if (!bank) {
      throw new NotFoundException('bank-not-found');
    }

    const accountsUsingBank = await this.accountRepository.findAll({
      bankId: id,
    });

    if (accountsUsingBank.length > 0) {
      throw new ConflictException('bank-in-use');
    }

    await this.bankRepository.deleteById(id);

    return { id };
  }
}
