import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncomeController } from './income.controller';
import { IncomeModel } from './entities/income.entity';
import { IncomeService } from './income.service';
import { IncomeRepository } from './entities/repositories/income.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { AccountModel } from 'src/account/entities/account.entity';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  //imports: [SequelizeModule.forFeature([IncomeModel]), AuthModule],
  imports: [SequelizeModule.forFeature([IncomeModel, AccountModel])],
  providers: [IncomeService, IncomeRepository, AccountRepository],
  controllers: [IncomeController],
  exports: [IncomeRepository],
})
export class IncomeModule {}
