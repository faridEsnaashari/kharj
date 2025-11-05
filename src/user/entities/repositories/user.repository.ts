import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import { CreateUser, UpdateUser, User, UserModel } from '../user.entity';

@Injectable()
export class UserRepository extends CommonRepository<
  User,
  CreateUser,
  UpdateUser,
  UserModel
> {
  constructor(@InjectModel(UserModel) model: typeof UserModel) {
    super(model);
  }
}
