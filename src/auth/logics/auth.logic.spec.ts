import { getToken } from './auth.logic';

describe('getToken', () => {
  it('returns false when no authorization header is present', () => {
    expect(getToken({})).toBe(false);
  });

  it('extracts the token after the Bearer prefix', () => {
    expect(getToken({ authorization: 'Bearer abc.def.ghi' })).toBe(
      'abc.def.ghi',
    );
  });

  it('returns false when the token is empty after Bearer', () => {
    expect(getToken({ authorization: 'Bearer ' })).toBe(false);
  });
});
