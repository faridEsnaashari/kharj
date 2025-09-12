import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  authenticateLogic,
  authorizeLogic,
  getToken,
} from 'src/auth/logics/auth.logic';
import { Permissions } from '../decorators/permissions.decorator';
import { Reflector } from '@nestjs/core';
import { UserRepository } from 'src/user/entities/repositories/student.repository';

@Injectable()
export class HasAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepo: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, context.getHandler());
    const request = context.switchToHttp().getRequest();

    const token = getToken(request.headers);
    if (!token) {
      return false;
    }

    const user = await authenticateLogic(token, {
      getUser: async (userObj) => this.userRepo.findOne(userObj),
    });

    if (!user) {
      return false;
    }

    const checkPermission = authorizeLogic(
      permissions || [],
      user.user?.permissions || [],
    );

    if (!checkPermission) {
      return false;
    }

    request['user'] = user.user;
    request['userRole'] = user.role;

    return true;
  }
}
