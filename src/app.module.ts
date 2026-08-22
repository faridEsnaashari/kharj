import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/ports/database/database.module';
import { PinoModule } from './common/tools/pino/pino.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { IncomeModule } from './income/income.module';
import { PaymentModule } from './payment/payment.module';
import { ExchangeModule } from './exchange/exchange.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';
import { UncompletePaymentsModule } from './uncomplete-payment/uncomplete-payment.module';
import { UnitModule } from './unit/unit.module';
import { BankModule } from './bank/bank.module';
import { TransactionModule } from './transaction/transaction.module';
import { DebtModule } from './debt/debt.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/front',
    }),
    DatabaseModule,
    PinoModule,
    UserModule,
    AuthModule,
    UnitModule,
    BankModule,
    AccountModule,
    IncomeModule,
    PaymentModule,
    ExchangeModule,
    FileModule,
    UncompletePaymentsModule,
    TransactionModule,
    DebtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
