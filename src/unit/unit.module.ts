import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitController } from './unit.controller';
import { UnitModel } from './entities/unit.entity';
import { UnitService } from './unit.service';
import { UnitRepository } from './entities/repositories/unit.repository';
import { AccountModel } from 'src/account/entities/account.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';

@Module({
  imports: [SequelizeModule.forFeature([UnitModel, AccountModel])],
  providers: [UnitService, UnitRepository, AccountRepository],
  controllers: [UnitController],
})
export class UnitModule {}
