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

export type Payment = {
  id: number;
  accountId: number;
  account: Account;
  amount: number;
  category: PaymentCategory;
  description?: string;
  isMaman: boolean;
  isFun: boolean;
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
}
