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
import { AccountModel } from 'src/account/entities/account.entity';

export type Income = {
  id: number;
  accountId: number;
  account: AccountModel;
  amount: number;
  category: IncomeCategory;
  description?: string;
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
  @Column(DataType.INTEGER)
  amount!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: IncomeCategory;

  @AllowNull(true)
  @Column(DataType.STRING)
  description?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;

  @BelongsTo(() => AccountModel, {
    as: 'account',
    foreignKey: 'account_id',
  })
  account!: AccountModel;
}
