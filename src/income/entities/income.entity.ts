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
import { IncomeCategory } from '../enums/income-category.enum';
import { Account, AccountModel } from 'src/account/entities/account.entity';
import { UncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';

export type Income = {
  id: number;
  accountId: number;
  account: Account;
  amount: number;
  category: IncomeCategory;
  description?: string;
  uncompletePaymentId?: number;
  uncompletePayment?: UncompletePayment;
  remain: number;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateIncome = Omit<CreateEntity<Income>, 'account'>;
export type UpdateIncome = Omit<UpdateEntity<Income>, 'account'>;

@Table({ tableName: 'incomes', underscored: true })
export class IncomeModel extends Model<Income, CreateIncome> implements Income {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  accountId!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  amount!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: IncomeCategory;

  @AllowNull(true)
  @Column(DataType.STRING)
  description?: string;

  @AllowNull(true)
  @Column({ field: 'uncomplete_payment_id', type: DataType.INTEGER })
  uncompletePaymentId?: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;

  @AllowNull(false)
  @Column({ field: 'paid_at', type: DataType.DATE })
  paidAt!: string;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  remain!: number;

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
