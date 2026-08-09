import { Module } from '@nestjs/common';
import { AccountModel } from 'src/account/entities/account.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UncompletePaymentController } from './uncomplete-payment.controller';
import { UncompletePaymentModel } from './entities/uncomplete-payment.entity';
import { UncompletePaymentService } from './uncomplete-payment.service';
import { UncompletePaymentRepository } from './entities/repositories/uncomplete-payment.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { BankModel } from 'src/bank/entities/bank.entity';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UncompletePaymentModel,
      AccountModel,
      BankModel,
    ]),
  ],
  providers: [
    UncompletePaymentService,
    UncompletePaymentRepository,
    AccountRepository,
    BankRepository,
  ],
  controllers: [UncompletePaymentController],
})
export class UncompletePaymentsModule {}
