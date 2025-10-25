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

@Module({
  //imports: [DatabaseModule, PinoModule, AuthModule, UserModule],
  imports: [
    DatabaseModule,
    PinoModule,
    UserModule,
    AuthModule,
    AccountModule,
    IncomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
