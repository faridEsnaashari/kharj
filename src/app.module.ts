import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/ports/database/database.module';
import { PinoModule } from './common/tools/pino/pino.module';
//import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { IncomeModule } from './income/income.module';
import { PaymentModule } from './payment/payment.module';
import { ExchangeModule } from './exchange/exchange.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';

@Module({
  //imports: [DatabaseModule, PinoModule, AuthModule, UserModule],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    PinoModule,
    UserModule,
    AuthModule,
    AccountModule,
    IncomeModule,
    PaymentModule,
    ExchangeModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
