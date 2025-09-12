import * as jwt from 'jsonwebtoken';
import { authConfigs } from '../auth.configs';
import { RolesEnum } from '../enums/roles.enum';
import { PermissionsEnum } from '../enums/permissions.enum';
import { User } from 'src/user/entities/user.entity';

export async function authenticateLogic(
  token: string,
  getUserFn,
): Promise<
  | {
      user: User;
      role: RolesEnum;
    }
  | false
> {
  const userObj = jwt.verify(token, authConfigs.jwtSecretKey);

  if (
    typeof userObj === 'string' ||
    typeof userObj.username !== 'string' ||
    typeof userObj.password !== 'string' ||
    typeof userObj.role !== 'string'
  ) {
    return false;
  }

  const user = await authenticateModelLogic(
    { username: userObj.username, password: userObj.password },
    getUserFn,
  );

  if (!user) {
    return false;
  }

  return {
    user: {
      ...user,
      permissions: userObj.permissions || [],
    },
    role: RolesEnum.ADMIN,
  };
}

async function authenticateModelLogic(
  userObj: { username: string; password: string },
  getUser: (userObj: {
    nationalCode: string;
    password: string;
  }) => Promise<User | null>,
): Promise<User | false> {
  const user = await getUser({
    nationalCode: userObj.username,
    password: userObj.password,
  });

  if (!user) {
    return false;
  }

  return user;
}

export function getToken(headerObject: {
  authorization?: string;
}): string | false {
  if (!headerObject.authorization) {
    return false;
  }

  const token = headerObject.authorization.split('Bearer ')[1];
  if (token.length < 1) {
    return false;
  }

  return token;
}

export function authorizeLogic(
  neededPermission: PermissionsEnum[],
  userPermissions: PermissionsEnum[],
): boolean {
  if (userPermissions.includes(PermissionsEnum.ALL)) {
    return true;
  }

  return neededPermission.every((np) => userPermissions.includes(np));
}
