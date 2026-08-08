import { AuthService } from './auth.service';
import { UserRepository } from '../user/entities/repositories/user.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: MockRepository;

  beforeEach(() => {
    userRepo = createMockRepository();
    service = new AuthService(userRepo as unknown as UserRepository);
  });

  it('returns a signed token for valid credentials', async () => {
    userRepo.findOneOrFail.mockResolvedValue({ id: 1, name: 'admin' });

    const result = await service.signin({
      username: 'admin',
      password: '12345678',
    });

    expect(userRepo.findOneOrFail).toHaveBeenCalledWith({
      where: { name: 'admin', password: '12345678' },
    });
    expect(typeof result.token).toBe('string');
    expect(result.token.length).toBeGreaterThan(0);
  });

  it('propagates the repository error for invalid credentials', async () => {
    userRepo.findOneOrFail.mockRejectedValue(new Error('user not found'));

    await expect(
      service.signin({ username: 'nope', password: 'wrong' }),
    ).rejects.toThrow('user not found');
  });

  describe('signup', () => {
    it('creates a new user with a generated related_code and returns a signed token', async () => {
      userRepo.create.mockResolvedValue({ id: 5, name: 'newuser' });

      const result = await service.signup({
        username: 'newuser',
        password: '12345678',
      });

      expect(userRepo.create).toHaveBeenCalledWith({
        name: 'newuser',
        password: '12345678',
        related_code: expect.any(String),
      });
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
    });

    it('propagates a repository error', async () => {
      userRepo.create.mockRejectedValue(new Error('duplicate name'));

      await expect(
        service.signup({ username: 'dup', password: '12345678' }),
      ).rejects.toThrow('duplicate name');
    });
  });
});
