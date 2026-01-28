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
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';
import { PaymentSource } from '../enums/payment-source.enum';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { Payment, PaymentModel } from './payment.entity';

export type UncompeletePayment = {
  id: number;
  amount: number;
  description: string;
  paidAt: string;
  source: PaymentSource;
  remain: number;
  accountId: number;
  account: Account;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
};

export type CreateUncompeletePayment = Omit<
  CreateEntity<UncompeletePayment>,
  'account' | 'payment'
>;
export type UpdateUncompeletePayment = Omit<
  UpdateEntity<UncompeletePayment>,
  'account' | 'payment'
>;

@Table({ tableName: 'uncompelete_payments', underscored: true })
export class UncompeletePaymentModel
  extends Model<UncompeletePayment, CreateUncompeletePayment>
  implements UncompeletePayment
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  amount!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  accountId!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  description!: string;

  @AllowNull(false)
  @Column({ field: 'paid_at', type: DataType.DATE })
  paidAt!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  source!: PaymentSource;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  remain!: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: string;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: string;

  @BelongsTo(() => AccountModel, {
    as: 'account',
    foreignKey: 'accountId',
  })
  account!: Account;

  @HasOne(() => PaymentModel, {
    as: 'payment',
    foreignKey: 'uncompeletePaymentId',
  })
  payment!: Payment;
}
