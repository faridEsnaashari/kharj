import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';

export type User = {
  id: number;
  name: string;
  related_code: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUser = CreateEntity<User>;
export type UpdateUser = UpdateEntity<User>;

@Table({ tableName: 'users', underscored: true })
export class UserModel extends Model<User, CreateUser> implements User {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  related_code!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
