import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginLogic } from './logics/login.logic';
import { UserLoginDto } from './dtos/login.dto';
import { RolesEnum } from './enums/roles.enum';
import {
  UserHasPermission,
  UserHasPermissionModel,
} from './entities/user-has-permission.entity';
import { PermissionsEnum } from './enums/permissions.enum';
import { UserRepository } from 'src/user/entities/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepo: UserRepository) {}

  getPermissions() {
    return Object.keys(PermissionsEnum);
  }

  async loginUser(loginDto: UserLoginDto): Promise<{ token: string }> {
    try {
      const user = await this.userRepo.findOne({
        where: { ...loginDto },
        include: [
          {
            model: UserHasPermissionModel,
            as: 'permissions',
          },
        ],
      });

      if (!user) {
        throw '';
      }

      const token = await loginLogic(
        loginDto.nationalCode,
        loginDto.password,
        user.permissions?.map((p: UserHasPermission) => p.permission) || [],
        RolesEnum.STUDENT,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('username or password incorrect');
    }
  }
}
