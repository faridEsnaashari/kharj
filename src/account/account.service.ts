import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepository } from './entities/repositories/account.repository';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UserRepository } from 'src/user/entities/repositories/user.repository';
import { User } from 'src/user/entities/user.entity';
import { UnitRepository } from 'src/unit/entities/repositories/unit.repository';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private unitRepository: UnitRepository,
  ) {}

  async findOneAccount(id: number) {
    return this.accountRepository.findOneById(id);
  }

  async createAccount(dto: CreateAccountDto, user: User) {
    const { ownedBy, bank, unitId } = dto;

    await this.userRepository.findOneByIdOrFail(user.id);
    await this.userRepository.findOneByIdOrFail(ownedBy);

    const unit = await this.unitRepository.findOne({
      id: unitId,
      userId: user.id,
    });

    if (!unit) {
      throw new NotFoundException('unit-not-found');
    }

    const acc = await this.accountRepository.findOne({
      userId: user.id,
      ownedBy,
      bank,
      unitId,
    });

    if (acc) {
      throw new ConflictException('account-exist');
    }

    return this.accountRepository.create({ ...dto, userId: user.id });
  }
}
