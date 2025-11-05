import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';
import {
  CreateUserRelation,
  UpdateUserRelation,
  UserRelation,
  UserRelationModel,
} from '../user-relation.entity';

@Injectable()
export class UserRelationRepository extends CommonRepository<
  UserRelation,
  CreateUserRelation,
  UpdateUserRelation,
  UserRelationModel
> {
  constructor(@InjectModel(UserRelationModel) model: typeof UserRelationModel) {
    super(model);
  }
}
