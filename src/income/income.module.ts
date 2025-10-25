import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncomeController } from './income.controller';
import { IncomeModel } from './entities/income.entity';
import { IncomeService } from './income.service';
import { IncomeRepository } from './entities/repositories/income.repository';
//import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  //imports: [SequelizeModule.forFeature([IncomeModel]), AuthModule],
  imports: [SequelizeModule.forFeature([IncomeModel])],
  providers: [IncomeService, IncomeRepository],
  controllers: [IncomeController],
  exports: [IncomeRepository],
})
export class IncomeModule {}
