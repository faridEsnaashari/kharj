import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';
import { User, UserModel } from 'src/user/entities/user.entity';
import { Unit } from '../enums/unit.enum';

export type Account = {
  id: number;
  userId: number;
  user: User;
  owner: User;
  ownedBy: number;
  ballance: number;
  bank: string;
  unit: Unit;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccount = Omit<CreateEntity<Account>, 'user' | 'owner'>;
export type UpdateAccount = Omit<UpdateEntity<Account>, 'user' | 'owner'>;

@Table({ tableName: 'accounts', underscored: true })
export class AccountModel
  extends Model<Account, CreateAccount>
  implements Account
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  bank!: string;

  @AllowNull(false)
  @Column
  userId!: number;

  @AllowNull(false)
  @Column
  ownedBy!: number;

  @AllowNull(false)
  @Column
  ballance!: number;

  @AllowNull(false)
  @Column
  priority!: number;

  @AllowNull(false)
  @Default(Unit.RIAL)
  @Column(DataType.STRING)
  unit!: Unit;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;

  @BelongsTo(() => UserModel, {
    as: 'user',
    foreignKey: 'userId',
  })
  user!: User;

  @BelongsTo(() => UserModel, {
    as: 'owner',
    foreignKey: 'ownedBy',
  })
  owner!: User;
}
