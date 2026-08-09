import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { AccountDebtModel } from 'src/account-debt/entities/account-debt.entity';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { AccountModel } from 'src/account/entities/account.entity';
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';
import { UserModel } from 'src/user/entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AccountDebtModel,
      AccountModel,
      PaymentModel,
      BankModel,
      UnitModel,
      UserModel,
    ]),
  ],
  providers: [DebtService, AccountDebtRepository],
  controllers: [DebtController],
})
export class DebtModule {}
