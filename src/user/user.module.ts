import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserModel } from './entities/user.entity';
import { UserService } from './user.service';
import { UserRepository } from './entities/repositories/user.repository';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel]), AuthModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
