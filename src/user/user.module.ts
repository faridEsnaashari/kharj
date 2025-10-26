import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserModel } from './entities/user.entity';
import { UserService } from './user.service';
import { UserRepository } from './entities/repositories/user.repository';
import { UserRelationRepository } from './entities/repositories/user-relation.repository';
import { UserRelationModel } from './entities/user-relation.entity';
//import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  //imports: [SequelizeModule.forFeature([UserModel]), AuthModule],
  imports: [SequelizeModule.forFeature([UserModel, UserRelationModel])],
  providers: [UserService, UserRepository, UserRelationRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
