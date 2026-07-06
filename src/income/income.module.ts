import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncomeController } from './income.controller';
import { IncomeModel } from './entities/income.entity';
import { IncomeService } from './income.service';
import { IncomeRepository } from './entities/repositories/income.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { AccountModel } from 'src/account/entities/account.entity';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      IncomeModel,
      AccountModel,
      BankModel,
      UnitModel,
    ]),
  ],
  providers: [IncomeService, IncomeRepository, AccountRepository],
  controllers: [IncomeController],
})
export class IncomeModule {}
