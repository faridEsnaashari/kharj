import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';
import { User, UserModel } from 'src/user/entities/user.entity';

export type UserRelation = {
  id: number;
  userId: number;
  user: User;
  relatedTo: number;
  relatedUser: User;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRelation = Omit<
  CreateEntity<UserRelation>,
  'user' | 'relatedUser'
>;
export type UpdateUserRelation = Omit<
  UpdateEntity<UserRelation>,
  'user' | 'relatedUser'
>;

@Table({ tableName: 'user_relations', underscored: true })
export class UserRelationModel
  extends Model<UserRelation, CreateUserRelation>
  implements UserRelation
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  relatedTo!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;

  @BelongsTo(() => UserModel, {
    as: 'user',
    foreignKey: 'user_id',
  })
  user!: User;

  @BelongsTo(() => UserModel, {
    as: 'relatedUser',
    foreignKey: 'related_to',
  })
  relatedUser!: User;
}
