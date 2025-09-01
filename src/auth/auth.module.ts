import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserHasPermissionModel } from './entities/user-has-permission.entity';
import { UserHasPermissionRepository } from './entities/repositories/user-has-permissions.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserHasPermissionModel])],
  providers: [AuthService, UserHasPermissionRepository],
  controllers: [AuthController],
  exports: [UserHasPermissionRepository],
})
export class AuthModule {}
