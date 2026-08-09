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

export type Unit = {
  id: number;
  userId: number | null;
  user?: User;
  name: string;
  symbol: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUnit = Omit<CreateEntity<Unit>, 'user'>;
export type UpdateUnit = Omit<UpdateEntity<Unit>, 'user'>;

@Table({ tableName: 'units', underscored: true })
export class UnitModel extends Model<Unit, CreateUnit> implements Unit {
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
