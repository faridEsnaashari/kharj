import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountController } from './account.controller';
import { AccountModel } from './entities/account.entity';
import { AccountService } from './account.service';
import { AccountRepository } from './entities/repositories/account.repository';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { UnitRepository } from 'src/unit/entities/repositories/unit.repository';
import { BankModel } from 'src/bank/entities/bank.entity';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';
import { UserModel } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/entities/repositories/user.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel, UnitModel, BankModel, UserModel]),
  ],
  providers: [
    AccountService,
    AccountRepository,
    UnitRepository,
    BankRepository,
    UserRepository,
  ],
  controllers: [AccountController],
})
export class AccountModule {}
