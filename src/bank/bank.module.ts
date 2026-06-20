import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankController } from './bank.controller';
import { BankModel } from './entities/bank.entity';
import { BankService } from './bank.service';
import { BankRepository } from './entities/repositories/bank.repository';
import { AccountModel } from 'src/account/entities/account.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';

@Module({
  imports: [SequelizeModule.forFeature([BankModel, AccountModel])],
  providers: [BankService, BankRepository, AccountRepository],
  controllers: [BankController],
})
export class BankModule {}
