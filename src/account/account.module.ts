import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountController } from './account.controller';
import { AccountModel } from './entities/account.entity';
import { AccountService } from './account.service';
import { AccountRepository } from './entities/repositories/account.repository';
//import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  //imports: [SequelizeModule.forFeature([AccountModel]), AuthModule],
  imports: [SequelizeModule.forFeature([AccountModel])],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  exports: [AccountRepository],
})
export class AccountModule {}
