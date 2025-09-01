import * as jwt from 'jsonwebtoken';
import { authConfigs } from '../auth.configs';
import { RolesEnum } from '../enums/roles.enum';
import { PermissionsEnum } from '../enums/permissions.enum';

export async function loginLogic(
  username: string,
  password: string,
  permissions: PermissionsEnum[],
  role: RolesEnum,
): Promise<string> {
  return new Promise((res, rej) => {
    jwt.sign(
      { username, password, role, permissions },
      authConfigs.jwtSecretKey,
      (err: Error | null, encoded: string | undefined) => {
        if (err || !encoded) {
          rej(err);
          return;
        }

        res(encoded);
      },
    );
  });
}
