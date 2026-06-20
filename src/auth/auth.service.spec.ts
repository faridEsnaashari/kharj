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
});
