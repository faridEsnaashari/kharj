import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserHasPermissionModel } from 'src/auth/entities/user-has-permission.entity';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';

export type Expert = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  nationalCode: string;
  birthOfDate: string;
  fatherName: string;
  gender: 'MALE' | 'FEMALE';
  permissions?: UserHasPermissionModel[];
  createdAt: string;
  updatedAt: string;
};

export type CreateExpert = CreateEntity<Expert>;
export type UpdateExpert = UpdateEntity<Expert>;

@Table({ tableName: 'experts', underscored: true })
export class ExpertModel extends Model<Expert, CreateExpert> implements Expert {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Default('admin')
  @Column
  firstName!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @AllowNull(false)
  @Default('admin')
  @Column
  lastName!: string;

  @AllowNull(true)
  @Column
  fatherName!: string;

  @AllowNull(true)
  @Column
  phone!: string;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  birthOfDate!: string;

  @AllowNull(true)
  @Column
  nationalCode!: string;

  @AllowNull(false)
  @Default('MALE')
  @Column
  gender!: 'MALE' | 'FEMALE';

  @HasMany(() => UserHasPermissionModel, {
    as: 'permissions',
    scope: { modelType: 'experts' },
  })
  permissions!: UserHasPermissionModel[];

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
