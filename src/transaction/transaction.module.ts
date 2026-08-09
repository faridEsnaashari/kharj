import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AccountModel } from 'src/account/entities/account.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { IncomeModel } from 'src/income/entities/income.entity';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { BankModel } from 'src/bank/entities/bank.entity';
import { UnitModel } from 'src/unit/entities/unit.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AccountModel,
      PaymentModel,
      IncomeModel,
      BankModel,
      UnitModel,
    ]),
  ],
  providers: [
    TransactionService,
    AccountRepository,
    PaymentRepository,
    IncomeRepository,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
