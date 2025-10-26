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
import { PaymentModel } from 'src/payment/entities/payment.entity';
import { IncomeModel } from 'src/income/entities/income.entity';

export type Exchange = {
  id: number;
  paymentId: number;
  payment: PaymentModel;
  incomeId: number;
  income: IncomeModel;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateExchange = Omit<CreateEntity<Exchange>, 'payment' | 'income'>;
export type UpdateExchange = Omit<UpdateEntity<Exchange>, 'payment' | 'income'>;

@Table({ tableName: 'exchanges', underscored: true })
export class ExchangeModel
  extends Model<Exchange, CreateExchange>
  implements Exchange
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  paymentId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  incomeId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount!: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;

  @BelongsTo(() => PaymentModel, {
    as: 'payment',
    foreignKey: 'payment_id',
  })
  payment!: PaymentModel;

  @BelongsTo(() => IncomeModel, {
    as: 'income',
    foreignKey: 'income_id',
  })
  income!: IncomeModel;
}
