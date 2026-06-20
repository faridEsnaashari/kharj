import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { AccountRepository } from './entities/repositories/account.repository';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UserRepository } from 'src/user/entities/repositories/user.repository';
import { User } from 'src/user/entities/user.entity';
import { UnitRepository } from 'src/unit/entities/repositories/unit.repository';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private unitRepository: UnitRepository,
    private bankRepository: BankRepository,
  ) {}

  async findOneAccount(id: number) {
    return this.accountRepository.findOneById(id);
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

    const acc = await this.accountRepository.findOne({
      userId: user.id,
      ownedBy,
      bankId,
      unitId,
    });

    if (acc) {
      throw new ConflictException('account-exist');
    }

    return this.accountRepository.create({ ...dto, userId: user.id });
  }
}
