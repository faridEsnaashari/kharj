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
  Default,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { UncompletePaymentSource } from '../enums/uncomplete-payment-source.enum';
import { Payment, PaymentModel } from 'src/payment/entities/payment.entity';
import { UncompletePaymentType } from '../enums/uncomplete-payment-type.enum';
import { Income, IncomeModel } from 'src/income/entities/income.entity';

export type UncompletePayment = {
  id: number;
  amount: number;
  description: string;
  paidAt: string;
  source: UncompletePaymentSource;
  remain: number;
  accountId: number;
  account: Account;
  type: UncompletePaymentType;
  payment?: Payment;
  income?: Income;
  createdAt: string;
  updatedAt: string;
};

export type CreateUncompletePayment = Omit<
  CreateEntity<UncompletePayment>,
  'account' | 'payment'
>;
export type UpdateUncompletePayment = Omit<
  UpdateEntity<UncompletePayment>,
  'account' | 'payment'
>;

@Table({ tableName: 'uncomplete_payments', underscored: true })
export class UncompletePaymentModel
  extends Model<UncompletePayment, CreateUncompletePayment>
  implements UncompletePayment
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
  source!: UncompletePaymentSource;

  @AllowNull(false)
  @Default(UncompletePaymentType.PAYMENT)
  @Column(DataType.STRING)
  type!: UncompletePaymentType;

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

  @HasOne(() => IncomeModel, {
    as: 'income',
    foreignKey: 'uncompletePaymentId',
  })
  income!: Income;

  @HasOne(() => PaymentModel, {
    as: 'payment',
    foreignKey: 'uncompletePaymentId',
  })
  payment!: Payment;
}
