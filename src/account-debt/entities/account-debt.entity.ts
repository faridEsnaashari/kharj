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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Payment, PaymentModel } from 'src/payment/entities/payment.entity';
import { User, UserModel } from 'src/user/entities/user.entity';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';

export type AccountDebt = {
  id: number;
  paymentId: number;
  payment: Payment;
  fromUserId: number;
  fromUser: User;
  toUserId: number;
  toUser: User;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountDebt = Omit<
  CreateEntity<AccountDebt>,
  'payment' | 'fromUser' | 'toUser'
>;
export type UpdateAccountDebt = Omit<
  UpdateEntity<AccountDebt>,
  'payment' | 'fromUser' | 'toUser'
>;

@Table({ tableName: 'account_debts', underscored: true })
export class AccountDebtModel
  extends Model<AccountDebt, CreateAccountDebt>
  implements AccountDebt
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => PaymentModel)
  @Column({ field: 'payment_id', type: DataType.INTEGER })
  paymentId!: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ field: 'from_user', type: DataType.INTEGER })
  fromUserId!: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ field: 'to_user', type: DataType.INTEGER })
  toUserId!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  amount!: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: string;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: string;

  @BelongsTo(() => PaymentModel, { as: 'payment', foreignKey: 'payment_id' })
  payment!: Payment;

  @BelongsTo(() => UserModel, { as: 'fromUser', foreignKey: 'from_user' })
  fromUser!: User;

  @BelongsTo(() => UserModel, { as: 'toUser', foreignKey: 'to_user' })
  toUser!: User;
}
