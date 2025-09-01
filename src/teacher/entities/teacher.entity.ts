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

export type Teacher = {
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

export type CreateTeacher = CreateEntity<Teacher>;
export type UpdateTeacher = UpdateEntity<Teacher>;

@Table({ tableName: 'teachers', underscored: true })
export class TeacherModel
  extends Model<Teacher, CreateTeacher>
  implements Teacher
{
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
    scope: { modelType: 'teachers' },
  })
  permissions!: UserHasPermissionModel[];

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
