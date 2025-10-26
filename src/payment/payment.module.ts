import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentController } from './payment.controller';
import { PaymentModel } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './entities/repositories/payment.repository';
import { AccountModel } from 'src/account/entities/account.entity';
import { AccountDebtModel } from 'src/account-debt/entities/account-debt.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  //imports: [SequelizeModule.forFeature([PaymentModel]), AuthModule],
  imports: [
    SequelizeModule.forFeature([PaymentModel, AccountModel, AccountDebtModel]),
  ],
  providers: [
    PaymentService,
    PaymentRepository,
    AccountRepository,
    AccountDebtRepository,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
