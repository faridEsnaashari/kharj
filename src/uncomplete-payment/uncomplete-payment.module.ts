import { Module } from '@nestjs/common';
import { AccountModel } from 'src/account/entities/account.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UncompletePaymentController } from './uncomplete-payment.controller';
import { UncompletePaymentModel } from './entities/uncomplete-payment.entity';
import { UncompletePaymentService } from './uncomplete-payment.service';
import { UncompletePaymentRepository } from './entities/repositories/uncomplete-payment.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  //imports: [SequelizeModule.forFeature([UncompletePaymentsModel]), AuthModule],
  imports: [SequelizeModule.forFeature([UncompletePaymentModel, AccountModel])],
  providers: [
    UncompletePaymentService,
    UncompletePaymentRepository,
    AccountRepository,
  ],
  controllers: [UncompletePaymentController],
})
export class UncompletePaymentsModule {}
