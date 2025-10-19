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
