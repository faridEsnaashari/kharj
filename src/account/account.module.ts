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

@Module({
  imports: [SequelizeModule.forFeature([AccountModel, UnitModel, BankModel])],
  providers: [
    AccountService,
    AccountRepository,
    UnitRepository,
    BankRepository,
  ],
  controllers: [AccountController],
})
export class AccountModule {}
