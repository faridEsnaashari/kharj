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
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';
import { PaymentCategory } from '../enums/payment-category.enum';
import { UncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';

export type Payment = {
  id: number;
  accountId: number;
  account: Account;
  amount: number;
  category: PaymentCategory;
  description?: string;
  uncompletePaymentId?: number;
  uncompletePayment?: UncompletePayment;
  isMaman: boolean;
  isFun: boolean;
  remain: number;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePayment = Omit<CreateEntity<Payment>, 'account'>;
export type UpdatePayment = Omit<UpdateEntity<Payment>, 'account'>;

@Table({ tableName: 'payments', underscored: true })
export class PaymentModel
  extends Model<Payment, CreatePayment>
  implements Payment
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column({ field: 'account_id', type: DataType.INTEGER })
  accountId!: number;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  remain!: number;

  @AllowNull(true)
  @Column({ field: 'uncomplete_payment_id', type: DataType.INTEGER })
  uncompletePaymentId?: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  amount!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: PaymentCategory;

  @AllowNull(true)
  @Column(DataType.STRING)
  description?: string;

  @AllowNull(false)
  @Column({ field: 'is_maman', type: DataType.BOOLEAN })
  isMaman!: boolean;

  @AllowNull(false)
  @Column({ field: 'is_fun', type: DataType.BOOLEAN })
  isFun!: boolean;

  @AllowNull(false)
  @Column({ field: 'paid_at', type: DataType.DATE })
  paidAt!: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: string;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: string;

  @BelongsTo(() => AccountModel, {
    as: 'account',
    foreignKey: 'account_id',
  })
  account!: Account;

  @BelongsTo(() => AccountModel, {
    as: 'uncompletePayment',
    foreignKey: 'uncomplete_payment_id',
  })
  uncompletePayment!: UncompletePayment;
}
