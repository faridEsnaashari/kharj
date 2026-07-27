import { ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './entities/repositories/user.repository';
import { UserRelationRepository } from './entities/repositories/user-relation.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository;
  let userRelationRepository: MockRepository;

  beforeEach(() => {
    userRepository = createMockRepository();
    userRelationRepository = createMockRepository();

    service = new UserService(
      userRepository as unknown as UserRepository,
      userRelationRepository as unknown as UserRelationRepository,
    );
  });

  it('findOneUser passes through to the repository', async () => {
    userRepository.findOneByIdOrFail.mockResolvedValue({ id: 1 });

    await expect(service.findOneUser(1)).resolves.toEqual({ id: 1 });
  });

  it('findRelatedUsers merges the requesting user with their related users', async () => {
    userRepository.findOneByIdOrFail.mockResolvedValue({ id: 1, name: 'me' });
    userRelationRepository.findAll.mockResolvedValue([
      { relatedUser: { id: 2, name: 'sara' } },
      { relatedUser: { id: 3, name: 'omar' } },
    ]);

    const result = await service.findRelatedUsers(1);

    expect(result).toEqual([
      { id: 1, name: 'me' },
      { id: 2, name: 'sara' },
      { id: 3, name: 'omar' },
    ]);
  });

  describe('resolveTargetUserId', () => {
    const user = { id: 1 } as never;

    it('returns the requesting user id when no userId is requested', async () => {
      await expect(service.resolveTargetUserId(undefined, user)).resolves.toBe(
        1,
      );
      expect(userRelationRepository.findOne).not.toHaveBeenCalled();
    });

    it('returns the requesting user id when the requested userId is their own', async () => {
      await expect(service.resolveTargetUserId(1, user)).resolves.toBe(1);
      expect(userRelationRepository.findOne).not.toHaveBeenCalled();
    });

    it('returns the requested userId when it is a known relation', async () => {
      userRelationRepository.findOne.mockResolvedValue({ id: 9 });

      await expect(service.resolveTargetUserId(2, user)).resolves.toBe(2);
      expect(userRelationRepository.findOne).toHaveBeenCalledWith({
        userId: 1,
        relatedTo: 2,
      });
    });

    it('throws ForbiddenException when the requested userId is not a relation', async () => {
      userRelationRepository.findOne.mockResolvedValue(null);

      await expect(service.resolveTargetUserId(99, user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
