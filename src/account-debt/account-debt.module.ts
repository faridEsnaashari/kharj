import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountDebtModel } from './entities/account-debt.entity';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  //imports: [SequelizeModule.forFeature([Account-debtModel]), AuthModule],
  imports: [SequelizeModule.forFeature([AccountDebtModel])],
})
export class AccountDebtModule {}
