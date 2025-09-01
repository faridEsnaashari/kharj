import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ManagerController } from './manager.controller';
import { ManagerModel } from './entities/manager.entity';
import { ManagerService } from './manager.service';
import { ManagerRepository } from './entities/repositories/manager.repository';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([ManagerModel]), AuthModule],
  providers: [ManagerService, ManagerRepository],
  controllers: [ManagerController],
  exports: [ManagerRepository],
})
export class ManagerModule {}
