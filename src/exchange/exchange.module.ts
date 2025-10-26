import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExchangeController } from './exchange.controller';
import { ExchangeModel } from './entities/exchange.entity';
import { ExchangeService } from './exchange.service';
import { ExchangeRepository } from './entities/repositories/exchange.repository';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { AccountModel } from 'src/account/entities/account.entity';
import { IncomeModel } from 'src/income/entities/income.entity';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  //imports: [SequelizeModule.forFeature([ExchangeModel]), AuthModule],
  imports: [
    SequelizeModule.forFeature([
      ExchangeModel,
      PaymentModel,
      AccountModel,
      IncomeModel,
    ]),
  ],
  providers: [
    ExchangeService,
    ExchangeRepository,
    PaymentRepository,
    AccountRepository,
    IncomeRepository,
  ],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
