import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/entities/repositories/user.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/user/entities/user.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
