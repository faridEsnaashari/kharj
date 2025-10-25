import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';
import { authConfig } from '../auth.config';

export function createUserToken(data: {
  name: User['name'];
  id: User['id'];
}): Promise<string> {
  return new Promise((res, rej) => {
    jwt.sign(data, authConfig.jwtSecretKey, (err, token) => {
      if (err || !token) {
        return rej('fail');
      }

      return res(token);
    });
  });
}

export async function extractUserFromToken(
  token: string,
): Promise<Pick<User, 'id' | 'name'>> {
  return await new Promise<Pick<User, 'id' | 'name'>>((res, rej) => {
    jwt.verify(token, authConfig.jwtSecretKey, (err, obj) => {
      if (err) {
        return rej('fail');
      }

      if (
        typeof obj !== 'object' ||
        typeof obj.id !== 'number' ||
        typeof obj.name !== 'string'
      ) {
        return rej('fail');
      }

      const { id, name } = obj;
      return res({ id, name });
    });
  });
}
