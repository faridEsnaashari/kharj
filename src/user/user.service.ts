import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './entities/repositories/user.repository';
import { User, UserModel } from './entities/user.entity';
import { UserRelationRepository } from './entities/repositories/user-relation.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userRelationRepository: UserRelationRepository,
  ) {}

  async findOneUser(id: User['id']): Promise<User | null> {
    return this.userRepository.findOneByIdOrFail(id);
  }

  async findRelatedUsers(userId: User['id']): Promise<User[]> {
    const user = await this.userRepository.findOneByIdOrFail(userId);

    const relatedUsersRelations = await this.userRelationRepository.findAll({
      where: { userId },
      include: [
        {
          model: UserModel,
          as: 'relatedUser',
        },
      ],
    });

    const relatedUsers = relatedUsersRelations.map(
      (relation) => relation.relatedUser,
    );

    return [user, ...relatedUsers];
  }

  async resolveTargetUserId(
    requestedUserId: number | undefined,
    user: User,
  ): Promise<number> {
    if (!requestedUserId || requestedUserId === user.id) {
      return user.id;
    }

    const relation = await this.userRelationRepository.findOne({
      userId: user.id,
      relatedTo: requestedUserId,
    });

    if (!relation) {
      throw new ForbiddenException('user-not-related');
    }

    return requestedUserId;
  }
}
