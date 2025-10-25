import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getToken } from 'src/auth/logics/auth.logic';
import { extractUserFromToken } from 'src/auth/logics/jwt.logic';
import { UserRepository } from 'src/user/entities/repositories/user.repository';

@Injectable()
export class HasAccessGuard implements CanActivate {
  constructor(private userRepo: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = getToken(request.headers);
    if (!token) {
      return false;
    }

    const userObj = await extractUserFromToken(token);

    const user = await this.userRepo.findOneById(userObj.id);

    if (!user) {
      return false;
    }

    request['user'] = user;

    return true;
  }
}
