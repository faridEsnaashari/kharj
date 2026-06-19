import { Injectable } from '@nestjs/common';
import { IncomeRepository } from './entities/repositories/income.repository';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class IncomeService {
  constructor(
    private incomeRepository: IncomeRepository,
    private accountRepository: AccountRepository,
  ) {}

  async findOneIncome(id: number) {
    return this.incomeRepository.findOneById(id);
  }

  async createIncome(dto: CreateIncomeDto, reqUser: User) {
    const { accountId, amount } = dto;

    const acc = await this.accountRepository.findOneOrFail({
      id: accountId,
      userId: reqUser.id,
    });

    await this.incomeRepository.create({
      ...dto,
      accountId: acc.id,
      remain: acc.ballance + amount,
    });

    return this.accountRepository.updateOneById(
      { ballance: acc.ballance + amount },
      acc.id,
    );
  }
}
