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
import { Unit, UnitModel } from 'src/unit/entities/unit.entity';
import { Bank, BankModel } from 'src/bank/entities/bank.entity';

export type Account = {
  id: number;
  userId: number;
  user: User;
  owner: User;
  ownedBy: number;
  ballance: number;
  bankId: number;
  bank: Bank;
  unitId: number;
  unit: Unit;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccount = Omit<
  CreateEntity<Account>,
  'user' | 'owner' | 'unit' | 'bank'
>;
export type UpdateAccount = Omit<
  UpdateEntity<Account>,
  'user' | 'owner' | 'unit' | 'bank'
>;

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
  @Column
  bankId!: number;

  @AllowNull(false)
  @Column
  unitId!: number;

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

  @BelongsTo(() => UnitModel, {
    as: 'unit',
    foreignKey: 'unitId',
  })
  unit!: Unit;

  @BelongsTo(() => BankModel, {
    as: 'bank',
    foreignKey: 'bankId',
  })
  bank!: Bank;
}
