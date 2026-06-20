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

export type Bank = {
  id: number;
  userId: number | null;
  user?: User;
  name: string;
  symbol: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBank = Omit<CreateEntity<Bank>, 'user'>;
export type UpdateBank = Omit<UpdateEntity<Bank>, 'user'>;

@Table({ tableName: 'banks', underscored: true })
export class BankModel extends Model<Bank, CreateBank> implements Bank {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(true)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  userId!: number | null;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  symbol!: string;

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
}
