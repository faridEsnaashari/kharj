import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateUserHasPermissoin,
  UserHasPermission,
  UserHasPermissionModel,
} from '../user-has-permission.entity';

@Injectable()
export class UserHasPermissionRepository {
  constructor(
    @InjectModel(UserHasPermissionModel)
    private managerModel: typeof UserHasPermissionModel,
  ) {}

  async createBulk(
    userHasPermissions: CreateUserHasPermissoin[],
    raw = true,
  ): Promise<UserHasPermission[]> {
    const result = await this.managerModel.bulkCreate(userHasPermissions);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }
}
