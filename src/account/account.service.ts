import { ConflictException, Injectable } from '@nestjs/common';
import { AccountRepository } from './entities/repositories/account.repository';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UserRepository } from 'src/user/entities/repositories/user.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
  ) {}

  async findOneAccount(id: number) {
    return this.accountRepository.findOneById(id);
  }

  async createAccount(dto: CreateAccountDto, user: User) {
    const { ownedBy, bank } = dto;

    await this.userRepository.findOneByIdOrFail(user.id);
    await this.userRepository.findOneByIdOrFail(dto.ownedBy);

    const acc = await this.accountRepository.findOne({
      userId: user.id,
      ownedBy,
      bank,
    });

    if (acc) {
      throw new ConflictException('account-exist');
    }

    return this.accountRepository.create({ ...dto, userId: user.id });
  }
}
