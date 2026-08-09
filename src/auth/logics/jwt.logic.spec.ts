import * as jwt from 'jsonwebtoken';
import { createUserToken, extractUserFromToken } from './jwt.logic';
import { authConfig } from '../auth.config';

describe('createUserToken / extractUserFromToken', () => {
  it('creates a token and successfully round-trips it back to the payload', async () => {
    const token = await createUserToken({ id: 7, name: 'sara' });

    expect(typeof token).toBe('string');

    const decoded = await extractUserFromToken(token);

    expect(decoded).toEqual({ id: 7, name: 'sara' });
  });

  it('rejects an invalid token', async () => {
    await expect(extractUserFromToken('not-a-real-token')).rejects.toBe('fail');
  });

  it('rejects a token whose payload is missing id/name', async () => {
    const malformedToken = jwt.sign(
      { somethingElse: true },
      authConfig.jwtSecretKey,
    );

    await expect(extractUserFromToken(malformedToken)).rejects.toBe('fail');
  });
});
